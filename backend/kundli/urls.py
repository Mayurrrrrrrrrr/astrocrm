from django.urls import path
from . import views

urlpatterns = [
    path('generate/', views.GenerateKundliView.as_view(), name='generate-kundli'),
    path('<int:pk>/', views.KundliDetailView.as_view(), name='kundli-detail'),
    path('saved/', views.SavedKundliListView.as_view(), name='saved-kundlis'),
    path('horoscope/<str:sign>/', views.DailyHoroscopeView.as_view(), name='daily-horoscope'),
]
