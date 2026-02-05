# apps/favourites/models.py
from django.conf import settings
from django.db import models
from inventory.models import Car_stocks


class Favourite(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="favourites"
    )
    car = models.ForeignKey(
        Car_stocks,
        on_delete=models.CASCADE,
        related_name="favourited_by"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "car"],
                name="unique_user_car_favourite"
            )
        ]

    def __str__(self):
        return f"{self.user} → {self.car}"

