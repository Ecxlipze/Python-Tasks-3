from django.db import models
from django.contrib.auth.models import User

from workspaces.models import Workspace


class Notification(models.Model):
    TYPE_CHOICES = [
        ("note_updated", "Note Updated"),
        ("note_created", "Note Created"),
        ("chat_message", "Chat Message"),
        ("user_joined", "User Joined"),
        ("file_uploaded", "File Uploaded"),
    ]

    recipient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="notifications",
    )

    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="sent_notifications",
    )

    workspace = models.ForeignKey(
        Workspace,
        on_delete=models.CASCADE,
        related_name="notifications",
    )

    notification_type = models.CharField(
        max_length=30,
        choices=TYPE_CHOICES,
    )

    message = models.TextField()

    is_read = models.BooleanField(
        default=False,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = [
            "-created_at",
        ]

    def __str__(self):
        return f"{self.sender.username} → {self.recipient.username}"