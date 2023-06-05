from django.urls import path
from base.views import store_views as views


urlpatterns = [
    path('', views.StoreViewSet.as_view({'get': 'list'})),
    path('new/', views.StoreViewSet.as_view({'post': 'create'})),
    path('<int:pk>/', views.StoreViewSet.as_view({'get': 'retrieve', 'delete': 'destroy'})),
    path('mystores/', views.MyStoresViewSet.as_view({'get': 'list', 'delete': 'destroy'})),
    path('user/<int:user_id>/', views.ListStoresByUser.as_view()),]
