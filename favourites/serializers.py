# favourites/serializers.py
from rest_framework import serializers
from .models import Favourite
from inventory.models import Car_stocks, CarImage_stocks

class CarImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarImage_stocks
        fields = ["id", "url"]

class CarSerializer(serializers.ModelSerializer):
    images = CarImageSerializer(many=True, read_only=True)

    class Meta:
        model = Car_stocks
        fields = [
            "id",
            "name",
            "model",
            "year",
            "fuel_type",
            "transmission",
            "drive_type",
            "mileage",
            "engine_capacity_cc",
            "horsepower",
            "torque_nm",
            "top_speed_kmh",
            "price",
            "discount_percent",
            "final_price",
            "location",
            "status",
            "description",
            "images",        # nested images
        ]

class FavouriteSerializer(serializers.ModelSerializer):
    car = CarSerializer(read_only=True)

    class Meta:
        model = Favourite
        fields = ["id", "car", "created_at"]


