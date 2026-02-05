from django.urls import path
from .views import FavouriteToggleView, FavouriteListView

urlpatterns = [
    path("favourites/toggle/", FavouriteToggleView.as_view(), name="favourite-toggle"),
    path("favourites/", FavouriteListView.as_view(), name="favourite-list"),
]
