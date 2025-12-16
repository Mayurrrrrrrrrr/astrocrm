from django.urls import path
from . import views

urlpatterns = [
    path('posts/', views.BlogPostListView.as_view(), name='post-list'),
    path('posts/<slug:slug>/', views.BlogPostDetailView.as_view(), name='post-detail'),
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('quote/daily/', views.DailyQuoteView.as_view(), name='daily-quote'),
]
