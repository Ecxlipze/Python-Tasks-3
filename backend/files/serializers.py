from rest_framework import serializers

from .models import WorkspaceFile


class WorkspaceFileSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.CharField(
        source="uploaded_by.username",
        read_only=True,
    )

    class Meta:
        model = WorkspaceFile
        fields = [
            "id",
            "workspace",
            "uploaded_by",
            "file",
            "uploaded_at",
        ]
        read_only_fields = [
            "uploaded_by",
            "uploaded_at",
        ]