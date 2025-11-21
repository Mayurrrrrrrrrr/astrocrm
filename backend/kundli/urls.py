from django.urls import path
from .views import KundliGenerateView

urlpatterns = [
    path('generate/', KundliGenerateView.as_view(), name='kundli-generate'),
]