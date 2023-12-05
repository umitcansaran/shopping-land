from django.urls import path
from base.views import product_views as views


urlpatterns = [

    # Product
    path('', views.ProductViewSet.as_view({'get': 'list'})),
    path('new/', views.ProductViewSet.as_view({'post': 'create'})),
    path('<int:pk>/', views.ProductViewSet.as_view({'get': 'retrieve', 'delete': 'destroy'})),
    path('myproducts/', views.MyProductsViewSet.as_view({'get': 'list'})),
    path('latest-products/', views.LatestProducts.as_view(), name='latest-products'),
    path('user/<int:user_id>/', views.ListProductsByUser.as_view()),

    # Review
    path('<int:pk>/reviews/', views.createProductReview, name="create-review"),
    path('reviews/', views.Reviews.as_view(), name='reviews'),
    path('latest-reviews/', views.LatestReviews.as_view(), name='latest-reviews'),
    path('reviews/<int:product_id>/', views.ListProductReviews.as_view()),

    # Categories
    path('categories/', views.ProductCategory.as_view(), name='categories'),
    path('subcategories/', views.ProductSubcategory.as_view(), name='subcategories'),

]

