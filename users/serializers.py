# users/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import CustomUser  

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "phone_number" , "date_joined" , "role", "is_superuser", "last_login"]  
      


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ["id", "username", "email", "password", "phone_number", "role"]

    def create(self, validated_data):
        # Allow role to be passed, default to buyer if not provided
        role = validated_data.get("role", "buyer")
        user = CustomUser.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            phone_number=validated_data.get("phone_number"),
            role=role
        )
        return user



