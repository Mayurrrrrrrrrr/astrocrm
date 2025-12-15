"""
OTP SMS Service using MSG91.
Provides a fallback for development mode.
"""
import requests
from django.conf import settings


def send_otp_sms(phone_number, otp):
    """
    Send OTP via MSG91 SMS.
    Returns 'dev' if in development bypass mode.
    Returns True if SMS sent successfully.
    Returns False if SMS failed.
    """
    # Development bypass
    if getattr(settings, 'OTP_BYPASS_IN_DEV', False):
        print(f"[DEV] OTP for {phone_number}: {otp}")
        return 'dev'
    
    auth_key = getattr(settings, 'MSG91_AUTH_KEY', '')
    template_id = getattr(settings, 'MSG91_TEMPLATE_ID', '')
    
    if not auth_key or not template_id:
        print(f"[WARNING] MSG91 not configured. OTP: {otp}")
        return 'dev'
    
    try:
        url = "https://control.msg91.com/api/v5/otp"
        
        payload = {
            "template_id": template_id,
            "mobile": phone_number,
            "otp": otp
        }
        
        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "authkey": auth_key
        }
        
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        response.raise_for_status()
        
        result = response.json()
        return result.get('type') == 'success'
        
    except Exception as e:
        print(f"[ERROR] Failed to send OTP: {e}")
        return False


def send_sms(phone_number, message):
    """
    Send a generic SMS message.
    """
    auth_key = getattr(settings, 'MSG91_AUTH_KEY', '')
    sender_id = getattr(settings, 'MSG91_SENDER_ID', 'ASTRCM')
    
    if not auth_key:
        print(f"[DEV] SMS to {phone_number}: {message}")
        return False
    
    try:
        url = "https://control.msg91.com/api/v5/flow/"
        
        payload = {
            "sender": sender_id,
            "route": "4",
            "country": "91",
            "sms": [{"message": message, "to": [phone_number]}]
        }
        
        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "authkey": auth_key
        }
        
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        response.raise_for_status()
        return True
        
    except Exception as e:
        print(f"[ERROR] Failed to send SMS: {e}")
        return False
