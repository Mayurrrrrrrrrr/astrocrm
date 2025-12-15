from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()


class Consultation(models.Model):
    """
    Consultation session between customer and astrologer.
    Tracks the entire lifecycle of a consultation.
    """
    
    class ConsultationType(models.TextChoices):
        CHAT = 'chat', 'Chat'
        CALL = 'call', 'Call'
    
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        ACTIVE = 'active', 'Active'
        COMPLETED = 'completed', 'Completed'
        CANCELLED = 'cancelled', 'Cancelled'
    
    # Participants
    customer = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='customer_consultations'
    )
    astrologer = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='astrologer_consultations'
    )
    
    # Session details
    consultation_type = models.CharField(
        max_length=10, 
        choices=ConsultationType.choices,
        default=ConsultationType.CHAT
    )
    status = models.CharField(
        max_length=20, 
        choices=Status.choices, 
        default=Status.PENDING
    )
    
    # Timing
    started_at = models.DateTimeField(null=True, blank=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    duration_minutes = models.IntegerField(default=0, help_text="Duration in minutes")
    
    # Pricing
    rate_per_minute = models.DecimalField(max_digits=6, decimal_places=2)
    total_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    # Free minutes promotion
    free_minutes_used = models.IntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'consultations'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['customer', 'status']),
            models.Index(fields=['astrologer', 'status']),
        ]
    
    def __str__(self):
        return f"{self.consultation_type.upper()} - {self.customer.phone_number} with {self.astrologer.phone_number}"
    
    def start_session(self):
        """Start the consultation session."""
        self.status = self.Status.ACTIVE
        self.started_at = timezone.now()
        self.save()
    
    def end_session(self):
        """End the consultation and calculate costs."""
        self.status = self.Status.COMPLETED
        self.ended_at = timezone.now()
        
        if self.started_at:
            duration = (self.ended_at - self.started_at).total_seconds() / 60
            self.duration_minutes = int(duration)
            
            # Calculate billable minutes (after free minutes)
            billable_minutes = max(0, self.duration_minutes - self.free_minutes_used)
            self.total_cost = billable_minutes * self.rate_per_minute
        
        self.save()
    
    @property
    def is_active(self):
        return self.status == self.Status.ACTIVE
    
    @property
    def elapsed_minutes(self):
        """Get current elapsed minutes if session is active."""
        if self.is_active and self.started_at:
            elapsed = (timezone.now() - self.started_at).total_seconds() / 60
            return int(elapsed)
        return self.duration_minutes


class ChatMessage(models.Model):
    """
    Individual chat message within a consultation.
    """
    
    consultation = models.ForeignKey(
        Consultation, 
        on_delete=models.CASCADE, 
        related_name='messages'
    )
    sender = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='sent_messages'
    )
    
    # Message content
    message = models.TextField()
    
    # Metadata
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'chat_messages'
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['consultation', 'created_at']),
        ]
    
    def __str__(self):
        return f"Message from {self.sender.phone_number} at {self.created_at}"
    
    @property
    def is_from_customer(self):
        return self.sender == self.consultation.customer
    
    @property
    def is_from_astrologer(self):
        return self.sender == self.consultation.astrologer
