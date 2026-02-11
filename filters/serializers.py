from rest_framework import serializers
from .models import FilterHistory

class FilterHistorySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    
    class Meta:
        model = FilterHistory
        fields = ["id", "filters", "created_at", "username"]
