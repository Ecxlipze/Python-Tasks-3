from django.contrib import admin
from .models import (
    Workspace,
    WorkspaceMember,
    WorkspacePresence,
)
@admin.register(Workspace)
class WorkspaceAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
    )
    search_fields = (
        "name",
    )
@admin.register(WorkspaceMember)
class WorkspaceMemberAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "workspace",
        "user",
    )
    list_filter = (
        "workspace",
    )
    search_fields = (
        "workspace__name",
        "user__username",
    )
@admin.register(WorkspacePresence)
class WorkspacePresenceAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "workspace",
        "user",
        "online",
        "last_seen",
    )
    list_filter = (
        "workspace",
        "online",
    )
    search_fields = (
        "workspace__name",
        "user__username",
    )