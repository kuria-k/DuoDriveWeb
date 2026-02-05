# chats/views.py
from rest_framework import generics
from .models import Message
from .serializers import MessageSerializer

class MessageListView(generics.ListAPIView):
    queryset = Message.objects.all().order_by('timestamp')
    serializer_class = MessageSerializer

class MessageCreateView(generics.CreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
