import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model

from .models import Message

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]  # type: ignore
        self.room_group_name = f"chat_{self.room_name}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )

        await self.accept()

        print(f"✅ Joined room: {self.room_name}")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name,
        )

        print(f"❌ Left room: {self.room_name}")

    async def receive(self, text_data):
        data = json.loads(text_data)

        message = data["message"]

        await self.save_message(
            room=self.room_name,
            sender=self.scope["user"],
            content=message,
        )

        # Send message to everyone in the chat room
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "room": self.room_name,
                "sender": self.scope["user"].username,
                "message": message,
            },
        )

        # Send notification to every OTHER user
        await self.send_notifications(message)

    async def chat_message(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "room": event["room"],
                    "sender": event["sender"],
                    "message": event["message"],
                }
            )
        )

    async def send_notifications(self, message):
        users = await self.get_all_users()

        for user in users:
            if user.id == self.scope["user"].id:
                continue

            await self.channel_layer.group_send(
                f"notifications_{user.id}",
                {
                    "type": "notification_message",
                    "title": "New Message",
                    "message": message,
                    "room": self.room_name,
                    "sender": self.scope["user"].username,
                },
            )

    @database_sync_to_async
    def get_all_users(self):
        return list(User.objects.all())

    @database_sync_to_async
    def save_message(self, room, sender, content):
        Message.objects.create(
            room=room,
            sender=sender,
            content=content,
        )