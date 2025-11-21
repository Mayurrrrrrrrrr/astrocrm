from rest_framework import serializers

class BirthDetailsSerializer(serializers.Serializer):
    year = serializers.IntegerField(min_value=1)
    month = serializers.IntegerField(min_value=1, max_value=12)
    day = serializers.IntegerField(min_value=1, max_value=31)
    hour = serializers.IntegerField(min_value=0, max_value=23)
    minute = serializers.IntegerField(min_value=0, max_value=59)
    lat = serializers.FloatField()
    lon = serializers.FloatField()
    tzone = serializers.FloatField()