from django.urls import path
from base.views import sellerOrder_views as views


urlpatterns = [
    path('', views.getSellerOrders, name='seller-orders'),
    path('<int:pk>/', views.getSellerOrderById, name='seller-order'),
    path('myorders/', views.getMySellerOrders, name='seller-myorders'),
    path('<int:pk>/send/', views.updateSellerOrderToSent, name='seller-order-send'),
    
]
