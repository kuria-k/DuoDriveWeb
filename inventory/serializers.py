# # serializers.py
# from rest_framework import serializers
# from django.utils import timezone
# from datetime import datetime
# from .models import Car, CarImage

# class CarImageSerializer(serializers.ModelSerializer):
#     image_url = serializers.SerializerMethodField()
    
#     class Meta:
#         model = CarImage
#         fields = ['id', 'image', 'image_url', 'is_primary', 'order', 'caption', 'uploaded_at']
#         read_only_fields = ['uploaded_at']
    
#     def get_image_url(self, obj):
#         if obj.image:
#             request = self.context.get('request')
#             if request:
#                 return request.build_absolute_uri(obj.image.url)
#             return obj.image.url
#         return None


# class CarListSerializer(serializers.ModelSerializer):
#     """Lightweight serializer for list views"""
#     primary_image = serializers.SerializerMethodField()
#     image_count = serializers.IntegerField(read_only=True)
    
#     class Meta:
#         model = Car
#         fields = [
#             'id', 'title', 'category', 'price', 'year', 'mileage',
#             'location', 'fuel_type', 'transmission', 'status',
#             'is_featured', 'primary_image', 'image_count', 'created_at'
#         ]
    
#     def get_primary_image(self, obj):
#         primary_img = obj.images.filter(is_primary=True).first()
#         if primary_img:
#             request = self.context.get('request')
#             if request:
#                 return request.build_absolute_uri(primary_img.image.url)
#             return primary_img.image.url
        
#         # Fallback to first image
#         first_img = obj.images.first()
#         if first_img:
#             request = self.context.get('request')
#             if request:
#                 return request.build_absolute_uri(first_img.image.url)
#             return first_img.image.url
#         return None


# class CarDetailSerializer(serializers.ModelSerializer):
#     """Detailed serializer with all images"""
#     images = CarImageSerializer(many=True, read_only=True)
#     key_features_list = serializers.SerializerMethodField()
    
#     class Meta:
#         model = Car
#         fields = [
#             'id', 'category', 'drive_type', 'title', 'brand', 'model',
#             'location', 'price', 'negotiable', 'year', 'mileage',
#             'fuel_type', 'transmission', 'engine_size',
#             'color_exterior', 'color_interior', 'doors', 'seats',
#             'key_features', 'key_features_list', 'description',
#             'status', 'is_featured', 'views_count',
#             'created_at', 'updated_at', 'images', 'image_count'
#         ]
#         read_only_fields = ['created_at', 'updated_at', 'views_count', 'image_count']
    
#     def get_key_features_list(self, obj):
#         if obj.key_features:
#             return [feature.strip() for feature in obj.key_features.split(',') if feature.strip()]
#         return []


# class CarCreateUpdateSerializer(serializers.ModelSerializer):
#     """Serializer for creating/updating cars"""
    
#     class Meta:
#         model = Car
#         fields = [
#             'category', 'drive_type', 'title', 'brand', 'model',
#             'location', 'price', 'negotiable', 'year', 'mileage',
#             'fuel_type', 'transmission', 'engine_size',
#             'color_exterior', 'color_interior', 'doors', 'seats',
#             'key_features', 'description', 'status', 'is_featured'
#         ]
  

#     def validate_year(self, value):
#         current_year = timezone.now().year
#         if value < 1900 or value > current_year + 1:
#             raise serializers.ValidationError(
#                 f"Year must be between 1900 and {current_year + 1}."
#             )
#         return value

    
#     def validate_price(self, value):
#         if value < 0:
#             raise serializers.ValidationError("Price cannot be negative")
#         return value


# class BulkImageUploadSerializer(serializers.Serializer):
#     """Serializer for handling multiple image uploads"""
#     images = serializers.ListField(
#         child=serializers.ImageField(max_length=100000, allow_empty_file=False, use_url=False),
#         write_only=True,
#         required=True
#     )
#     primary_index = serializers.IntegerField(required=False, min_value=0, default=0)
    
#     def validate_images(self, value):
#         if len(value) > 20:
#             raise serializers.ValidationError("Cannot upload more than 20 images at once")
#         if len(value) == 0:
#             raise serializers.ValidationError("At least one image is required")
#         return value
    
#     def validate(self, data):
#         images = data.get('images', [])
#         primary_index = data.get('primary_index', 0)
        
#         if primary_index >= len(images):
#             raise serializers.ValidationError("Primary index out of range")
        
#         return data


# serializers.py
from rest_framework import serializers
from datetime import datetime
from .models import Car, CarImage

class CarImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CarImage
        fields = ['id', 'image', 'image_url', 'is_primary', 'order', 'caption', 'uploaded_at']
        read_only_fields = ['uploaded_at']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class CarListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views"""
    primary_image = serializers.SerializerMethodField()
    image_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Car
        fields = [
            'id', 'title', 'category', 'price', 'year', 'mileage',
            'location', 'fuel_type', 'transmission', 'status',
            'is_featured', 'primary_image', 'image_count', 'created_at'
        ]
    
    def get_primary_image(self, obj):
        primary_img = obj.images.filter(is_primary=True).first()
        if primary_img:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(primary_img.image.url)
            return primary_img.image.url
        
        # Fallback to first image
        first_img = obj.images.first()
        if first_img:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(first_img.image.url)
            return first_img.image.url
        return None


class CarDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer with all images"""
    images = CarImageSerializer(many=True, read_only=True)
    key_features_list = serializers.SerializerMethodField()
    
    class Meta:
        model = Car
        fields = [
            'id', 'category', 'drive_type', 'title', 'brand', 'model',
            'location', 'price', 'negotiable', 'year', 'mileage',
            'fuel_type', 'transmission', 'engine_size',
            'color_exterior', 'color_interior', 'doors', 'seats',
            'key_features', 'key_features_list', 'description',
            'status', 'is_featured', 'views_count',
            'created_at', 'updated_at', 'images', 'image_count'
        ]
        read_only_fields = ['created_at', 'updated_at', 'views_count', 'image_count']
    
    def get_key_features_list(self, obj):
        if obj.key_features:
            return [feature.strip() for feature in obj.key_features.split(',') if feature.strip()]
        return []


class CarCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating cars"""
    
    class Meta:
        model = Car
        fields = [
            'category', 'drive_type', 'title', 'brand', 'model',
            'location', 'price', 'negotiable', 'year', 'mileage',
            'fuel_type', 'transmission', 'engine_size',
            'color_exterior', 'color_interior', 'doors', 'seats',
            'key_features', 'description', 'status', 'is_featured'
        ]
    
    def validate_year(self, value):
        current_year = datetime.now().year
        if value > current_year + 1:
            raise serializers.ValidationError("Year cannot be more than next year")
        if value < 1900:
            raise serializers.ValidationError("Year must be 1900 or later")
        return value
    
    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Price cannot be negative")
        return value