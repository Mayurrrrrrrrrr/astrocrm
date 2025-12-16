from rest_framework import serializers
from .models import Category, BlogPost, SpiritualQuote

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class BlogPostListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    author_name = serializers.CharField(source='author.first_name', read_only=True)

    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'excerpt', 'image', 'category', 'author_name', 'created_at']

class BlogPostDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    author_name = serializers.CharField(source='author.first_name', read_only=True)

    class Meta:
        model = BlogPost
        fields = '__all__'

class SpiritualQuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpiritualQuote
        fields = '__all__'
