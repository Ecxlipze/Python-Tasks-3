from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import (
    Workspace,
    WorkspaceMember,
    WorkspacePresence,
)
from .serializers import (
    WorkspaceSerializer,
    WorkspacePresenceSerializer,
)


class WorkspaceViewSet(viewsets.ModelViewSet):
    serializer_class = WorkspaceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Workspace.objects.filter(
            members__user=self.request.user
        ).distinct()

    def perform_create(self, serializer):
        workspace = serializer.save(
            owner=self.request.user
        )

        WorkspaceMember.objects.create(
            workspace=workspace,
            user=self.request.user,
            role="owner",
        )

    @action(detail=True, methods=["get"])
    def presence(self, request, pk=None):
        workspace = self.get_object()

        queryset = WorkspacePresence.objects.filter(
            workspace=workspace
        ).select_related("user")

        serializer = WorkspacePresenceSerializer(
            queryset,
            many=True,
        )

        return Response(serializer.data)