from django.urls import re_path
from .consumers import NoteConsumer
websocket_urlpatterns = [
    re_path(
        r"ws/notes/(?P<workspace_id>\d+)/$",
        NoteConsumer.as_asgi(), # type: ignore
    ), # type: ignore
]