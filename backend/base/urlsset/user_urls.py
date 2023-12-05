from django.urls import path
from base.views import user_views as views
from rest_framework_simplejwt.views import (
    TokenObtainPairView
)

urlpatterns = [

    # Registration
    path('registration/', views.RegistrationView.as_view(), name='registration'),

    # User
    path('', views.UserViewSet.as_view({'get': 'list'})),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('<int:pk>/', views.UserViewSet.as_view({'get': 'retrieve', 'delete': 'destroy'})),
    path('me/', views.MeViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update'})),
 
]
