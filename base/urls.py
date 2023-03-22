from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView
)

from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [

    # REGISTRATION
    path('registration/', views.RegistrationView.as_view(), name='registration'),

    # USER
    path('users/', views.UserViewSet.as_view({'get': 'list'})),
    path('user/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('user/<int:pk>/', views.UserViewSet.as_view({'get': 'retrieve','delete': 'destroy'})),

    # PROFILE
    path('me/', views.MeViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update'})),
    path('profiles/', views.ProfileViewSet.as_view({'get': 'list'})),
    path('profile/new/', views.ProfileViewSet.as_view({'post': 'create'})),
    path('profile/<int:pk>/', views.ProfileViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update'})),

    # STORE
    path('stores/', views.StoreViewSet.as_view({'get': 'list'})),
    path('store/new/', views.StoreViewSet.as_view({'post': 'create'})),
    path('store/<str:pk>/', views.StoreViewSet.as_view({'get': 'retrieve', 'delete': 'destroy'})),
    path('mystores/', views.MyStoresViewSet.as_view({'get': 'list','delete': 'destroy'})),
    path('stores/user/<int:user_id>/', views.ListStoresByUser.as_view()),

    # PRODUCT
    path('products/', views.ProductViewSet.as_view({'get': 'list'})),
    path('product/new/', views.ProductViewSet.as_view({'post': 'create'})),
    path('product/<str:pk>/', views.ProductViewSet.as_view({'get': 'retrieve', 'delete': 'destroy'})),
    path('myproducts/', views.MyProductsViewSet.as_view({'get': 'list'})),
    path('latest-products/', views.LatestProducts.as_view(), name='latest-products'),

    # REVIEW
    path('product/<str:pk>/reviews/', views.createProductReview, name="create-review"),
    path('reviews/', views.Reviews.as_view(), name='latest-reviews'),

    # STOCK
    path('stocks/', views.StockViewSet.as_view({'get': 'list'})),
    path('stock/new/', views.StockViewSet.as_view({'post': 'create'})),
    path('stock/<str:pk>/', views.updateStock, name="stock-update"),
    path('stocks/<str:pk>/', views.StockViewSet.as_view({'get': 'retrieve', 'delete': 'destroy'})),

    # CATEGORIES
    path('product-categories/', views.ProductCategory.as_view(), name='categories'),
    path('product-subcategories/', views.ProductSubcategory.as_view(), name='sub-categories'),

    # SEARCH
    path('search/', views.Search.as_view()),

    # ORDER
    path('orders', views.getOrders, name='orders'),
    path('orders/add/', views.addOrderItems, name='orders-add'),
    path('orders/myorders/', views.getMyOrders, name='myorders'),
    path('orders/<str:pk>/deliver/', views.updateOrderToDelivered, name='order-delivered'),
    path('orders/<str:pk>/', views.getOrderById, name='user-order'),
    path('orders/<str:pk>/pay/', views.updateOrderToPaid, name='pay')
]

