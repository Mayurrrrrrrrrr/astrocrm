from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import OTP, AstrologerProfile

User = get_user_model()


class SendOTPSerializer(serializers.Serializer):
    """Serializer for sending OTP."""
    phone_number = serializers.CharField(max_length=15)
    
    def validate_phone_number(self, value):
        # Normalize phone number
        phone = ''.join(filter(str.isdigit, value))
        if len(phone) < 10:
            raise serializers.ValidationError("Invalid phone number")
        if len(phone) == 10:
            phone = '91' + phone
        return phone


class VerifyOTPSerializer(serializers.Serializer):
    """Serializer for verifying OTP and getting tokens."""
    phone_number = serializers.CharField(max_length=15)
    otp = serializers.CharField(max_length=6, min_length=6)
    
    def validate_phone_number(self, value):
        phone = ''.join(filter(str.isdigit, value))
        if len(phone) == 10:
            phone = '91' + phone
        return phone


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    
    class Meta:
        model = User
        fields = [
            'id', 'phone_number', 'email', 'first_name', 'last_name',
            'role', 'profile_pic', 'wallet_balance', 'preferred_language',
            'date_joined'
        ]
        read_only_fields = ['id', 'phone_number', 'role', 'wallet_balance', 'date_joined']


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile."""
    
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'profile_pic', 'preferred_language']


class AstrologerProfileSerializer(serializers.ModelSerializer):
    """Serializer for astrologer profiles."""
    user = UserSerializer(read_only=True)
    status = serializers.CharField(read_only=True)
    
    class Meta:
        model = AstrologerProfile
        fields = [
            'id', 'user', 'display_name', 'expertise', 'languages',
            'experience_years', 'bio', 'chat_rate', 'call_rate',
            'is_online', 'is_busy', 'status', 'rating', 
            'total_consultations', 'total_reviews', 'verification_status'
        ]
        read_only_fields = ['id', 'rating', 'total_consultations', 'total_reviews', 'verification_status']


class AstrologerListSerializer(serializers.ModelSerializer):
    """Compact serializer for astrologer listing."""
    phone_number = serializers.CharField(source='user.phone_number', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    profile_pic = serializers.ImageField(source='user.profile_pic', read_only=True)
    status = serializers.CharField(read_only=True)
    
    class Meta:
        model = AstrologerProfile
        fields = [
            'id', 'phone_number', 'first_name', 'display_name', 'profile_pic',
            'expertise', 'languages', 'experience_years', 'chat_rate',
            'status', 'rating', 'total_consultations'
        ]