from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Consultation, ChatMessage
from accounts.serializers import UserSerializer

User = get_user_model()


class ChatMessageSerializer(serializers.ModelSerializer):
    """Serializer for chat messages."""
    sender = UserSerializer(read_only=True)
    is_from_customer = serializers.BooleanField(read_only=True)
    is_from_astrologer = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = ChatMessage
        fields = [
            'id', 'consultation', 'sender', 'message', 'is_read',
            'is_from_customer', 'is_from_astrologer', 'created_at'
        ]
        read_only_fields = ['id', 'sender', 'created_at']


class ConsultationSerializer(serializers.ModelSerializer):
    """Serializer for consultations."""
    customer = UserSerializer(read_only=True)
    astrologer = UserSerializer(read_only=True)
    elapsed_minutes = serializers.IntegerField(read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    messages = ChatMessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Consultation
        fields = [
            'id', 'customer', 'astrologer', 'consultation_type', 'status',
            'started_at', 'ended_at', 'duration_minutes', 'elapsed_minutes',
            'rate_per_minute', 'total_cost', 'free_minutes_used',
            'is_active', 'created_at', 'messages'
        ]
        read_only_fields = [
            'id', 'customer', 'started_at', 'ended_at', 'duration_minutes',
            'total_cost', 'created_at', 'messages'
        ]


class ConsultationListSerializer(serializers.ModelSerializer):
    """Compact serializer for consultation listing."""
    customer_name = serializers.CharField(source='customer.get_full_name', read_only=True)
    astrologer_name = serializers.CharField(source='astrologer.get_full_name', read_only=True)
    elapsed_minutes = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Consultation
        fields = [
            'id', 'customer_name', 'astrologer_name', 'consultation_type',
            'status', 'started_at', 'duration_minutes', 'elapsed_minutes',
            'total_cost', 'created_at'
        ]


class StartConsultationSerializer(serializers.Serializer):
    """Serializer for starting a consultation."""
    astrologer_id = serializers.IntegerField()
    consultation_type = serializers.ChoiceField(choices=['chat', 'call'])
    
    def validate_astrologer_id(self, value):
        try:
            astrologer = User.objects.get(id=value,  role='astrologer')
            if not hasattr(astrologer, 'astrologer_profile'):
                raise serializers.ValidationError("Invalid astrologer")
            if not astrologer.astrologer_profile.is_online:
                raise serializers.ValidationError("Astrologer is not online")
            return value
        except User.DoesNotExist:
            raise serializers.ValidationError("Astrologer not found")
