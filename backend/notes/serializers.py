from rest_framework import serializers
from .models import Note

class NoteSerializer(serializers.ModelSerializer):
    owner = serializers.CharField(
        source="owner.username",
        read_only=True,
    )
    workspace_name = serializers.CharField(
        source="workspace.name",
        read_only=True,
    )
    class Meta:
        model = Note
        fields = [
            "id",
            "title",
            "content",
            "owner",
            "workspace",
            "workspace_name",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "owner",
            "created_at",
            "updated_at",
        ]