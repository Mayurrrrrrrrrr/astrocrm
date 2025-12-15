from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

from .models import OTP, AstrologerProfile
from .serializers import (
    SendOTPSerializer, 
    VerifyOTPSerializer, 
    UserSerializer,
    UserUpdateSerializer,
    AstrologerProfileSerializer,
    AstrologerListSerializer
)
from .services import send_otp_sms

User = get_user_model()


class SendOTPView(APIView):
    """Send OTP to phone number for authentication."""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        phone_number = serializer.validated_data['phone_number']
        
        # Generate OTP
        otp_obj = OTP.generate(phone_number)
        
        # Send OTP via SMS (or bypass in dev)
        success = send_otp_sms(phone_number, otp_obj.otp)
        
        return Response({
            'message': 'OTP sent successfully',
            'phone_number': phone_number,
            # Only include OTP in dev mode for testing
            'otp': otp_obj.otp if success == 'dev' else None
        }, status=status.HTTP_200_OK)


class VerifyOTPView(APIView):
    """Verify OTP and return JWT tokens."""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        phone_number = serializer.validated_data['phone_number']
        otp_code = serializer.validated_data['otp']
        
        # Find and verify OTP
        try:
            otp_obj = OTP.objects.filter(
                phone_number=phone_number,
                is_verified=False
            ).latest('created_at')
        except OTP.DoesNotExist:
            return Response({
                'error': 'No OTP found. Please request a new OTP.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not otp_obj.is_valid():
            return Response({
                'error': 'OTP expired. Please request a new OTP.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not otp_obj.verify(otp_code):
            return Response({
                'error': 'Invalid OTP. Please try again.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get or create user
        user, created = User.objects.get_or_create(phone_number=phone_number)
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Login successful',
            'is_new_user': created,
            'user': UserSerializer(user).data,
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        }, status=status.HTTP_200_OK)


class MeView(APIView):
    """Get current user profile."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        data = serializer.data
        
        # Include astrologer profile if applicable
        if request.user.is_astrologer:
            try:
                profile = request.user.astrologer_profile
                data['astrologer_profile'] = AstrologerProfileSerializer(profile).data
            except AstrologerProfile.DoesNotExist:
                pass
        
        return Response(data)
    
    def patch(self, request):
        serializer = UserUpdateSerializer(
            request.user, 
            data=request.data, 
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(UserSerializer(request.user).data)


class AstrologerListView(APIView):
    """List all verified astrologers with filters."""
    permission_classes = [AllowAny]
    
    def get(self, request):
        queryset = AstrologerProfile.objects.filter(
            verification_status='verified'
        ).select_related('user')
        
        # Filters
        expertise = request.query_params.get('expertise')
        if expertise:
            queryset = queryset.filter(expertise__contains=[expertise])
        
        language = request.query_params.get('language')
        if language:
            queryset = queryset.filter(languages__contains=[language])
        
        is_online = request.query_params.get('online')
        if is_online == 'true':
            queryset = queryset.filter(is_online=True, is_busy=False)
        
        # Ordering
        order = request.query_params.get('order', '-rating')
        if order in ['rating', '-rating', 'chat_rate', '-chat_rate', 'experience_years']:
            queryset = queryset.order_by(order)
        
        serializer = AstrologerListSerializer(queryset, many=True)
        return Response({
            'count': queryset.count(),
            'results': serializer.data
        })


class AstrologerDetailView(APIView):
    """Get detailed astrologer profile."""
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        try:
            profile = AstrologerProfile.objects.select_related('user').get(pk=pk)
        except AstrologerProfile.DoesNotExist:
            return Response({
                'error': 'Astrologer not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = AstrologerProfileSerializer(profile)
        return Response(serializer.data)