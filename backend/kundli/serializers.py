from rest_framework import serializers
from .models import BirthDetails

class BirthDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BirthDetails
        fields = '__all__'
        read_only_fields = ['user', 'created_at']

class KundliResponseSerializer(serializers.Serializer):
    svg = serializers.CharField()
    details = BirthDetailsSerializer()
    planets = serializers.ListField(child=serializers.CharField(), required=False)

class HoroscopeSerializer(serializers.Serializer):
    sign = serializers.CharField()
    date = serializers.CharField()
    prediction = serializers.CharField()
    lucky_number = serializers.IntegerField()
    lucky_color = serializers.CharField()
