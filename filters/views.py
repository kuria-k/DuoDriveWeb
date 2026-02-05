from rest_framework import generics, permissions
from .models import FilterHistory
from .serializers import FilterHistorySerializer

class FilterHistoryListCreateView(generics.ListCreateAPIView):
    serializer_class = FilterHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return history for the logged-in user, limit to 5 recent
        return FilterHistory.objects.filter(user=self.request.user)[:5]

    def perform_create(self, serializer):
        # Attach the logged-in user automatically
        serializer.save(user=self.request.user)

