from django.db import models
from django.contrib.auth.models import User
class Message(models.Model):
    room = models.CharField(
        max_length=100,
    )
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="messages",
    )
    content = models.TextField()
    timestamp = models.DateTimeField(
        auto_now_add=True,
    )
    class Meta:
        ordering = [
            "timestamp",
        ]
    def __str__(self):
        return f"[{self.room}] {self.sender.username}: {self.content[:30]}"