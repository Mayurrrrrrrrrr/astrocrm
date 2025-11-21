from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    """
    Custom User model extending Django's default.
    Differentiates between a normal Customer and an Astrologer.
    """
    is_astrologer = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
    profile_pic = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    
    # Wallet balance for customers
    wallet_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return self.username

class AstrologerProfile(models.Model):
    """
    Extended profile specifically for Astrologers.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='astrologer_profile')
    
    # Professional Details
    expertise = models.CharField(max_length=255, help_text="e.g. Vedic, Tarot, Vastu")
    languages = models.CharField(max_length=255, help_text="e.g. Hindi, English")
    experience_years = models.IntegerField(default=1)
    bio = models.TextField(blank=True)
    
    # Pricing (Per Minute)
    chat_rate = models.DecimalField(max_digits=6, decimal_places=2, default=10.00)
    call_rate = models.DecimalField(max_digits=6, decimal_places=2, default=20.00)
    video_rate = models.DecimalField(max_digits=6, decimal_places=2, default=50.00)
    
    # Status
    is_online = models.BooleanField(default=False)
    rating = models.FloatField(default=5.0)
    total_consultations = models.IntegerField(default=0)

    def __str__(self):
        return f"Astrologer {self.user.username}"