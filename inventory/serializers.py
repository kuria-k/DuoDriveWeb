# # apps/inventory/serializers.py
# from rest_framework import serializers
# from .models import Car_stocks, CarImage_stocks

# class CarImageSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CarImage_stocks
#         fields = ["id", "public_id", "url", "created_at"]
#         read_only_fields = ["id", "created_at"]


# class CarSerializer(serializers.ModelSerializer):
#     images = CarImageSerializer(many=True, read_only=True)

#     class Meta:
#         model = Car_stocks
#         fields = [
#             "id", "model", "name", "price","final_price", "discount_percent", "status", "year", "location",
#             "drive_type", "mileage", "engine_capacity_cc", "fuel_type",
#             "horsepower", "transmission", "torque_nm", "top_speed_kmh",
#             "description", "images", "created_at",
#         ]
#         read_only_fields = ["id", "created_at"]

# apps/inventory/serializers.py
from rest_framework import serializers
from decimal import Decimal, ROUND_HALF_UP
from .models import Car_stocks, CarImage_stocks


class CarImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarImage_stocks
        fields = ["id", "public_id", "url", "created_at"]
        read_only_fields = ["id", "created_at"]


class CarSerializer(serializers.ModelSerializer):
    images = CarImageSerializer(many=True, read_only=True)
    final_price = serializers.SerializerMethodField()

    class Meta:
        model = Car_stocks
        fields = [
            "id", "model", "name", "price", "final_price", "discount_percent",
            "status", "year", "location", "drive_type", "mileage",
            "engine_capacity_cc", "fuel_type", "horsepower", "transmission",
            "torque_nm", "top_speed_kmh", "description", "images", "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def get_final_price(self, obj):
        """
        Calculate final price accurately using Decimal arithmetic.
        """
        if not obj.discount_percent or obj.discount_percent <= 0:
            return float(obj.price)
        
        price = Decimal(str(obj.price))
        discount = Decimal(str(obj.discount_percent))
        
        # final_price = price * (1 - discount/100)
        final_price = price * (Decimal(100) - discount) / Decimal(100)
        
        # Round to 2 decimal places
        final_price = final_price.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        
        return float(final_price)


