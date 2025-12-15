from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import OTP, AstrologerProfile

User = get_user_model()


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['phone_number', 'first_name', 'role', 'is_active', 'date_joined']
    list_filter = ['role', 'is_active', 'is_staff']
    search_fields = ['phone_number', 'first_name', 'last_name', 'email']
    ordering = ['-date_joined']


@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ['phone_number', 'otp', 'is_verified', 'attempts', 'created_at']
    list_filter = ['is_verified']
    search_fields = ['phone_number']
    ordering = ['-created_at']


@admin.register(AstrologerProfile)
class AstrologerProfileAdmin(admin.ModelAdmin):
    list_display = ['display_name', 'user', 'verification_status', 'is_online', 'rating', 'total_consultations']
    list_filter = ['verification_status', 'is_online']
    search_fields = ['display_name', 'user__phone_number']
    ordering = ['-created_at']