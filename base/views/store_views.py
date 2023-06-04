from django.contrib.auth import get_user_model
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import ListAPIView
from ..models import Store

User = get_user_model()

from ..serializers import StoreSerializer, MyStoreSerializer

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
    
