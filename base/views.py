from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.contrib.auth import get_user_model
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveAPIView, GenericAPIView
from .models import Store, Product, Profile, ProductCategory, ProductSubcategory, Stock, Review, Order, SellerOrder, OrderItem, ShippingAddress
from base.permissions import IsAnon
from .permissions import IsOwnerOrReadOnly
from django.db.models import Q
from rest_framework.pagination import LimitOffsetPagination
from django.utils import timezone


from django.contrib.auth.hashers import make_password

from rest_framework import status
from datetime import datetime
from decimal import Decimal


User = get_user_model()

from .serializers import StoreSerializer, MyStoreSerializer, UserSerializer, RegistrationSerializer, StockSerializer ,ProductSerializer, ProductSubcategorySerializer, ProductCategorySerializer, ProfileSerializer, ReviewSerializer, SearchStockSerializer, OrderSerializer, MyOrderSerializer, SellerOrderSerializer

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
    CRUD operations on the profile model
    """
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def perform_create(self, serializer):
        serializer.save()


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
    

class ListProductStocks(ListAPIView):
    """
    List all the stocks of a products (int: product_id)
    """
    serializer_class = StockSerializer

    def get_queryset(self):
        queryset = Stock.objects.all().order_by('store')
        product_id = self.kwargs.get('product_id')
        queryset = queryset.filter(product=product_id)
        return queryset
    

class ListStoreStocks(ListAPIView):
    """
    List all the stocks of a store (int: store_id)
    """
    serializer_class = StockSerializer

    def get_queryset(self):
        queryset = Stock.objects.all()
        store_id = self.kwargs.get('store_id')
        queryset = queryset.filter(store=store_id)
        return queryset
    

class ListSellerProfiles(ListAPIView):
    """
    List all the seller profiles
    """
    serializer_class = ProfileSerializer

    def get_queryset(self):
        queryset = Profile.objects.all()
        queryset = queryset.filter(status='STORE_OWNER')
        return queryset
    

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


class MeViewSet(ModelViewSet):
    """
    GET: Get the user profile. (-> request.user)
    PATCH: Update the user profile. (-> request.user)
    """
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def get_object(self):
        self.check_permissions(self.request)
        return self.request.user


class UserViewSet(ModelViewSet):
    """
    GET: List the users profile. (-> request.user)
    DELETE: Remove user profile. (-> request.user)
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer


class RegistrationView(CreateAPIView):
    
    queryset = User.objects.all()
    permission_classes = []
    serializer_class = RegistrationSerializer


class Search(ListAPIView):
    """
    GET: Search for Stores, Products or Profiles.. {type: "stores", search_string: "Fashion"}
    """
    def get_serializer_class(self):
        search_type = self.request.query_params.get('type', None)
        if search_type is not None:
            if search_type == 'profiles':
                return ProfileSerializer
            elif search_type == 'products':
                return ProductSerializer
            elif search_type == 'stores':
                return StoreSerializer
            elif search_type == 'my_products':
                return ProductSerializer
            elif search_type == 'my_stores':
                return StoreSerializer
            elif search_type == 'products_in_store':
                return SearchStockSerializer
            elif search_type == 'products_in_my_store':
                return StockSerializer
            elif search_type == 'products_by_seller':
                return ProductSerializer
            elif search_type == 'map':
                return StoreSerializer
            elif search_type == 'all':
                return ProductSerializer

    def get_queryset(self):
        search_type = self.request.query_params.get('type', None)
        search_string = self.request.query_params.get('search_string', None)
        store_name = self.request.query_params.get('store_name', None)
        store_id = self.request.query_params.get('store_id', None)
        seller_id = self.request.query_params.get('seller_id', None)
        if search_type is not None:
            if search_type == 'profiles':
                queryset = Profile.objects.all()
                if search_string is not None:
                    queryset = queryset.filter(category__name__icontains=search_string)
                return queryset
            if search_type == 'products':
                queryset = Product.objects.all()
                if search_string is not None:
                    queryset = queryset.filter(Q(
                       Q(subcategory__name__icontains=search_string) | 
                       Q(category__name__icontains=search_string)
                    ))
                return queryset
            if search_type == 'stores':
                queryset = Store.objects.all()
                if search_string is not None:
                    queryset = queryset.filter(category__name__icontains=search_string)
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
            if search_type == 'my_stores':
                queryset = Store.objects.filter(owner=self.request.user)
                if search_string is not None:
                    queryset = queryset.filter(Q(
                       Q(id__icontains=search_string) |
                       Q(name__icontains=search_string)
                    ))
                return queryset
            if search_type == 'products_in_store':
                if store_id is not None:
                    store_stocks = Stock.objects.filter(store=store_id)
                if search_string is not None:
                    queryset = store_stocks.filter(Q(
                       Q(product__id__icontains=search_string) |
                       Q(product__brand__icontains=search_string) |
                       Q(product__name__icontains=search_string)
                    ))
                return queryset
            if search_type == 'products_in_my_store':
                if store_id is not None:
                    store_stocks = Stock.objects.filter(store=store_id)
                if search_string is not None:
                    queryset = store_stocks.filter(Q(
                       Q(product__id__icontains=search_string) |
                       Q(product__brand__icontains=search_string) |
                       Q(product__name__icontains=search_string)
                    ))
                return queryset
            if search_type == 'products_by_seller':
                if seller_id is not None:
                    queryset = Product.objects.filter(seller=seller_id)
                    queryset = queryset.filter(Q(
                        Q(brand__icontains=search_string) |
                        Q(name__icontains=search_string)
                        ))
                    return queryset
            if search_type == 'map':
                queryset = Store.objects.all()
                if search_string is not None:
                    queryset = queryset.filter(owner__username__icontains=search_string)
                return queryset
            if search_type == 'all':
                queryset = Product.objects.all().order_by('name')
                queryset = queryset.filter(Q(
                    Q(brand__icontains=search_string) |
                    Q(name__icontains=search_string) |
                    Q(seller__username__icontains=search_string)
                ))
                return queryset


class MyStoresViewSet(ModelViewSet):
    """
    GET: List seller's stores. (-> request.user)
    DELETE: Remove seller's store. (-> request.user)
    """
    serializer_class = MyStoreSerializer

    def get_queryset(self):
        user = self.request.user.id
        stores = Store.objects.all()
        queryset = stores.filter(owner_id=user)
        return queryset


class ListStoresByUser(ListAPIView):
    """
    List stores of a seller (int: user_id)
    """
    serializer_class = StoreSerializer

    def get_queryset(self):
        queryset = Store.objects.all()
        user = self.kwargs.get('user_id')
        queryset = queryset.filter(owner=user)
        return queryset
    
class ListProfileByUser(ListAPIView):
    """
    List the profile of a user (int: user_id)
    """
    serializer_class = ProfileSerializer

    def get_queryset(self):
        queryset = Profile.objects.all()
        user = self.kwargs.get('user_id')
        queryset = queryset.filter(user=user)
        return queryset
    
    
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
    
class ListSellerOrder(ListAPIView):
    """
    List all the products of a seller (int: user_id)
    """
    serializer_class = SellerOrderSerializer

    def get_queryset(self):
        queryset = SellerOrder.objects.all()
        keyword = self.kwargs.get('pk')
        queryset = queryset.filter(id=keyword)
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


class Reviews(ListAPIView):
    """
    GET: Get all the reviews.
    """
    queryset = Review.objects.all().order_by('-createdAt')
    serializer_class = ReviewSerializer


class LatestProducts(ListAPIView):
    """
    GET: Get most recently added five products.
    """
    queryset = Product.objects.all().order_by('-createdAt')[:5]
    serializer_class = ProductSerializer

class LatestReviews(ListAPIView):
    """
    GET: Get most recently added five reviews.
    """
    queryset = Review.objects.all().order_by('-createdAt')[:5]
    serializer_class = ReviewSerializer


class LatestSellers(ListAPIView):
    """
    GET: Get most recently added five reviews. 
    """ 
    queryset = Profile.objects.filter(status='STORE_OWNER').order_by('-id')[:5]
    serializer_class = ProfileSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data        

    orderItems = data['orderItems']
    sellerList = []
    sellerNames = []
    totalPrice = 0

    # Get seller names
    for i in orderItems:
        sellerList.append(i['seller'])

    # Remove duplicates
    for i in sellerList: 
        if i not in sellerNames: 
            sellerNames.append(i) 

    if orderItems and len(orderItems) == 0:
        return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)
    else:

        # (1) Create order
        order = Order.objects.create(
            customer=user,
            paymentMethod=data['paymentMethod'],
            totalShippingPrice=data['totalShippingPrice'],
            totalPrice=data['totalPrice']
        )

        # (2) Create shipping address
        if data['shippingAddress']:
            shipping = ShippingAddress.objects.create(
                order=order,
                address=data['shippingAddress']['address'],
                city=data['shippingAddress']['city'],
                postalCode=data['shippingAddress']['postalCode'],
                country=data['shippingAddress']['country'],
            )
        else:
            shipping = ShippingAddress.objects.create(
                order=order,
                address='null',
                city='null',
                postalCode='null',
                country='null',
            )

        for i in sellerNames:
            seller = User.objects.get(username=i)
            
            sellerOrder = SellerOrder.objects.create(
                # shippingPrice=data['shippingPrice'],
                seller=seller,
                order=order,
                customer=user
            )

            # (4) Update stock
            for x in orderItems:

                if x['seller'] == i: 

                    product = Product.objects.get(id=x['id'])
                    if x['orderType'] == 'online':
                        store = None 
                    else:
                        store = Store.objects.get(id=x['storeId'])
                        seller = User.objects.get(username=x['seller'])

                    item = OrderItem.objects.create(
                        product=product,
                        sellerOrder=sellerOrder,
                        name=product.name,
                        quantity=x['quantity'],
                        price=Decimal(x['price']),
                        image=product.image.url,
                        store=store,
                        orderType=x['orderType']
                    )

                    if x['orderType'] == 'online':
                        stocks = Stock.objects.filter(product=product.id).order_by('-number')
                        for stock in stocks:
                            quantityLeft = x['quantity']
                            if stock.number is not None and stock.number >= x['quantity']:
                                stock.number -= x['quantity']
                                stock.save()
                                break
                            elif stock.number is not None:
                                quantityLeft -= stock.number
                                x['quantity'] = quantityLeft
                                stock.number = 0
                                stock.save()
                    elif x['orderType'] == 'inStore':
                        stock = Stock.objects.get(id=x['stockId'])
                        stock.number = stock.number - x['quantity']
                        stock.save()

                    totalPrice += Decimal(x['price']) * x['quantity']
                    print(totalPrice)
                    sellerOrder.totalPrice = totalPrice
                    sellerOrder.save()
            if totalPrice > 100:
                sellerOrder.shippingPrice = 0
            else:
                sellerOrder.shippingPrice = 20
            sellerOrder.save()

        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyPurchases(request):
    user = request.user
    orders = user.order_set.all()
    serializer = MyOrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMySellerOrders(request):
    user = request.user
    sellerOrders = user.sellerOrders.all()
    serializer = SellerOrderSerializer(sellerOrders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getSellerOrders(request):
    sellerOrders = SellerOrder.objects.all().order_by('-createdAt')
    serializer = SellerOrderSerializer(sellerOrders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):

    user = request.user

    try:
        order = Order.objects.get(id=pk)
        print(order)
        if order.customer == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            Response({'detail': 'Not authorized to view this order'},
                     status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getSellerOrderById(request, pk):

    user = request.user

    try:
        sellerOrder = SellerOrder.objects.get(id=pk)
        if sellerOrder.seller == user:
            serializer = SellerOrderSerializer(sellerOrder, many=False)
            return Response(serializer.data)
        else:
            Response({'detail': 'Not authorized to view this store order'},
                     status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'detail': 'Store order does not exist'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    order = Order.objects.get(id=pk)

    order.isPaid = True
    order.paidAt = datetime.now()
    order.save()

    return Response('Order was paid')


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateSellerOrderToSent(request, pk):

    sellerOrder = SellerOrder.objects.get(id=pk)

    sellerOrder.isShipped = True
    sellerOrder.shippedAt = timezone.now()
    sellerOrder.save()

    return Response('Seller Order is sent')


