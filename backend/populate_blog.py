
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.base')
django.setup()

from blog.models import Category, BlogPost, SpiritualQuote
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from django.core.files.base import ContentFile
import datetime

User = get_user_model()

def populate():
    # Create User if not exists
    user, _ = User.objects.get_or_create(phone_number='9999999999', defaults={'first_name': 'Astro', 'last_name': 'Guru'})

    # Categories
    cats = ['Vedic Astrology', 'Spirituality', 'Wellness', 'Planetary Transits']
    for c in cats:
        Category.objects.get_or_create(name=c, slug=slugify(c))

    # Quotes
    quotes = [
        ("The soul has been given its own ears to hear things the mind does not understand.", "Rumi"),
        ("You are the universe expressing itself as a human for a little while.", "Eckhart Tolle"),
        ("What you seek is seeking you.", "Rumi")
    ]
    for i, (text, author) in enumerate(quotes):
        date = datetime.date.today() + datetime.timedelta(days=i)
        SpiritualQuote.objects.get_or_create(text=text, author=author, active_date=date)

    # Posts
    posts = [
        {
            "title": "Mercury Retrograde 2024: What to Expect",
            "cat": "Planetary Transits",
            "content": "Mercury Retrograde is often feared, but it is actually a time for reflection. Re-evaluate, Re-do, Re-think. When Mercury goes retrograde, technology might fail, communication might be misunderstood, but your intuition heightens..."
        },
        {
            "title": "5 Morning Habits for Spiritual Growth",
            "cat": "Spirituality",
            "content": "The way you start your morning determines the flow of your day. 1. Meditate for 10 mins. 2. Drink warm water. 3. Journal your dreams..."
        },
        {
            "title": "Understanding Your Moon Sign",
            "cat": "Vedic Astrology",
            "content": "While your Sun sign represents your soul, your Moon sign represents your mind and emotions. In Vedic astrology, the Moon is considered even more important than the Sun..."
        }
    ]

    for p in posts:
        cat = Category.objects.get(name=p['cat'])
        BlogPost.objects.get_or_create(
            slug=slugify(p['title']),
            defaults={
                'title': p['title'],
                'category': cat,
                'content': p['content'],
                'excerpt': p['content'][:100] + '...',
                'author': user,
                'status': 'published'
            }
        )

    print("Blog Data Populated!")

if __name__ == '__main__':
    populate()
