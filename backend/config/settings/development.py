"""
Development settings for AstroCRM.
"""
from .base import *

DEBUG = True
SECRET_KEY = 'django-insecure-dev-key-change-in-production-!@#$'

ALLOWED_HOSTS = ['localhost', '127.0.0.1', '10.0.2.2']  # 10.0.2.2 for Android emulator

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# CORS - Allow all in development
CORS_ALLOW_ALL_ORIGINS = True

# Channels - In-memory for development
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer"
    }
}

# Disable OTP verification in dev (use any 6 digits)
OTP_BYPASS_IN_DEV = True
