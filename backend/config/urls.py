from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

# --- 1. Define the Home View ---
def home(request):
    return JsonResponse({
        "message": "AstroCRM Backend is Running Successfully!", 
        "status": "Online",
        "docs": "/admin/"
    })

# --- 2. Define URL Patterns ---
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),
    
    # --- CRITICAL FIX: This connects your Accounts App ---
    path('api/accounts/', include('accounts.urls')),
    path('api/kundli/', include('kundli.urls')),
    path('api/consultation/', include('consultation.urls')),
]

# --- 3. Serve Media Files in Development ---
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
