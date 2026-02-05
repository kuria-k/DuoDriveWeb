from rest_framework import serializers
from .models import FilterHistory

class FilterHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = FilterHistory
        fields = ["id", "filters", "created_at"]
