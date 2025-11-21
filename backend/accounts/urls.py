from django.urls import path
from . import views

urlpatterns = [
    path('demo-profile/', views.get_demo_astrologer, name='demo-profile'),
]