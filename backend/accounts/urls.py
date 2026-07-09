from django.urls import path
from .views import RegisterView, profile

urlpatterns = [
    path(
        "auth/register/",
        RegisterView.as_view(),
        name="register",
    ),
    path(
        "profile/",
        profile,
        name="profile",
    ),
]