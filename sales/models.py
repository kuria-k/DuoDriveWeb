from django.db import models

class Sale(models.Model):
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('sold', 'Sold'),
        ('reserved', 'Reserved'),
    ]

    customer = models.CharField(max_length=100)
    car = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')

    def __str__(self):
        return f"{self.customer} - {self.car} ({self.status})"

