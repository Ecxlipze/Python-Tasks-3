from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from .models import Message
from .serializers import MessageSerializer


class MessageListView(ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        room = self.request.query_params.get(
            "room",
            "general",
        )

        return (
            Message.objects.filter(
                room=room,
            )
            .select_related("sender")
            .order_by("-timestamp")[:20]
        )