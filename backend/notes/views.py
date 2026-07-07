from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from workspaces.models import WorkspaceMember
from .models import Note, NoteVersion
from .serializers import NoteSerializer

class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        workspace_ids = WorkspaceMember.objects.filter(
            user=self.request.user
        ).values_list(
            "workspace_id",
            flat=True,
        )

        return Note.objects.filter(
            workspace_id__in=workspace_ids
        ).order_by("-updated_at")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        note = self.get_object()

        # Save previous version
        NoteVersion.objects.create(
            note=note,
            title=note.title,
            content=note.content,
            created_by=self.request.user,
        )

        # Save latest note
        updated_note = serializer.save()

        # Broadcast update
        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            f"workspace_{updated_note.workspace.id}_notes",
            {
                "type": "note_updated",
                "note_id": updated_note.id,
                "title": updated_note.title,
                "content": updated_note.content,
                "updated_by": self.request.user.username,
                "updated_at": updated_note.updated_at.isoformat(),
            },
        )