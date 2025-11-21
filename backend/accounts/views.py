from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import AstrologerProfile
from .serializers import AstrologerProfileSerializer

@api_view(['GET'])
def get_demo_astrologer(request):
    """
    Returns the first astrologer in the database for testing.
    """
    astrologer = AstrologerProfile.objects.first()
    
    if not astrologer:
        return Response({"error": "No Astrologers found in DB"}, status=404)
    
    serializer = AstrologerProfileSerializer(astrologer)
    return Response(serializer.data)