from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Favourite
from .serializers import FavouriteSerializer
from inventory.models import Car_stocks

class FavouriteToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        car_id = request.data.get("carId")
        user = request.user

        if not car_id:
            return Response({"error": "carId is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            car = Car_stocks.objects.get(id=car_id)
        except Car_stocks.DoesNotExist:
            return Response({"error": "Car not found"}, status=status.HTTP_404_NOT_FOUND)

        favourite, created = Favourite.objects.get_or_create(user=user, car=car)

        if not created:
            favourite.delete()
            return Response({"success": True, "action": "removed", "message": "Car removed from favourites"})
        else:
            return Response({"success": True, "action": "added", "message": "Car added to favourites"})


class FavouriteListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        favourites = Favourite.objects.filter(user=user)
        serializer = FavouriteSerializer(favourites, many=True)
        return Response({"success": True, "data": serializer.data})

