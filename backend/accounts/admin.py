from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, AstrologerProfile

# 1. Create an "Inline" view
# This tells Django to show the Profile fields inside the User page
class AstrologerProfileInline(admin.StackedInline):
    model = AstrologerProfile
    can_delete = False
    verbose_name_plural = 'Astrologer Profile'

# 2. Customize the User Admin
class UserAdmin(BaseUserAdmin):
    inlines = [AstrologerProfileInline] # Add the profile here
    
    # Add your custom fields (is_astrologer, phone) to the User form
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Extra Details', {'fields': ('is_astrologer', 'phone_number', 'wallet_balance')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Extra Details', {'fields': ('is_astrologer', 'phone_number')}),
    )

# 3. Register the User with the new settings
admin.site.register(User, UserAdmin)

# 4. Keep the separate list view as well
@admin.register(AstrologerProfile)
class AstrologerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'expertise', 'rating', 'is_online', 'chat_rate')
    list_filter = ('is_online', 'expertise')
    search_fields = ('user__username', 'expertise')