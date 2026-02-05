# apps/inventory/views.py
# from rest_framework import viewsets, status
# from rest_framework.response import Response
# from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
# from django.db import transaction
# from cloudinary.uploader import upload as cloudinary_upload, destroy as cloudinary_destroy
# from .models import Car_stocks, CarImage_stocks
# from .serializers import CarSerializer


# class CarViewSet(viewsets.ModelViewSet):
#     queryset = Car_stocks.objects.all().order_by("-created_at")
#     serializer_class = CarSerializer
#     parser_classes = [MultiPartParser, FormParser, JSONParser]

#     @transaction.atomic
#     def create(self, request, *args, **kwargs):
#         # 1️⃣ Extract data safely
#         data = {
#             "model": request.data.get("model"),
#             "name": request.data.get("name"),
#             "price": request.data.get("price"),
#             "status": request.data.get("status", "available"),
#             "year": request.data.get("year"),
#             "location": request.data.get("location"),
#             "drive_type": request.data.get("drive_type"),
#             "mileage": request.data.get("mileage"),
#             "engine_capacity_cc": request.data.get("engine_capacity_cc"),
#             "fuel_type": request.data.get("fuel_type"),
#             "horsepower": request.data.get("horsepower"),
#             "transmission": request.data.get("transmission"),
#             "torque_nm": request.data.get("torque_nm"),
#             "top_speed_kmh": request.data.get("top_speed_kmh"),
#             "description": request.data.get("description", ""),
#         }

#         # 2️⃣ Validate and save car
#         serializer = self.get_serializer(data=data)
#         serializer.is_valid(raise_exception=True)
#         car = serializer.save()

#         # 3️⃣ Handle uploaded images
#         files = request.FILES.getlist("images")
#         for f in files:
#             result = cloudinary_upload(
#                 f,
#                 folder="inventory/cars",
#                 overwrite=False,
#                 resource_type="image",
#             )
#             CarImage_stocks.objects.create(
#                 car=car,
#                 public_id=result.get("public_id"),
#                 url=result.get("secure_url"),
#             )

#         return Response(
#             self.get_serializer(car).data,
#             status=status.HTTP_201_CREATED,
#         )

#     @transaction.atomic
#     def update(self, request, *args, **kwargs):
#         partial = kwargs.get("partial", False)
#         instance = self.get_object()

#         # 1️⃣ Update core car fields
#         serializer = self.get_serializer(instance, data=request.data, partial=partial)
#         serializer.is_valid(raise_exception=True)
#         car = serializer.save()

#         # 2️⃣ Handle deleted images safely
#         deleted_images = request.data.get("deleted_images", [])

#         # Ensure deleted_images is always a list
#         if isinstance(deleted_images, str):
#             deleted_images = [deleted_images]
#         elif not isinstance(deleted_images, list):
#             deleted_images = list(deleted_images)

#         if deleted_images:
#             images_to_delete = CarImage_stocks.objects.filter(
#                 id__in=deleted_images,
#                 car=car
#             )
#             for img in images_to_delete:
#                 try:
#                     cloudinary_destroy(img.public_id, invalidate=True)
#                 except Exception:
#                     pass
#                 img.delete()

#         # 3️⃣ Handle newly uploaded images
#         files = request.FILES.getlist("images")
#         for f in files:
#             result = cloudinary_upload(
#                 f,
#                 folder="inventory/cars",
#                 overwrite=False,
#                 resource_type="image",
#             )
#             CarImage_stocks.objects.create(
#                 car=car,
#                 public_id=result.get("public_id"),
#                 url=result.get("secure_url"),
#             )

#         return Response(
#             self.get_serializer(car).data,
#             status=status.HTTP_200_OK,
#         )

#     @transaction.atomic
#     def destroy(self, request, *args, **kwargs):
#         instance = self.get_object()

#         # Delete all associated images from Cloudinary
#         for img in instance.images.all():
#             try:
#                 cloudinary_destroy(img.public_id, invalidate=True)
#             except Exception:
#                 pass

#         return super().destroy(request, *args, **kwargs)


# apps/inventory/views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db import transaction
from cloudinary.uploader import upload as cloudinary_upload, destroy as cloudinary_destroy
from .models import Car_stocks, CarImage_stocks
from .serializers import CarSerializer
from rest_framework.permissions import AllowAny

class CarViewSet(viewsets.ModelViewSet):
    queryset = Car_stocks.objects.all().order_by("-created_at")
    serializer_class = CarSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    permission_classes = [AllowAny]

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        car = serializer.save()

        # Handle uploaded images
        files = request.FILES.getlist("images")
        for f in files:
            try:
                result = cloudinary_upload(
                    f,
                    folder="inventory/cars",
                    overwrite=False,
                    resource_type="image",
                )
                CarImage_stocks.objects.create(
                    car=car,
                    public_id=result["public_id"],
                    url=result["secure_url"],
                )
            except Exception as e:
                print("Cloudinary upload failed:", e)

        return Response(self.get_serializer(car).data, status=status.HTTP_201_CREATED)

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        partial = kwargs.get("partial", False)
        car = self.get_object()

        # 1️⃣ Update car fields
        serializer = self.get_serializer(car, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        car = serializer.save()

        # 2️⃣ Delete images if provided
        deleted_images = request.data.get("deleted_images", [])
        if isinstance(deleted_images, str):
            # If sent as a comma-separated string, convert to list
            deleted_images = [int(x) for x in deleted_images.split(",") if x.strip().isdigit()]

        for img in CarImage_stocks.objects.filter(car=car, id__in=deleted_images):
            try:
                cloudinary_destroy(img.public_id, invalidate=True)
            except Exception:
                pass
            img.delete()

        # 3️⃣ Add new uploaded images
        files = request.FILES.getlist("images")
        for f in files:
            try:
                result = cloudinary_upload(
                    f,
                    folder="inventory/cars",
                    overwrite=False,
                    resource_type="image",
                )
                CarImage_stocks.objects.create(
                    car=car,
                    public_id=result["public_id"],
                    url=result["secure_url"],
                )
            except Exception as e:
                print("Cloudinary upload failed:", e)

        return Response(self.get_serializer(car).data, status=status.HTTP_200_OK)

    @transaction.atomic
    def destroy(self, request, *args, **kwargs):
        car = self.get_object()
        # Delete images from Cloudinary
        for img in car.images.all():
            try:
                cloudinary_destroy(img.public_id, invalidate=True)
            except Exception:
                pass
        return super().destroy(request, *args, **kwargs)

