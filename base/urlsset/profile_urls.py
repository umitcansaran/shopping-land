from django.urls import path
from base.views import profile_views as views


urlpatterns = [
    path('', views.ProfileViewSet.as_view({'get': 'list'})),
    path('new/', views.ProfileViewSet.as_view({'post': 'create'})),
    path('<int:pk>/', views.ProfileViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update'})),
    path('sellers/', views.ListSellerProfiles.as_view()),
    path('latest-sellers/', views.LatestSellers.as_view(), name='latest-sellers'),
    path('user/<int:user_id>/', views.ListProfileByUser.as_view()),
 ]
