from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from django.utils import timezone
from rest_framework import status
from ..models import SellerOrder
from ..serializers import  MySellerOrdersSerializer, SellerOrderSerializer

User = get_user_model()

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
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getSellerOrders(request):
    sellerOrders = SellerOrder.objects.all().order_by('-createdAt')
    serializer = SellerOrderSerializer(sellerOrders, many=True)
    return Response(serializer.data)


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
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMySellerOrders(request):
    user = request.user
    sellerOrders = user.sellerOrders.all().order_by('-createdAt')
    serializer = MySellerOrdersSerializer(sellerOrders, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateSellerOrderToSent(request, pk):

    sellerOrder = SellerOrder.objects.get(id=pk)

    sellerOrder.isShipped = True
    sellerOrder.shippedAt = timezone.now()
    sellerOrder.save()

    return Response('Seller Order is sent')


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateSellerOrderToCompleted(request, pk):

    sellerOrder = SellerOrder.objects.get(id=pk)

    sellerOrder.isCompleted = True
    sellerOrder.completedAt = timezone.now()
    sellerOrder.save()

    return Response('Seller Order is completed')