from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid
from django.conf import settings

class CustomUser(AbstractUser):
    age = models.IntegerField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female')], default='Male')

    def __str__(self):
        return self.username
    
class HealthData(models.Model):
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]

    BMI_CATEGORY_CHOICES = [
        ('Underweight', 'Underweight'),
        ('Normal', 'Normal'),
        ('Overweight', 'Overweight'),
        ('Obese', 'Obese'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='health_data')  # Foreign key to User
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    sleep_duration = models.FloatField(help_text="Sleep duration in hours")
    physical_activity_level = models.IntegerField(help_text="Physical activity level (1-10)")
    stress_level = models.IntegerField(help_text="Stress level (1-10)")
    bmi_category = models.CharField(max_length=20, choices=BMI_CATEGORY_CHOICES)
    heart_rate = models.IntegerField(help_text="Heart rate in bpm")
    daily_steps = models.IntegerField(help_text="Number of daily steps")
    systolic = models.IntegerField(help_text="Systolic blood pressure")
    diastolic = models.IntegerField(help_text="Diastolic blood pressure")
    created_at = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return f"Health Data for {self.user.username} ({self.created_at})"
