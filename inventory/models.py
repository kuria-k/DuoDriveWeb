# models.py
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone

class Car(models.Model):
    CATEGORY_CHOICES = [
        ('sedan', 'Sedan'),
        ('suv', 'SUV'),
        ('truck', 'Truck'),
        ('coupe', 'Coupe'),
        ('convertible', 'Convertible'),
        ('wagon', 'Wagon'),
        ('van', 'Van'),
        ('hatchback', 'Hatchback'),
    ]
    
    DRIVE_TYPE_CHOICES = [
        ('fwd', 'Front Wheel Drive'),
        ('rwd', 'Rear Wheel Drive'),
        ('awd', 'All Wheel Drive'),
        ('4wd', '4 Wheel Drive'),
    ]
    
    FUEL_TYPE_CHOICES = [
        ('petrol', 'Petrol'),
        ('diesel', 'Diesel'),
        ('electric', 'Electric'),
        ('hybrid', 'Hybrid'),
        ('plug_in_hybrid', 'Plug-in Hybrid'),
    ]
    
    TRANSMISSION_CHOICES = [
        ('manual', 'Manual'),
        ('automatic', 'Automatic'),
        ('cvt', 'CVT'),
        ('semi_automatic', 'Semi-Automatic'),
    ]
    
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('sold', 'Sold'),
        ('reserved', 'Reserved'),
        ('pending', 'Pending'),
    ]

    # Basic Information
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    drive_type = models.CharField(max_length=50, choices=DRIVE_TYPE_CHOICES, default='4wd')
    title = models.CharField(max_length=200, help_text="e.g., Toyota Land Cruiser VX")
    brand = models.CharField(max_length=100, blank=True)
    model = models.CharField(max_length=100, blank=True)
    
    # Location & Pricing
    location = models.CharField(max_length=100)
    price = models.DecimalField(
        max_digits=12, 
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    negotiable = models.BooleanField(default=False)
    
    # Vehicle Details
    year = models.PositiveIntegerField(
    validators=[MinValueValidator(1900)]
)

    mileage = models.PositiveIntegerField(help_text="Mileage in KM")
    fuel_type = models.CharField(max_length=50, choices=FUEL_TYPE_CHOICES)
    transmission = models.CharField(max_length=50, choices=TRANSMISSION_CHOICES)
    
    # Additional Details
    engine_size = models.CharField(max_length=50, blank=True, help_text="e.g., 2.5L, 3.0L")
    color_exterior = models.CharField(max_length=50, blank=True)
    color_interior = models.CharField(max_length=50, blank=True)
    doors = models.PositiveSmallIntegerField(default=4)
    seats = models.PositiveSmallIntegerField(default=5)
    
    # Features & Description
    key_features = models.TextField(help_text="Comma-separated features")
    description = models.TextField()
    
    # Status & Metadata
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    is_featured = models.BooleanField(default=False)
    views_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['category', 'price']),
        ]

    def __str__(self):
        return f"{self.title} ({self.year})"
    
    @property
    def is_available(self):
        return self.status == 'available'
    
    @property
    def image_count(self):
        return self.images.count()


class CarImage(models.Model):
    car = models.ForeignKey(Car, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="cars/%Y/%m/")
    is_primary = models.BooleanField(default=False)
    order = models.PositiveSmallIntegerField(default=0)
    caption = models.CharField(max_length=200, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'uploaded_at']
        indexes = [
            models.Index(fields=['car', 'is_primary']),
        ]

    def __str__(self):
        return f"Image {self.order} for {self.car.title}"
    
    def save(self, *args, **kwargs):
        # If this is set as primary, unset other primary images for this car
        if self.is_primary:
            CarImage.objects.filter(car=self.car, is_primary=True).update(is_primary=False)
        super().save(*args, **kwargs)
