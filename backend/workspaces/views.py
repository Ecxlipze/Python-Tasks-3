from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Workspace, WorkspaceMember
from .serializers import WorkspaceSerializer

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