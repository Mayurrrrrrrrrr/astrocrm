from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    SendOTPView,
    VerifyOTPView,
    MeView,
    AstrologerListView,
    AstrologerDetailView
)

urlpatterns = [
    # Auth
    path('auth/send-otp/', SendOTPView.as_view(), name='send-otp'),
    path('auth/verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    
    # User
    path('me/', MeView.as_view(), name='me'),
    
    # Astrologers
    path('astrologers/', AstrologerListView.as_view(), name='astrologer-list'),
    path('astrologers/<int:pk>/', AstrologerDetailView.as_view(), name='astrologer-detail'),
]