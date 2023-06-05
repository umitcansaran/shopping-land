from django.urls import path
from .views import order_views, product_views, profile_views, search_views, sellerOrder_views, stock_views, user_views, store_views
from rest_framework_simplejwt.views import (
    TokenObtainPairView
)

urlpatterns = [

    # USER REGISTRATION
    path('users/registration/', user_views.RegistrationView.as_view(), name='registration'),

    # USER
    path('users/', user_views.UserViewSet.as_view({'get': 'list'})),
    path('users/<int:pk>/', user_views.UserViewSet.as_view({'get': 'retrieve', 'delete': 'destroy'})),
    path('users/me/', user_views.MeViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update'})),
    path('users/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),

    # PROFILE
    path('profiles/', profile_views.ProfileViewSet.as_view({'get': 'list'})),
    path('profiles/new/', profile_views.ProfileViewSet.as_view({'post': 'create'})),
    path('profiles/<int:pk>/', profile_views.ProfileViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update'})),
    path('profiles/sellers/', profile_views.ListSellerProfiles.as_view()),
    path('profiles/latest-sellers/', profile_views.LatestSellers.as_view(), name='latest-sellers'),
    path('profiles/user/<int:user_id>/', profile_views.ListProfileByUser.as_view()),
    path('latest-sellers/', profile_views.LatestSellers.as_view(), name='latest-sellers'),
 
    # STORE
    path('stores/', store_views.StoreViewSet.as_view({'get': 'list'})),
    path('stores/new/', store_views.StoreViewSet.as_view({'post': 'create'})),
    path('stores/<int:pk>/', store_views.StoreViewSet.as_view({'get': 'retrieve', 'delete': 'destroy'})),
    path('stores/mystores/', store_views.MyStoresViewSet.as_view({'get': 'list', 'delete': 'destroy'})),
    path('stores/user/<int:user_id>/', store_views.ListStoresByUser.as_view()),

    # PRODUCT
    path('products/', product_views.ProductViewSet.as_view({'get': 'list'})),
    path('products/new/', product_views.ProductViewSet.as_view({'post': 'create'})),
    path('products/<int:pk>/', product_views.ProductViewSet.as_view({'get': 'retrieve', 'delete': 'destroy'})),
    path('products/myproducts/', product_views.MyProductsViewSet.as_view({'get': 'list'})),
    path('products/latest-products/', product_views.LatestProducts.as_view(), name='latest-products'),
    path('products/user/<int:user_id>/', product_views.ListProductsByUser.as_view()),

    # PRODUCT REVIEW
    path('products/<int:pk>/reviews/', product_views.createProductReview, name="create-review"),
    path('products/reviews/', product_views.Reviews.as_view(), name='reviews'),
    path('products/latest-reviews/', product_views.LatestReviews.as_view(), name='latest-reviews'),
    path('products/reviews/<int:product_id>/', product_views.ListProductReviews.as_view()),

    # PRODUCT CATEGORY
    path('products/categories/', product_views.ProductCategory.as_view(), name='categories'),
    path('products/subcategories/', product_views.ProductSubcategory.as_view(), name='subcategories'),

    # STOCK
    path('stocks/', stock_views.StockViewSet.as_view({'get': 'list'})),
    path('stocks/new/', stock_views.createStock, name="stock-create"),
    path('stocks/<int:pk>/', stock_views.updateStock, name="stock-update"),
    path('stocks/<int:pk>/', stock_views.StockViewSet.as_view({'get': 'retrieve', 'delete': 'destroy'})),
    path('stocks/product/<int:product_id>/', stock_views.ListProductStocks.as_view()), 
    path('stocks/store/<int:store_id>/', stock_views.ListStoreStocks.as_view()),
 
    # CUSTOMER ORDER
    path('orders/', order_views.getOrders, name='orders'),
    path('orders/<int:pk>/', order_views.getOrderById, name='seller-order'),
    path('orders/myorders/', order_views.getMyOrders, name='customer-myorders'),
    path('orders/add/', order_views.createOrder, name='create-order'),
    path('orders/<int:pk>/pay/', order_views.updateOrderToPaid, name='pay'),
    path('orders/order-items/<int:pk>/retrieve/', order_views.updateOrderItemToRetrieved, name='order-item-retrieved'),

    # SELLER ORDER
    path('seller-orders', sellerOrder_views.getSellerOrders, name='seller-orders'),
    path('seller-orders/<int:pk>/', sellerOrder_views.getSellerOrderById, name='seller-order'),
    path('seller-orders/myorders/', sellerOrder_views.getMySellerOrders, name='seller-myorders'),
    path('seller-orders/<int:pk>/send/', sellerOrder_views.updateSellerOrderToSent, name='seller-order-send'),
    path('seller-orders/<int:pk>/complete/', sellerOrder_views.updateSellerOrderToCompleted, name='seller-order-complete'),

    # SEARCH
    path('search/', search_views.Search.as_view())
    
]


