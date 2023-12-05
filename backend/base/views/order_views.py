
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from django.utils import timezone
from ..models import Order, ShippingAddress, SellerOrder, OnlineOrderItem, InStoreOrderItem, Product, Stock, Store
from ..serializers import OrderSerializer, MyOrderSerializer
from decimal import Decimal

User = get_user_model()

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createOrder(request):
    user = request.user
    data = request.data        

    orderItems = data['orderItems']
    sellerNames = []

    # Get seller names and remove duplicates
    for i in orderItems:
        if i['seller'] not in sellerNames: 
            sellerNames.append(i['seller'])

    if orderItems and len(orderItems) == 0:
        return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)
    else:

        # 1. Create customer order
        order = Order.objects.create(
            customer=user,
            paymentMethod=data['paymentMethod'],
            totalShippingPrice=data['totalShippingPrice'],
            totalPrice=data['totalPrice']
        )

        # 2. Create shipping address if order includes an online purchase
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

        # 3. Create seller order(s) inside customer order for each individual seller
        for i in sellerNames:
            totalPrice = 0 
            seller = User.objects.get(username=i)
            
            sellerOrder = SellerOrder.objects.create(
                seller=seller,
                order=order,
                customer=user
            )

            # 4. Create 'online' or 'pick up' order item inside seller order and update item stock
            for x in orderItems:

                if x['seller'] == i: 
                    product = Product.objects.get(id=x['id'])

                    if x['orderType'] == 'online':

                        item = OnlineOrderItem.objects.create(
                            product=product,
                            sellerOrder=sellerOrder,
                            name=product.name,
                            quantity=x['quantity'],
                            price=Decimal(x['price']),
                            image=product.image.url,
                            orderType=x['orderType']
                        )

                        # for 'online' purchase items, deduct number from store stocks stating from the largest one
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

                        store = Store.objects.get(id=x['storeId'])

                        item = InStoreOrderItem.objects.create(
                            product=product,
                            sellerOrder=sellerOrder,
                            name=product.name,
                            quantity=x['quantity'],
                            price=Decimal(x['price']),
                            image=product.image.url,
                            store=store,
                            orderType=x['orderType']
                        )

                        # for 'pick up' items, update related stock
                        stock = Stock.objects.get(id=x['stockId'])
                        stock.number = stock.number - x['quantity']
                        stock.save()

                    totalPrice += Decimal(x['price']) * x['quantity']
                    sellerOrder.totalPrice = totalPrice
                    sellerOrder.save()
            # 5. Calculate total price and shipping price for each seller orders. Shipping is free after CHF 100.- 
            if totalPrice > 100:
                sellerOrder.shippingPrice = 0
            else:
                sellerOrder.shippingPrice = 20
            sellerOrder.save()

        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
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
def getMyOrders(request):
    user = request.user
    orders = user.order_set.all().order_by('-createdAt')
    serializer = MyOrderSerializer(orders, many=True)
    return Response(serializer.data)


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
def updateOrderItemToRetrieved(request, pk):

    orderItem = InStoreOrderItem.objects.get(id=pk)

    orderItem.isRetrieved = True
    orderItem.retrievedAt = timezone.now()
    orderItem.save()

    return Response('Item is retrieved')