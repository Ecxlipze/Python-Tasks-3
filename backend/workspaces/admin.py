from django.contrib import admin
from .models import Workspace, WorkspaceMember

@admin.register(Workspace)
class WorkspaceAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "owner",
        "created_at",
    )
    search_fields = (
        "name",
        "owner__username",
    )

@admin.register(WorkspaceMember)
class WorkspaceMemberAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "workspace",
        "user",
        "role",
        "joined_at",
    )

    list_filter = (
        "role",
        "workspace",
    )

    search_fields = (
        "workspace__name",
        "user__username",
    )