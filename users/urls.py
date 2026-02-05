# users/urls.py
from django.urls import path
from .views import RegisterView, LoginView, UserListView, MeView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("", UserListView.as_view(), name="user-list"),
    path("me/", MeView.as_view(), name="user-me"),  # ✅ new
]

