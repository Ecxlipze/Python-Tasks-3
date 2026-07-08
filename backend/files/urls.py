from rest_framework.routers import DefaultRouter

from .views import WorkspaceFileViewSet

router = DefaultRouter()

router.register(
    "files",
    WorkspaceFileViewSet,
    basename="files",
)

urlpatterns = router.urls