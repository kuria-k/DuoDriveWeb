# users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ("buyer", "Buyer"),
        ("admin", "Admin"),
    )
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="buyer")
    
    # Phone number field with basic validation
    phone_regex = RegexValidator(
        regex=r'^\+?\d{9,15}$',
        message="Phone number must be entered in the format: '+254700123456' or '0700123456'. Up to 15 digits allowed."
    )
    phone_number = models.CharField(
        validators=[phone_regex],
        max_length=16,
        blank=True,
        null=True,
        help_text="Optional. Enter a valid phone number."
    )

    def __str__(self):
        return f"{self.username} ({self.role})"



