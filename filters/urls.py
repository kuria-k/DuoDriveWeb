from django.urls import path
from .views import FilterHistoryListCreateView

urlpatterns = [
    path("filters/", FilterHistoryListCreateView.as_view(), name="filter-history"),
]
