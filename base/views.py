from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.contrib.auth import get_user_model
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveAPIView, GenericAPIView
from .models import Store, Product, Profile, ProductCategory, ProductSubcategory, Stock, Review, Order, OrderItem, ShippingAddress
from base.permissions import IsAnon
from .permissions import IsOwnerOrReadOnly
from django.db.models import Q

from django.contrib.auth.hashers import make_password

from rest_framework import status
from datetime import datetime


User = get_user_model()

from .serializers import StoreSerializer, UserSerializer, RegistrationSerializer, StockSerializer ,ProductSerializer, ProductSubcategorySerializer, ProductCategorySerializer, ProfileSerializer, ReviewSerializer, SearchStockSerializer, OrderSerializer

# Create your views here.

class StoreViewSet(ModelViewSet):
    """
    CRUD operations on the store model
    """
    queryset = Store.objects.all()
    serializer_class = StoreSerializer

    def perform_create(self, serializer):
        serializer.save()


class ProfileViewSet(ModelViewSet):
    """
    CRUD operations on the band model
    """
    # permission_classes = [IsAuthenticated]
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def perform_create(self, serializer):
        serializer.save()

class ProductViewSet(ModelViewSet):
    """
    CRUD operations on the band model
    """
    queryset = Product.objects.all().order_by('name')
    serializer_class = ProductSerializer

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


@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)

class ProductCategory(ListAPIView):
    """
    GET: Get the list of all the categories.
    """
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer

class ProductSubcategory(ListAPIView):
    """
    GET: Get the list of all the subcategories.
    """
    queryset = ProductSubcategory.objects.all()
    serializer_class = ProductSubcategorySerializer

class MeViewSet(ModelViewSet):
    """
    GET: Get the user profile. (-> request.user)
    PATCH: Update the user profile. (-> request.user)
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def get_object(self):
        self.check_permissions(self.request)
        return self.request.user

class UserViewSet(ModelViewSet):

    queryset = User.objects.all()
    serializer_class = UserSerializer


class RegistrationView(CreateAPIView):
    
    queryset = User.objects.all()
    permission_classes = []
    serializer_class = RegistrationSerializer


class Search(ListAPIView):
    """
    GET: Search for Stores, Products and Profiles.. {type: "stores", search_string: "Fashion"}
    """

    def get_serializer_class(self):
        search_type = self.request.query_params.get('type', None)
        if search_type is not None:
            if search_type == 'stores':
                return StoreSerializer
            elif search_type == 'map':
                return StoreSerializer
            elif search_type == 'products':
                return ProductSerializer
            elif search_type == 'profiles':
                return ProfileSerializer
            elif search_type == 'all':
                return ProductSerializer
            elif search_type == 'product_in_store':
                return SearchStockSerializer
            elif search_type == 'product_in_my_store':
                return SearchStockSerializer
            elif search_type == 'my_products':
                return ProductSerializer

    def get_queryset(self):
        search_type = self.request.query_params.get('type', None)
        search_string = self.request.query_params.get('search_string', None)
        store_name = self.request.query_params.get('store_name', None)
        if search_type is not None:
            if search_type == 'stores':
                queryset = Store.objects.all()
                if search_string is not None:
                    queryset = queryset.filter(category__name__icontains=search_string)
                return queryset
            if search_type == 'map':
                queryset = Store.objects.all()
                if search_string is not None:
                    queryset = queryset.filter(name__icontains=search_string)
                return queryset
            if search_type == 'products':
                queryset = Product.objects.all()
                if search_string is not None:
                    queryset = queryset.filter(Q(
                       Q(subcategory__name__icontains=search_string) | 
                       Q(category__name__icontains=search_string)
                    ))
                return queryset
            if search_type == 'profiles':
                queryset = Profile.objects.all()
                if search_string is not None:
                    queryset = queryset.filter(category__name__icontains=search_string)
                return queryset
            if search_type == 'all':
                queryset = Product.objects.all()
                if search_string is not None:
                    queryset = queryset.filter(Q(
                       Q(brand__icontains=search_string) |
                       Q(name__icontains=search_string) |
                       Q(seller__username__icontains=search_string) |
                       Q(subcategory__name__icontains=search_string) |
                       Q(category__name__icontains=search_string)
                    ))
                return queryset
            if search_type == 'product_in_store':
                if store_name is not None:
                    storeId = Store.objects.get(name=store_name).id
                    store_stocks = Stock.objects.filter(store=storeId)
                if search_string is not None:
                    queryset = store_stocks.filter(Q(
                       Q(product__id__icontains=search_string) |
                       Q(product__brand__icontains=search_string) |
                       Q(product__name__icontains=search_string)
                    ))
                return queryset
            if search_type == 'product_in_my_store':
                if store_name is not None:
                    storeId = Store.objects.get(name=store_name).id
                    store_stocks = Stock.objects.filter(store=storeId)
                if search_string is not None:
                    queryset = store_stocks.filter(Q(
                       Q(product__id__icontains=search_string) |
                       Q(product__brand__icontains=search_string) |
                       Q(product__name__icontains=search_string)
                    ))
                    print(queryset)
                return queryset
            if search_type == 'my_products':
                queryset = Product.objects.filter(seller=self.request.user)
                if search_string is not None:
                    queryset = queryset.filter(Q(
                       Q(brand__icontains=search_string) |
                       Q(name__icontains=search_string) |
                       Q(id__icontains=search_string)
                    ))
                return queryset


class MyStoresViewSet(ModelViewSet):
    """
    A simple ViewSet for listing or retrieving my stores.
    """

    serializer_class = StoreSerializer

    def get_queryset(self):
        user = self.request.user.id
        stores = Store.objects.all()
        queryset = stores.filter(owner_id=user)
        return queryset


class ListStoresByUser(ListAPIView):
    """
    List all the stores of a retailer (int: user_id)
    """
    serializer_class = StoreSerializer

    def get_queryset(self):
        queryset = Store.objects.all()
        user = self.kwargs.get('user_id')
        queryset = queryset.filter(owner=user)
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


class StockViewSet(ModelViewSet):
    """
    CRUD operations on the stock model
    """
    queryset = Stock.objects.all()
    serializer_class = StockSerializer

    def perform_create(self, serializer):
        serializer.save()


@api_view(['PUT'])
@permission_classes([IsOwnerOrReadOnly])
def updateStock(request, pk):
    data = request.data
    stock = Stock.objects.get(id=pk)

    stock.number = data['number']

    stock.save()

    serializer = StockSerializer(stock, many=False)
    return Response(serializer.data)


@api_view(['GET'])
def getStock(request, pk):
    stock = Stock.objects.get(id=pk)
    serializer = StockSerializer(stock, many=False)
    return Response(serializer.data)


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

# @api_view(['GET'])
# def getLatestReviews(request):
#     reviews = Review.objects.all().order_by('-createdAt')
#     serializer = ReviewSerializer(reviews, many=True)
#     return Response(serializer.data)


class Reviews(ListAPIView):
    """
    GET: Get the list of all the categories.
    """
    queryset = Review.objects.all().order_by('-createdAt')
    serializer_class = ReviewSerializer


class LatestProducts(ListAPIView):
    """
    GET: Get the list of all the categories.
    """
    queryset = Product.objects.all().order_by('-createdAt')[:5]
    serializer_class = ProductSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data

    orderItems = data['orderItems']

    if orderItems and len(orderItems) == 0:
        return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)
    else:

        # (1) Create order
        order = Order.objects.create(
            user=user,
            paymentMethod=data['paymentMethod'],
            taxPrice=data['taxPrice'],
            shippingPrice=data['shippingPrice'],
            totalPrice=data['totalPrice']
        )

        # (2) Create shipping address
        shipping = ShippingAddress.objects.create(
            order=order,
            address=data['shippingAddress']['address'],
            city=data['shippingAddress']['city'],
            postalCode=data['shippingAddress']['postalCode'],
            country=data['shippingAddress']['country'],
        )

        # (3) Create order items adn set order to orderItem relationship
        for i in orderItems:
            product = Product.objects.get(id=i['id'])

            item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                quantity=i['quantity'],
                price=i['price'],
                image=product.image.url,
            )

            # (4) Update stock
            product.countInStock -= item.quantity
            product.save()

        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):

    user = request.user

    try:
        order = Order.objects.get(id=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            Response({'detail': 'Not authorized to view this order'},
                     status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    order = Order.objects.get(id=pk)

    order.isPaid = True
    order.paidAt = datetime.now()
    order.save()

    return Response('Order was paid')


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    order = Order.objects.get(id=pk)

    order.isDelivered = True
    order.deliveredAt = datetime.now()
    order.save()

    return Response('Order was delivered')


