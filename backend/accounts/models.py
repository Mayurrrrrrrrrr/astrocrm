from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
import random


class UserManager(BaseUserManager):
    """Custom user manager for phone-based authentication."""
    
    def create_user(self, phone_number, password=None, **extra_fields):
        if not phone_number:
            raise ValueError('Phone number is required')
        
        phone_number = self.normalize_phone(phone_number)
        user = self.model(phone_number=phone_number, **extra_fields)
        if password:
            user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, phone_number, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        return self.create_user(phone_number, password, **extra_fields)
    
    @staticmethod
    def normalize_phone(phone_number):
        """Remove spaces and normalize phone number."""
        phone = ''.join(filter(str.isdigit, phone_number))
        # Add country code if not present (default India)
        if len(phone) == 10:
            phone = '91' + phone
        return phone


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom User model with phone number as primary identifier.
    Supports both customers and astrologers.
    """
    
    class Role(models.TextChoices):
        CUSTOMER = 'customer', 'Customer'
        ASTROLOGER = 'astrologer', 'Astrologer'
        ADMIN = 'admin', 'Admin'
    
    # Core fields
    phone_number = models.CharField(max_length=15, unique=True, db_index=True)
    email = models.EmailField(blank=True, null=True)
    
    # Profile
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    profile_pic = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    
    # Role & Permissions
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CUSTOMER)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    # Wallet (for future payments)
    wallet_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    # Preferences
    preferred_language = models.CharField(max_length=10, default='en')
    push_notifications_enabled = models.BooleanField(default=True)
    
    # Timestamps
    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(null=True, blank=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = []
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return f"{self.phone_number} ({self.get_full_name() or self.role})"
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()
    
    def get_short_name(self):
        return self.first_name or self.phone_number[-4:]
    
    @property
    def is_astrologer(self):
        return self.role == self.Role.ASTROLOGER


class OTP(models.Model):
    """OTP model for phone verification."""
    
    phone_number = models.CharField(max_length=15, db_index=True)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)
    attempts = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'otps'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"OTP for {self.phone_number}"
    
    @classmethod
    def generate(cls, phone_number):
        """Generate a new OTP for the phone number."""
        # Delete old OTPs for this number
        cls.objects.filter(phone_number=phone_number).delete()
        
        # Generate 6-digit OTP
        otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        
        return cls.objects.create(phone_number=phone_number, otp=otp)
    
    def is_valid(self):
        """Check if OTP is still valid (not expired, not too many attempts)."""
        from django.conf import settings
        expiry_minutes = getattr(settings, 'OTP_EXPIRY_MINUTES', 5)
        
        if self.is_verified:
            return False
        if self.attempts >= 3:
            return False
        
        expiry_time = self.created_at + timezone.timedelta(minutes=expiry_minutes)
        return timezone.now() < expiry_time
    
    def verify(self, otp_code):
        """Verify the OTP code."""
        from django.conf import settings
        
        self.attempts += 1
        self.save()
        
        # Bypass in development mode
        if getattr(settings, 'OTP_BYPASS_IN_DEV', False):
            self.is_verified = True
            self.save()
            return True
        
        if self.otp == otp_code and self.is_valid():
            self.is_verified = True
            self.save()
            return True
        
        return False


class AstrologerProfile(models.Model):
    """Extended profile for astrologers with professional details."""
    
    class VerificationStatus(models.TextChoices):
        PENDING = 'pending', 'Pending'
        VERIFIED = 'verified', 'Verified'
        REJECTED = 'rejected', 'Rejected'
    
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='astrologer_profile'
    )
    
    # Professional Details
    display_name = models.CharField(max_length=100, blank=True)
    expertise = models.JSONField(default=list, help_text="e.g. ['Vedic', 'Tarot', 'Vastu']")
    languages = models.JSONField(default=list, help_text="e.g. ['Hindi', 'English']")
    experience_years = models.IntegerField(default=1)
    bio = models.TextField(blank=True, max_length=500)
    
    # Pricing (Per Minute in INR)
    chat_rate = models.DecimalField(max_digits=6, decimal_places=2, default=10.00)
    call_rate = models.DecimalField(max_digits=6, decimal_places=2, default=20.00)
    
    # Status
    is_online = models.BooleanField(default=False)
    is_busy = models.BooleanField(default=False)
    
    # Ratings
    rating = models.FloatField(default=5.0)
    total_consultations = models.IntegerField(default=0)
    total_reviews = models.IntegerField(default=0)
    
    # Verification (Video KYC feature)
    verification_status = models.CharField(
        max_length=20, 
        choices=VerificationStatus.choices, 
        default=VerificationStatus.PENDING
    )
    kyc_video = models.FileField(upload_to='kyc_videos/', null=True, blank=True)
    verified_at = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'astrologer_profiles'
    
    def __str__(self):
        return f"Astrologer: {self.display_name or self.user.phone_number}"
    
    @property
    def status(self):
        """Return current availability status."""
        if not self.is_online:
            return 'offline'
        if self.is_busy:
            return 'busy'
        return 'online'