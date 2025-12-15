"""
Management command to create sample astrologers for testing.
Run: python manage.py create_sample_astrologers
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import AstrologerProfile

User = get_user_model()


SAMPLE_ASTROLOGERS = [
    {
        'phone': '9900000001',
        'first_name': 'Pandit',
        'last_name': 'Sharma',
        'display_name': 'Pt. Rajesh Sharma',
        'expertise': ['Vedic', 'Kundli', 'Vastu'],
        'languages': ['Hindi', 'English'],
        'experience_years': 15,
        'bio': 'Expert in Vedic astrology with 15+ years of experience. Specialized in marriage compatibility and career guidance.',
        'chat_rate': 15.00,
        'call_rate': 25.00,
        'is_online': True,
        'rating': 4.8,
        'total_consultations': 2500,
        'total_reviews': 420,
    },
    {
        'phone': '9900000002',
        'first_name': 'Acharya',
        'last_name': 'Verma',
        'display_name': 'Acharya Sunil Verma',
        'expertise': ['Tarot', 'Numerology', 'Palmistry'],
        'languages': ['Hindi', 'English', 'Marathi'],
        'experience_years': 12,
        'bio': 'Tarot and numerology specialist. Helped thousands of people find clarity in relationships and career.',
        'chat_rate': 20.00,
        'call_rate': 35.00,
        'is_online': True,
        'rating': 4.9,
        'total_consultations': 3200,
        'total_reviews': 580,
    },
    {
        'phone': '9900000003',
        'first_name': 'Guru',
        'last_name': 'Devi',
        'display_name': 'Maa Saraswati Devi',
        'expertise': ['Vedic', 'Horoscope', 'Muhurta'],
        'languages': ['Hindi', 'Sanskrit'],
        'experience_years': 25,
        'bio': 'Traditional Vedic astrologer following ancient scriptures. Expert in muhurta selection for auspicious events.',
        'chat_rate': 30.00,
        'call_rate': 50.00,
        'is_online': False,
        'rating': 4.95,
        'total_consultations': 5000,
        'total_reviews': 890,
    },
    {
        'phone': '9900000004',
        'first_name': 'Dr.',
        'last_name': 'Joshi',
        'display_name': 'Dr. Prakash Joshi',
        'expertise': ['Lal Kitab', 'Remedies', 'Gemology'],
        'languages': ['Hindi', 'English', 'Gujarati'],
        'experience_years': 18,
        'bio': 'PhD in Jyotish Shastra. Lal Kitab expert with practical remedies for all life problems.',
        'chat_rate': 25.00,
        'call_rate': 40.00,
        'is_online': True,
        'is_busy': True,
        'rating': 4.7,
        'total_consultations': 1800,
        'total_reviews': 320,
    },
    {
        'phone': '9900000005',
        'first_name': 'Pandit',
        'last_name': 'Mishra',
        'display_name': 'Pt. Vivek Mishra',
        'expertise': ['Vedic', 'KP System', 'Prashna'],
        'languages': ['Hindi', 'English', 'Bengali'],
        'experience_years': 10,
        'bio': 'Young and dynamic astrologer combining traditional and modern techniques. Quick and accurate predictions.',
        'chat_rate': 12.00,
        'call_rate': 20.00,
        'is_online': True,
        'rating': 4.6,
        'total_consultations': 1200,
        'total_reviews': 210,
    },
    {
        'phone': '9900000006',
        'first_name': 'Jyotish',
        'last_name': 'Acharya',
        'display_name': 'Acharya Anand',
        'expertise': ['Career', 'Finance', 'Business'],
        'languages': ['Hindi', 'English', 'Tamil'],
        'experience_years': 8,
        'bio': 'Specialized in career and business astrology. Helping entrepreneurs and professionals make right decisions.',
        'chat_rate': 18.00,
        'call_rate': 30.00,
        'is_online': True,
        'rating': 4.5,
        'total_consultations': 950,
        'total_reviews': 175,
    },
]


class Command(BaseCommand):
    help = 'Create sample astrologers for testing'

    def handle(self, *args, **options):
        created_count = 0
        
        for data in SAMPLE_ASTROLOGERS:
            phone = '91' + data['phone']
            
            # Create or get user
            user, user_created = User.objects.get_or_create(
                phone_number=phone,
                defaults={
                    'first_name': data['first_name'],
                    'last_name': data['last_name'],
                    'role': 'astrologer',
                    'is_active': True,
                }
            )
            
            # Create or update astrologer profile
            profile, _ = AstrologerProfile.objects.update_or_create(
                user=user,
                defaults={
                    'display_name': data['display_name'],
                    'expertise': data['expertise'],
                    'languages': data['languages'],
                    'experience_years': data['experience_years'],
                    'bio': data['bio'],
                    'chat_rate': data['chat_rate'],
                    'call_rate': data.get('call_rate', 20.00),
                    'is_online': data.get('is_online', False),
                    'is_busy': data.get('is_busy', False),
                    'rating': data['rating'],
                    'total_consultations': data['total_consultations'],
                    'total_reviews': data['total_reviews'],
                    'verification_status': 'verified',
                }
            )
            
            if user_created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'Created: {data["display_name"]}'))
            else:
                self.stdout.write(self.style.WARNING(f'Updated: {data["display_name"]}'))
        
        self.stdout.write(self.style.SUCCESS(f'\n✓ {created_count} new astrologers created, {len(SAMPLE_ASTROLOGERS) - created_count} updated'))
