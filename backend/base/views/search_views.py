from django.contrib.auth import get_user_model
from rest_framework.generics import ListAPIView
from ..models import Store, Product, Profile, Stock
from django.db.models import Q

User = get_user_model()

from ..serializers import StoreSerializer, StockSerializer ,ProductSerializer, ProfileSerializer, SearchStockSerializer


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