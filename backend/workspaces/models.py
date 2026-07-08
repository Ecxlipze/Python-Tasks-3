from django.db import models
from django.contrib.auth.models import User


class Workspace(models.Model):
    name = models.CharField(
        max_length=255,
    )

    description = models.TextField(
        blank=True,
        default="",
    )

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="owned_workspaces",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    def __str__(self):
        return self.name


class WorkspaceMember(models.Model):
    ROLE_CHOICES = [
        ("owner", "Owner"),
        ("admin", "Admin"),
        ("member", "Member"),
    ]

    workspace = models.ForeignKey(
        Workspace,
        on_delete=models.CASCADE,
        related_name="members",
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="workspace_memberships",
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="member",
    )

    joined_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        unique_together = (
            "workspace",
            "user",
        )

    def __str__(self):
        return f"{self.user.username} ({self.role})"


class WorkspacePresence(models.Model):
    workspace = models.ForeignKey(
        Workspace,
        on_delete=models.CASCADE,
        related_name="presence",
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="presence",
    )

    online = models.BooleanField(
        default=False,
    )

    current_room = models.CharField(
        max_length=100,
        blank=True,
        default="",
    )

    last_seen = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        unique_together = (
            "workspace",
            "user",
        )

    def __str__(self):
        status = "🟢" if self.online else "🔴"
        return (
            f"{status} {self.user.username} ({self.current_room})"
        )