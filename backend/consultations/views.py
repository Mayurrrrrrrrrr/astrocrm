from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts.models import Q
from django.contrib.auth import get_user_model

from .models import Consultation, ChatMessage
from .serializers import (
    ConsultationSerializer,
    ConsultationListSerializer,
    ChatMessageSerializer,
    StartConsultationSerializer,
)

User = get_user_model()


class StartConsultationView(APIView):
    """Start a new consultation session."""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = StartConsultationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        astrologer = User.objects.get(id=serializer.validated_data['astrologer_id'])
        consultation_type = serializer.validated_data['consultation_type']
        
        # Get rate from astrologer profile
        profile = astrologer.astrologer_profile
        rate = profile.chat_rate if consultation_type == 'chat' else profile.call_rate
        
        # Create consultation
        consultation = Consultation.objects.create(
            customer=request.user,
            astrologer=astrologer,
            consultation_type=consultation_type,
            rate_per_minute=rate,
            free_minutes_used=5 if request.user.customer_consultations.count() == 0 else 0
        )
        
        # Auto-start chat sessions
        if consultation_type == 'chat':
            consultation.start_session()
        
        return Response(
            ConsultationSerializer(consultation).data,
            status=status.HTTP_201_CREATED
        )


class MyConsultationsView(generics.ListAPIView):
    """List user's consultations."""
    permission_classes = [IsAuthenticated]
    serializer_class = ConsultationListSerializer
    
    def get_queryset(self):
        user = self.request.user
        return Consultation.objects.filter(
            Q(customer=user) | Q(astrologer=user)
        ).select_related('customer', 'astrologer')


class ConsultationDetailView(generics.RetrieveAPIView):
    """Get consultation details with messages."""
    permission_classes = [IsAuthenticated]
    serializer_class = ConsultationSerializer
    
    def get_queryset(self):
        user = self.request.user
        return Consultation.objects.filter(
            Q(customer=user) | Q(astrologer=user)
        ).prefetch_related('messages__sender')


class EndConsultationView(APIView):
    """End an active consultation."""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        try:
            consultation = Consultation.objects.get(
                pk=pk,
                status='active'
            )
            # Only participants can end
            if request.user not in [consultation.customer, consultation.astrologer]:
                return Response(
                    {'error': 'Not authorized'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            consultation.end_session()
            
            return Response(
                ConsultationSerializer(consultation).data
            )
        except Consultation.DoesNotExist:
            return Response(
                {'error': 'Consultation not found or not active'},
                status=status.HTTP_404_NOT_FOUND
            )


class ChatHistoryView(generics.ListAPIView):
    """Get chat history for a consultation."""
    permission_classes = [IsAuthenticated]
    serializer_class = ChatMessageSerializer
    
    def get_queryset(self):
        consultation_id = self.kwargs.get('consultation_id')
        user = self.request.user
        
        # Verify user is part of the consultation
        consultation = Consultation.objects.filter(
            id=consultation_id
        ).filter(
            Q(customer=user) | Q(astrologer=user)
        ).first()
        
        if not consultation:
            return ChatMessage.objects.none()
        
        return ChatMessage.objects.filter(
            consultation=consultation
        ).select_related('sender')
