from django.db import models
from django.conf import settings

class BirthDetails(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='birth_details', null=True, blank=True)
    name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    time_of_birth = models.TimeField()
    place_of_birth = models.CharField(max_length=100)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    timezone = models.DecimalField(max_digits=4, decimal_places=1, default=5.5) # IST default
    
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')], default='Male')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.date_of_birth}"
