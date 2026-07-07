from rest_framework import serializers
from .models import Workspace

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