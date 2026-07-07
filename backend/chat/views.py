from rest_framework.generics import ListAPIView
from .models import Message
from .serializers import MessageSerializer


class MessageListView(ListAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        return Message.objects.order_by("-timestamp")[:20]