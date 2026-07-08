import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import WorkspacePresence

class WorkspaceConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.workspace_id = self.scope["url_route"]["kwargs"]["workspace_id"]  # type: ignore
        self.group_name = f"workspace_{self.workspace_id}"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name,
        )
        await self.accept()
        if self.scope["user"].is_authenticated:  # type: ignore
            await self.set_presence(True)

            await self.broadcast_presence()
        print(f"✅ {self.scope['user']} joined Workspace {self.workspace_id}")
    async def disconnect(self, close_code):
        if self.scope["user"].is_authenticated:  # type: ignore
            await self.set_presence(False)
            await self.broadcast_presence()
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name,
        )
        print(f"❌ {self.scope['user']} left Workspace {self.workspace_id}")

    async def receive(self, text_data):
        pass
    async def presence_update(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "presence",
                    "users": event["users"],
                }
            )
        )
    async def broadcast_presence(self):
        users = await self.get_presence()
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "presence_update",
                "users": users,
            },
        )
    @database_sync_to_async
    def set_presence(self, online):
        WorkspacePresence.objects.update_or_create(
            workspace_id=self.workspace_id,
            user=self.scope["user"], # type: ignore
            defaults={
                "online": online,
            },
        )
    @database_sync_to_async
    def get_presence(self):
        queryset = (
            WorkspacePresence.objects
            .filter(workspace_id=self.workspace_id)
            .select_related("user")
        )
        return [
            {
                "id": presence.id,
                "username": presence.user.username,
                "online": presence.online,
                "last_seen": presence.last_seen.isoformat(),
            }
            for presence in queryset
        ]