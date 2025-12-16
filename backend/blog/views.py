from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.utils import timezone
import random

from .models import BlogPost, Category, SpiritualQuote
from .serializers import (
    BlogPostListSerializer,
    BlogPostDetailSerializer,
    CategorySerializer,
    SpiritualQuoteSerializer
)

class BlogPostListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = BlogPostListSerializer
    
    def get_queryset(self):
        queryset = BlogPost.objects.filter(status='published')
        category_slug = self.request.query_params.get('category')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        return queryset

class BlogPostDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = BlogPostDetailSerializer
    queryset = BlogPost.objects.filter(status='published')
    lookup_field = 'slug'

class CategoryListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = CategorySerializer
    queryset = Category.objects.all()

class DailyQuoteView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        today = timezone.now().date()
        quote = SpiritualQuote.objects.filter(active_date=today).first()
        
        if not quote:
            # Fallback to random
            quote = SpiritualQuote.objects.order_by('?').first()
            
        if not quote:
             # Hardcoded fallback if DB empty
            return Response({
                "text": "The universe is not outside of you. Look inside yourself; everything that you want, you already are.",
                "author": "Rumi"
            })
            
        return Response(SpiritualQuoteSerializer(quote).data)
