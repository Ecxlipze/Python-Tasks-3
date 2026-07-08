import os

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import chat.routing
import notes.routing
import notifications.routing
import workspaces.routing
from config.middleware import JWTAuthMiddleware

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": JWTAuthMiddleware(
            URLRouter(
                chat.routing.websocket_urlpatterns
                + notes.routing.websocket_urlpatterns
                + workspaces.routing.websocket_urlpatterns
                + notifications.routing.websocket_urlpatterns
            )
        ),
    }
)