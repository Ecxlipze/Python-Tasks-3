import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NoteConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.workspace_id = self.scope["url_route"]["kwargs"]["workspace_id"]  # type: ignore
        self.room_group_name = f"workspace_{self.workspace_id}_notes"
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )
        await self.accept()
        print(f"✅ Connected to Workspace {self.workspace_id}")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name,
        )
        print(f"❌ Disconnected from Workspace {self.workspace_id}")

    async def receive(self, text_data):
        pass
    async def note_updated(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "note_id": event["note_id"],
                    "title": event["title"],
                    "content": event["content"],
                    "updated_by": event["updated_by"],
                    "updated_at": event["updated_at"],
                }
            )
        )