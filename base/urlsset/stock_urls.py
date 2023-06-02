from django.urls import path
from base.views import stock_views as views


urlpatterns = [
    path('', views.StockViewSet.as_view({'get': 'list'})),
    path('new/', views.createStock, name="stock-create"),
    path('<int:pk>/', views.updateStock, name="stock-update"),
    path('<int:pk>/', views.StockViewSet.as_view({'get': 'retrieve', 'delete': 'destroy'})),
    path('product/<int:product_id>/', views.ListProductStocks.as_view()), 
    path('<int:store_id>/', views.ListStoreStocks.as_view()),]
