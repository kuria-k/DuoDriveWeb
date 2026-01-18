# urls.py
from django.urls import path
from .views import (
    CarListCreateView,
    CarDetailView,
    CarImageUploadView,
    CarImageDetailView
)

urlpatterns = [
    # Car endpoints
    path('cars/', CarListCreateView.as_view(), name='car-list-create'),
    path('cars/<int:pk>/', CarDetailView.as_view(), name='car-detail'),
    
    # Image endpoints
    path('cars/<int:pk>/images/', CarImageUploadView.as_view(), name='car-image-upload'),
    path('cars/<int:car_pk>/images/<int:pk>/', CarImageDetailView.as_view(), name='car-image-detail'),
]

