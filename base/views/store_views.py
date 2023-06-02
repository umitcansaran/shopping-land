from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, CreateAPIView
from ..models import Store, Product, Profile, ProductCategory, ProductSubcategory, Stock, Review, Order, SellerOrder, OnlineOrderItem, InStoreOrderItem, ShippingAddress
from base.permissions import IsAnon
from ..permissions import IsOwnerOrReadOnly
from django.db.models import Q
from rest_framework.pagination import LimitOffsetPagination
from django.utils import timezone
from rest_framework import status
from datetime import datetime
from decimal import Decimal

User = get_user_model()

from ..serializers import StoreSerializer, MyStoreSerializer, UserSerializer, RegistrationSerializer, StockSerializer ,ProductSerializer, ProductSubcategorySerializer, ProductCategorySerializer, ProfileSerializer, ReviewSerializer, SearchStockSerializer, OrderSerializer, MySellerOrdersSerializer, MyOrderSerializer, SellerOrderSerializer

class StoreViewSet(ModelViewSet):
    """
    CRUD operations on the store model
    """
    queryset = Store.objects.all()
    serializer_class = StoreSerializer

    def perform_create(self, serializer):
        serializer.save()

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
    
