# # views.py
# from rest_framework import generics, status
# from rest_framework.response import Response
# from rest_framework.parsers import MultiPartParser, FormParser
# from django.db.models import Count, Prefetch
# from django.shortcuts import get_object_or_404
# from .models import Car, CarImage
# from .serializers import (
#     CarListSerializer,
#     CarDetailSerializer,
#     CarCreateUpdateSerializer,
#     CarImageSerializer,
#     BulkImageUploadSerializer
# )


# class CarListCreateView(generics.ListCreateAPIView):
#     """
#     GET: List all cars with basic info
#     POST: Create a new car listing
#     """
#     def get_queryset(self):
#         queryset = Car.objects.annotate(
#             image_count=Count('images')
#         ).prefetch_related(
#             Prefetch('images', queryset=CarImage.objects.filter(is_primary=True))
#         )
        
#         # Filter by status
#         status_filter = self.request.query_params.get('status', None)
#         if status_filter:
#             queryset = queryset.filter(status=status_filter)
        
#         # Filter by category
#         category = self.request.query_params.get('category', None)
#         if category:
#             queryset = queryset.filter(category=category)
        
#         # Price range filter
#         min_price = self.request.query_params.get('min_price', None)
#         max_price = self.request.query_params.get('max_price', None)
#         if min_price:
#             queryset = queryset.filter(price__gte=min_price)
#         if max_price:
#             queryset = queryset.filter(price__lte=max_price)
        
#         # Year range filter
#         min_year = self.request.query_params.get('min_year', None)
#         max_year = self.request.query_params.get('max_year', None)
#         if min_year:
#             queryset = queryset.filter(year__gte=min_year)
#         if max_year:
#             queryset = queryset.filter(year__lte=max_year)
        
#         return queryset.order_by('-is_featured', '-created_at')
    
#     def get_serializer_class(self):
#         if self.request.method == 'POST':
#             return CarCreateUpdateSerializer
#         return CarListSerializer


# class CarDetailView(generics.RetrieveUpdateDestroyAPIView):
#     """
#     GET: Retrieve car details with all images
#     PUT/PATCH: Update car information
#     DELETE: Delete car listing
#     """
#     queryset = Car.objects.prefetch_related('images')
    
#     def get_serializer_class(self):
#         if self.request.method in ['PUT', 'PATCH']:
#             return CarCreateUpdateSerializer
#         return CarDetailSerializer
    
#     def retrieve(self, request, *args, **kwargs):
#         instance = self.get_object()
#         # Increment view count
#         instance.views_count += 1
#         instance.save(update_fields=['views_count'])
#         serializer = self.get_serializer(instance)
#         return Response(serializer.data)


# class CarImageUploadView(generics.CreateAPIView):
#     """
#     POST: Upload multiple images for a specific car
#     """
#     parser_classes = (MultiPartParser, FormParser)
#     serializer_class = BulkImageUploadSerializer
    
#     def create(self, request, *args, **kwargs):
#         car_id = self.kwargs.get("pk")
#         car = get_object_or_404(Car, pk=car_id)
        
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
        
#         images = serializer.validated_data['images']
#         primary_index = serializer.validated_data.get('primary_index', 0)
        
#         # Get current max order for this car
#         max_order = CarImage.objects.filter(car=car).count()
        
#         created_images = []
        
#         for idx, img in enumerate(images):
#             is_primary = (idx == primary_index) and (car.images.count() == 0 or idx == 0)
            
#             car_image = CarImage.objects.create(
#                 car=car,
#                 image=img,
#                 caption="",  # No captions for now
#                 is_primary=is_primary,
#                 order=max_order + idx
#             )
#             created_images.append(car_image)
        
#         # Serialize the created images
#         output_serializer = CarImageSerializer(
#             created_images, 
#             many=True, 
#             context={'request': request}
#         )
        
#         return Response({
#             'message': f'{len(created_images)} image(s) uploaded successfully',
#             'images': output_serializer.data
#         }, status=status.HTTP_201_CREATED)


# class CarImageDetailView(generics.RetrieveUpdateDestroyAPIView):
#     """
#     GET: Retrieve specific image
#     PUT/PATCH: Update image details (caption, order, primary status)
#     DELETE: Delete specific image
#     """
#     queryset = CarImage.objects.all()
#     serializer_class = CarImageSerializer
    
#     def get_queryset(self):
#         car_id = self.kwargs.get('car_pk')
#         if car_id:
#             return self.queryset.filter(car_id=car_id)
#         return self.queryset

# views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from django.db.models import Count, Prefetch
from django.shortcuts import get_object_or_404
from .models import Car, CarImage
from .serializers import (
    CarListSerializer,
    CarDetailSerializer,
    CarCreateUpdateSerializer,
    CarImageSerializer,
)


class CarListCreateView(generics.ListCreateAPIView):
    """
    GET: List all cars with basic info
    POST: Create a new car listing
    """
    def get_queryset(self):
        queryset = Car.objects.annotate(
            image_count=Count('images')
        ).prefetch_related(
            Prefetch('images', queryset=CarImage.objects.filter(is_primary=True))
        )
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        # Price range filter
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Year range filter
        min_year = self.request.query_params.get('min_year', None)
        max_year = self.request.query_params.get('max_year', None)
        if min_year:
            queryset = queryset.filter(year__gte=min_year)
        if max_year:
            queryset = queryset.filter(year__lte=max_year)
        
        return queryset.order_by('-is_featured', '-created_at')
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CarCreateUpdateSerializer
        return CarListSerializer


class CarDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Retrieve car details with all images
    PUT/PATCH: Update car information
    DELETE: Delete car listing
    """
    queryset = Car.objects.prefetch_related('images')
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return CarCreateUpdateSerializer
        return CarDetailSerializer
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view count
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class CarImageUploadView(APIView):
    """
    POST: Upload multiple images for a specific car
    Works with browser form - just select multiple files
    """
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request, pk):
        car = get_object_or_404(Car, pk=pk)
        
        # Get all uploaded files - Django handles multiple files with same name
        images = request.FILES.getlist('image')  # Note: singular 'image'
        
        if not images:
            return Response(
                {'error': 'No images provided. Please select at least one image.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if len(images) > 20:
            return Response(
                {'error': 'Cannot upload more than 20 images at once'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get current max order for this car
        max_order = CarImage.objects.filter(car=car).count()
        
        # Check if this is the first image for this car
        is_first_upload = max_order == 0
        
        created_images = []
        
        for idx, img in enumerate(images):
            # First image uploaded becomes primary if no images exist
            is_primary = is_first_upload and idx == 0
            
            car_image = CarImage.objects.create(
                car=car,
                image=img,
                is_primary=is_primary,
                order=max_order + idx
            )
            created_images.append(car_image)
        
        # Serialize the created images
        output_serializer = CarImageSerializer(
            created_images, 
            many=True, 
            context={'request': request}
        )
        
        return Response({
            'message': f'{len(created_images)} image(s) uploaded successfully',
            'car_id': car.id,
            'images': output_serializer.data
        }, status=status.HTTP_201_CREATED)


class CarImageDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Retrieve specific image
    PUT/PATCH: Update image details (caption, order, primary status)
    DELETE: Delete specific image
    """
    queryset = CarImage.objects.all()
    serializer_class = CarImageSerializer
    
    def get_queryset(self):
        car_id = self.kwargs.get('car_pk')
        if car_id:
            return self.queryset.filter(car_id=car_id)
        return self.queryset

