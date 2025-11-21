from rest_framework import serializers
from .models import User, AstrologerProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name']

class AstrologerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = AstrologerProfile
        fields = [
            'user', 'expertise', 'languages', 
            'rating', 'is_online', 'total_consultations',
            'chat_rate', 'call_rate', 'video_rate'
        ]