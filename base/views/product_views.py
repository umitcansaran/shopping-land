from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny 
from django.contrib.auth import get_user_model
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import ListAPIView
from rest_framework.pagination import LimitOffsetPagination
from ..models import Product, ProductCategory, ProductSubcategory, Review, Stock
from ..serializers import ProductSerializer, ProductCategorySerializer, ProductSubcategorySerializer, ReviewSerializer, StockSerializer

User = get_user_model()

class ProductViewSet(ModelViewSet):
    """
    CRUD operations on the product model
    """
    queryset = Product.objects.all().order_by('name')
    serializer_class = ProductSerializer
    pagination_class = LimitOffsetPagination

    def perform_create(self, serializer):
        serializer.save()

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == 'post':
            permission_classes = [IsAuthenticated]
        elif self.action == 'delete':
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]
    
class ListProductsByUser(ListAPIView):
    """
    List all the products of a seller (int: user_id)
    """
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.all()
        user = self.kwargs.get('user_id')
        queryset = queryset.filter(seller=user)
        return queryset
    
    
class MyProductsViewSet(ModelViewSet):
    """
    A simple ViewSet for listing or retrieving a retailer's products.
    """

    serializer_class = ProductSerializer

    def get_queryset(self):
        user = self.request.user.id
        products = Product.objects.all()
        queryset = products.filter(seller_id=user)
        return queryset
    
class LatestProducts(ListAPIView):
    """
    GET: Get most recently added five products.
    """
    queryset = Product.objects.all().order_by('-createdAt')[:5]
    serializer_class = ProductSerializer


class ListProductReviews(ListAPIView):
    """
    List all the reviews of a product (int: product_id)
    """
    serializer_class = ReviewSerializer

    def get_queryset(self):
        queryset = Review.objects.all()
        product_id = self.kwargs.get('product_id')
        queryset = queryset.filter(product=product_id)
        return queryset


class ProductCategory(ListAPIView):
    """
    GET: Get the list of all categories.
    """
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer


class ProductSubcategory(ListAPIView):
    """
    GET: Get the list of all subcategories.
    """
    queryset = ProductSubcategory.objects.all()
    serializer_class = ProductSubcategorySerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    product = Product.objects.get(id=pk)
    data = request.data

    # 1 - Review already exists
    alreadyExists = product.review_set.filter(user=user).exists()
    if alreadyExists:
        content = {'detail': 'Product already reviewed'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # 2 - No Rating or 0
    elif data['rating'] == 0:
        content = {'detail': 'Please select a rating'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # 3 - Create review
    else:
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.username,
            rating=data['rating'],
            comment=data['comment'],
        )

        reviews = product.review_set.all()
        product.numReviews = len(reviews)

        total = 0
        for i in reviews:
            total += i.rating

        product.rating = total / len(reviews)
        product.save()

        return Response('Review Added')


class Reviews(ListAPIView):
    """
    GET: Get all the reviews.
    """
    queryset = Review.objects.all().order_by('-createdAt')
    serializer_class = ReviewSerializer

class LatestReviews(ListAPIView):
    """
    GET: Get most recently added five reviews.
    """
    queryset = Review.objects.all().order_by('-createdAt')[:5]
    serializer_class = ReviewSerializer