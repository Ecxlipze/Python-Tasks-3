from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from workspaces.models import WorkspaceMember

from .models import WorkspaceFile
from .serializers import WorkspaceFileSerializer


class WorkspaceFileViewSet(viewsets.ModelViewSet):
    serializer_class = WorkspaceFileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        workspace_id = self.request.query_params.get("workspace")

        queryset = WorkspaceFile.objects.filter(
            workspace__members__user=self.request.user
        ).distinct()

        if workspace_id:
            queryset = queryset.filter(
                workspace_id=workspace_id
            )

        return queryset.order_by("-uploaded_at")

    def perform_create(self, serializer):
        workspace = serializer.validated_data["workspace"]

        is_member = WorkspaceMember.objects.filter(
            workspace=workspace,
            user=self.request.user,
        ).exists()

        if not is_member:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied(
                "You are not a member of this workspace."
            )

        serializer.save(
            uploaded_by=self.request.user,
        )