import requests
from django.conf import settings

# NOTE: efficient error handling is crucial for external APIs.
# Ensure ASTRO_API_KEY is set in your settings.py or .env file.

def get_kundli_data(year, month, day, hour, minute, lat, lon, tzone):
    """
    Fetches planetary positions (Kundli) from VedicAstroAPI.
    
    Args:
        year, month, day: Date components (int)
        hour, minute: Time components (int, 24hr format)
        lat, lon: Coordinates (float)
        tzone: Timezone offset (float, e.g., 5.5 for India)
        
    Returns:
        dict: JSON response containing planet details or None if error.
    """
    base_url = "https://api.vedicastroapi.com/v3-json/horoscope/planet-details"
    
    # Securely access API Key from Django settings
    api_key = getattr(settings, 'ASTRO_API_KEY', None)
    
    if not api_key:
        print("CRITICAL WARNING: ASTRO_API_KEY is missing in settings.")
        return None

    payload = {
        "year": year,
        "month": month,
        "day": day,
        "hour": hour,
        "minute": minute,
        "lat": lat,
        "lon": lon,
        "tzone": tzone,
        "api_key": api_key,
        "lang": "en"
    }
    
    try:
        response = requests.get(base_url, params=payload, timeout=10)
        response.raise_for_status() # Raises error for 4xx/5xx status codes
        return response.json()
    except requests.RequestException as e:
        # In a real app, use proper logging here (e.g., logger.error)
        print(f"Error fetching Kundli Data: {e}")
        return None

def get_matchmaking_score(boy_data, girl_data):
    """
    Fetches Ashtakoot Guna Milan score for marriage matching.
    
    Args:
        boy_data (dict): {day, month, year, hour, minute, lat, lon, tzone}
        girl_data (dict): {day, month, year, hour, minute, lat, lon, tzone}
        
    Returns:
        dict: JSON response with score (out of 36) and dosha details.
    """
    base_url = "https://api.vedicastroapi.com/v3-json/matching/ashtakoot"
    
    api_key = getattr(settings, 'ASTRO_API_KEY', None)
    if not api_key:
        return None

    # Construct the combined payload required by most matching APIs
    payload = {
        "api_key": api_key,
        "boy_day": boy_data.get('day'),
        "boy_month": boy_data.get('month'),
        "boy_year": boy_data.get('year'),
        "boy_hour": boy_data.get('hour'),
        "boy_minute": boy_data.get('minute'),
        "boy_lat": boy_data.get('lat'),
        "boy_lon": boy_data.get('lon'),
        "boy_tzone": boy_data.get('tzone'),
        
        "girl_day": girl_data.get('day'),
        "girl_month": girl_data.get('month'),
        "girl_year": girl_data.get('year'),
        "girl_hour": girl_data.get('hour'),
        "girl_minute": girl_data.get('minute'),
        "girl_lat": girl_data.get('lat'),
        "girl_lon": girl_data.get('lon'),
        "girl_tzone": girl_data.get('tzone'),
        "lang": "en"
    }

    try:
        response = requests.get(base_url, params=payload, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error fetching Matchmaking Data: {e}")
        return None