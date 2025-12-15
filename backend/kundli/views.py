from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import BirthDetails
from .serializers import (
    BirthDetailsSerializer,
    KundliResponseSerializer,
    HoroscopeSerializer
)
from .services import VedicAstroService

class GenerateKundliView(APIView):
    """
    Generate a Kundli chart from birth details.
    Saves the birth details if user is authenticated.
    """
    permission_classes = [AllowAny] # Allow guests to try

    def post(self, request):
        serializer = BirthDetailsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Save if authenticated
        if request.user.is_authenticated:
            birth_details = serializer.save(user=request.user)
        else:
            # For guests, we don't save to DB (or save without user)
            # But the serializer.save() would fail if we don't handle it
            # So we just use the validated data for generation
            birth_details = serializer.save() # Saves anonymously
            
        # Generate Chart
        svg = VedicAstroService.generate_chart_svg(serializer.validated_data)
        
        response_data = {
            'svg': svg,
            'details': serializer.data,
            'planets': ['Sun (Leo)', 'Moon (Tau)'] # Mock
        }
        
        return Response(response_data, status=status.HTTP_201_CREATED)

class DailyHoroscopeView(APIView):
    """
    Get daily horoscope for a specific sign.
    """
    permission_classes = [AllowAny]
    
    def get(self, request, sign):
        data = VedicAstroService.get_daily_horoscope(sign)
        serializer = HoroscopeSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)

class KundliDetailView(APIView):
    """
    Get a specific saved kundli by ID and re-generate the chart.
    """
    permission_classes = [AllowAny] 
    
    def get(self, request, pk):
        try:
            birth_details = BirthDetails.objects.get(pk=pk)
            
            # Re-generate chart (Service is deterministic)
            serializer = BirthDetailsSerializer(birth_details)
            svg = VedicAstroService.generate_chart_svg(serializer.data)
            
            response_data = {
                'svg': svg,
                'details': serializer.data,
                'planets': ['Sun (Leo)', 'Moon (Tau)'] # Mock
            }
            return Response(response_data)
        except BirthDetails.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

class SavedKundliListView(generics.ListAPIView):
    """
    List saved kundlis for logged-in user.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = BirthDetailsSerializer
    
    def get_queryset(self):
        return BirthDetails.objects.filter(user=self.request.user).order_by('-created_at')
