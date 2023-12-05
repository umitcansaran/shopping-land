from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import get_user_model
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from ..permissions import IsOwnerOrReadOnly
from ..models import Store, Product, Stock
from ..serializers import StockSerializer

User = get_user_model()
    

class StockViewSet(ModelViewSet):
    """
    CRUD operations on the stock model
    """
    queryset = Stock.objects.all()
    serializer_class = StockSerializer

    def perform_create(self, serializer):
        serializer.save()
        

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


@api_view(['POST'])
@permission_classes([IsOwnerOrReadOnly])
def createStock(request):

    data = request.data
    product = Product.objects.get(id=data['product'])
    store = Store.objects.get(id=data['store'])

    stock = Stock.objects.create(
        store=store,
        product=product,
        number=data['number']
    )

    serializer = StockSerializer(stock, many=False)
    return Response(serializer.data)


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