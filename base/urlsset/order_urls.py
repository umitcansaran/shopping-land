from django.urls import path
from base.views import order_views as views


urlpatterns = [
    path('', views.getOrders, name='orders'),
    path('<int:pk>/', views.getOrderById, name='seller-order'),
    path('myorders/', views.getMyOrders, name='customer-myorders'),
    path('add/', views.createOrder, name='create-order'),
    path('<int:pk>/pay/', views.updateOrderToPaid, name='pay'),
    path('order-items/<int:pk>/retrieve/', views.updateOrderItemToRetrieved, name='order-item-retrieved'),
]
