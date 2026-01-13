from django.db import models

class Car(models.Model):
    CATEGORY_CHOICES = [
        ('SUV', 'SUV'),
        ('Sedan', 'Sedan'),
        ('Truck', 'Truck'),
        ('Coupe', 'Coupe'),
        ('Hatchback', 'Hatchback'),
    ]

    TRANSMISSION_CHOICES = [
        ('Automatic', 'Automatic'),
        ('Manual', 'Manual'),
    ]

    FUEL_CHOICES = [
        ('Petrol', 'Petrol'),
        ('Diesel', 'Diesel'),
        ('Hybrid', 'Hybrid'),
        ('Electric', 'Electric'),
    ]

    # Basic details
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    drive_type = models.CharField(max_length=50, default="4WD")
    title = models.CharField(max_length=200)  # e.g. Toyota Land Cruiser Prado
    location = models.CharField(max_length=100)  # e.g. Nairobi, Kenya
    price = models.DecimalField(max_digits=12, decimal_places=2)  # KES 7,800,000

    # Specifications
    year = models.PositiveIntegerField()
    mileage = models.PositiveIntegerField(help_text="Mileage in KM")
    fuel_type = models.CharField(max_length=50, choices=FUEL_CHOICES)
    transmission = models.CharField(max_length=50, choices=TRANSMISSION_CHOICES)

    # Features
    key_features = models.TextField(help_text="Comma-separated list of features")

    # Description
    description = models.TextField()

    # Optional: image field
    image = models.ImageField(upload_to="cars/", blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.year})"
