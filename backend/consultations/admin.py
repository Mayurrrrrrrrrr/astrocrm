from django.contrib import admin
from .models import Consultation, ChatMessage


@admin.register(Consultation)
class ConsultationAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'customer', 'astrologer', 'consultation_type', 'status',
        'started_at', 'duration_minutes', 'total_cost'
    ]
    list_filter = ['status', 'consultation_type', 'created_at']
    search_fields = ['customer__phone_number', 'astrologer__phone_number']
    readonly_fields = ['created_at', 'updated_at', 'total_cost', 'duration_minutes']
    
    fieldsets = (
        ('Participants', {
            'fields': ('customer', 'astrologer')
        }),
        ('Session Details', {
            'fields': ('consultation_type', 'status', 'started_at', 'ended_at', 'duration_minutes')
        }),
        ('Pricing', {
            'fields': ('rate_per_minute', 'total_cost', 'free_minutes_used')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'consultation', 'sender', 'message_preview', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['message', 'sender__phone_number']
    readonly_fields = ['created_at']
    
    def message_preview(self, obj):
        return obj.message[:50] + '...' if len(obj.message) > 50 else obj.message
    message_preview.short_description = 'Message'
