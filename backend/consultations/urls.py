from django.urls import path
from . import views

app_name = 'consultations'

urlpatterns = [
    # Consultation Management
    path('start/', views.StartConsultationView.as_view(), name='start'),
    path('my/', views.MyConsultationsView.as_view(), name='my-consultations'),
    path('<int:pk>/', views.ConsultationDetailView.as_view(), name='detail'),
    path('<int:pk>/end/', views.EndConsultationView.as_view(), name='end'),
    
    # Chat History
    path('<int:consultation_id>/messages/', views.ChatHistoryView.as_view(), name='chat-history'),
]
