# # users/views.py
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status, generics
# from django.contrib.auth import authenticate
# from django.contrib.auth import get_user_model
# from rest_framework.authtoken.models import Token
# from .serializers import UserSerializer, RegisterSerializer
# from .models import CustomUser

# User = get_user_model()

# class LoginView(APIView):
#     def post(self, request):
#         username = request.data.get("username")
#         password = request.data.get("password")
#         user = authenticate(username=username, password=password)

#         if user is not None:
#             # Create or get token
#             token, created = Token.objects.get_or_create(user=user)
#             serializer = UserSerializer(user)
#             return Response({
#                 "user": serializer.data,
#                 "token": token.key
#             }, status=status.HTTP_200_OK)

#         return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    


# class RegisterBuyerView(generics.CreateAPIView):
#     queryset = CustomUser.objects.all()
#     serializer_class = RegisterSerializer


# users/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from .models import CustomUser
from .serializers import RegisterSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveAPIView


# Register new user (defaults to buyer unless specified)
class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


# Login existing user
class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if user is not None:
            # Issue token
            token, created = Token.objects.get_or_create(user=user)
            serializer = UserSerializer(user)

            # Flattened response for frontend
            return Response({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "phone_number": user.phone_number,
                "role": user.role,
                "is_superuser": user.is_superuser,
                "token": token.key
            }, status=status.HTTP_200_OK)

        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


# List all users (admin only)
class UserListView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    def list(self, request, *args, **kwargs):
        # Only allow admins/superusers
        user = request.user
        if not user.is_authenticated or (user.role != "admin" and not user.is_superuser):
            return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
        return super().list(request, *args, **kwargs)



class MeView(RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

