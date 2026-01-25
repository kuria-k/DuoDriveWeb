# apps/inventory/models.py
from django.db import models

class Car_stocks(models.Model):
    STATUS_CHOICES = [
        ("available", "Available"),
        ("reserved", "Reserved"),
        ("sold", "Sold"),
    ]
    FUEL_CHOICES = [
        ("petrol", "Petrol"),
        ("diesel", "Diesel"),
        ("hybrid", "Hybrid"),
        ("electric", "Electric"),
    ]
    TRANSMISSION_CHOICES = [
        ("manual", "Manual"),
        ("automatic", "Automatic"),
    ]
    DRIVE_CHOICES = [
        ("fwd", "Front‑wheel drive"),
        ("rwd", "Rear‑wheel drive"),
        ("awd", "All‑wheel drive"),
        ("4wd", "4‑wheel drive"),
    ]

    # Core fields
    model = models.CharField(max_length=100)
    name = models.CharField(max_length=150)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="available")
    year = models.PositiveIntegerField()
    location = models.CharField(max_length=120)
    discount_percent = models.DecimalField(
       max_digits=5,
       decimal_places=2,
       default=0,
       help_text="Discount % (e.g., 15.50 for 15.5%)"
   )
    final_price = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.discount_percent:
            self.final_price = self.price - (self.price * self.discount_percent / 100)
        else:
            self.final_price = self.price
        super().save(*args, **kwargs)

    # Specs
    drive_type = models.CharField(max_length=10, choices=DRIVE_CHOICES)
    mileage = models.PositiveIntegerField(help_text="Mileage in km")
    engine_capacity_cc = models.PositiveIntegerField()
    fuel_type = models.CharField(max_length=10, choices=FUEL_CHOICES)
    horsepower = models.PositiveIntegerField()
    transmission = models.CharField(max_length=10, choices=TRANSMISSION_CHOICES)
    torque_nm = models.PositiveIntegerField(help_text="Torque in Nm")
    top_speed_kmh = models.PositiveIntegerField()
    description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.year})"

    class Meta:
        db_table = "car_inventory"   # 👈 new table name


class CarImage_stocks(models.Model):
    car = models.ForeignKey(Car_stocks, related_name="images", on_delete=models.CASCADE)
    public_id = models.CharField(max_length=255)
    url = models.URLField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.car_id} - {self.public_id}"

    class Meta:
        db_table = "car_inventory_images"  


