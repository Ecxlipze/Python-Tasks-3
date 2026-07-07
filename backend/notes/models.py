from django.db import models
from django.contrib.auth.models import User
from workspaces.models import Workspace

class Note(models.Model):
    workspace = models.ForeignKey(
        Workspace,
        on_delete=models.CASCADE,
        related_name="notes",
    )
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="notes",
    )
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(
        auto_now_add=True,
        null=True,
        blank=True,
    )
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class NoteVersion(models.Model):
    note = models.ForeignKey(
        Note,
        on_delete=models.CASCADE,
        related_name="versions",
    )

    title = models.CharField(max_length=255)
    content = models.TextField()
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="note_versions",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.note.title} - {self.created_at}"