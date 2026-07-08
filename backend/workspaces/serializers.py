from rest_framework import serializers

from .models import (
    Workspace,
    WorkspacePresence,
)


class WorkspaceSerializer(serializers.ModelSerializer):
    owner = serializers.CharField(
        source="owner.username",
        read_only=True,
    )

    class Meta:
        model = Workspace
        fields = [
            "id",
            "name",
            "description",
            "owner",
            "created_at",
        ]


class WorkspacePresenceSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        read_only=True,
    )

    class Meta:
        model = WorkspacePresence
        fields = [
            "id",
            "username",
            "online",
            "last_seen",
        ]