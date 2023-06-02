from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from django.contrib.auth.models import User
from .models import Store, Profile, Product, ProductCategory, ProductSubcategory, Stock, Review, Order, SellerOrder, OnlineOrderItem, InStoreOrderItem, ShippingAddress
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password


class StockSerializer(ModelSerializer):
    product = serializers.SerializerMethodField(read_only=True)
    storeName = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Stock
        fields = '__all__' 

    def get_product(self, obj):
        return {
            'id': obj.product.id,
            'name': obj.product.name,
            'price': obj.product.price,
            'category': obj.product.category.name,
            'brand': obj.product.brand
        }

    def get_storeName(self, obj):
        name = obj.store.name
        return name
    
class ProductSubcategorySerializer(ModelSerializer):

    class Meta:
        model = ProductSubcategory
        fields = '__all__' 


class ProductCategorySerializer(ModelSerializer):
    subcategory = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ProductCategory
        fields = '__all__' 

    def get_subcategory(self, obj):
        subcategories = obj.subcategories
        serializer = ProductSubcategorySerializer(subcategories, many=True)

        return serializer.data


class ProfileSerializer(ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Profile
        fields = '__all__'

    def get_name(self, obj):
        name = obj.user.username

        return name


class StoreSerializer(ModelSerializer):
    # owner_profile = serializers.SerializerMethodField(read_only=True)
    category = serializers.SlugRelatedField(
        queryset=ProductCategory.objects.all(),
        many=True,
        slug_field='name'
    )
    # stocks = StockSerializer(many=True, read_only = True)
    owner_name = serializers.ReadOnlyField(
        source='owner.username'
    )

    class Meta:
        model = Store
        fields = '__all__'

    # def get_owner_profile(self, obj):
    #     profile = obj.owner.profile
    #     serializer = ProfileSerializer(profile, many=True)

    #     return serializer.data

class MyStoreSerializer(ModelSerializer):
    # owner_profile = serializers.SerializerMethodField(read_only=True)
    category = serializers.SlugRelatedField(
        queryset=ProductCategory.objects.all(),
        many=True,
        slug_field='name'
    )
    stocks = StockSerializer(many=True, read_only = True)
    # owner_name = serializers.ReadOnlyField(
    #     source='owner.username'
    # )

    class Meta:
        model = Store
        fields = '__all__'

    # def get_owner_profile(self, obj):
    #     profile = obj.owner.profile
    #     serializer = ProfileSerializer(profile, many=True)

    #     return serializer.data


class ProductSerializer(ModelSerializer):
    sellerDetails = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = '__all__' 

    def get_sellerDetails(self, obj):
        return {
            'id': obj.seller.id,
            'name': obj.seller.username
            }
    
class MyProductSerializer(ModelSerializer):
    sellerDetails = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = '__all__' 

    def get_sellerDetails(self, obj):
        return {
            'id': obj.seller.id,
            'name': obj.seller.username
            }

class SearchStockSerializer(ModelSerializer):
    product = ProductSerializer(many=False)

    class Meta:
        model = Stock
        fields = '__all__' 


class ReviewSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Review
        fields = '__all__' 

    def get_product(self, obj):
        product = obj.product
        serializer = ProductSerializer(product, many=False)

        return serializer.data


class UserSerializer(ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    profile = ProfileSerializer(many=False)
    product = ProductSerializer(many=True)
    store = StoreSerializer(many=True)

    class Meta:
        model = User
        fields = '__all__'

    def get_name(self, obj):
        name = obj.first_name
        if name == '':
            name = obj.email

        return name


class RegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
            required=True,
            validators=[UniqueValidator(queryset=User.objects.all())]
            )

    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = '__all__'


    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
        )
        
        user.set_password(validated_data['password'])
        user.save()

        return user


class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    sellerOrder = serializers.SerializerMethodField(read_only=True)
    shippingAddress = serializers.SerializerMethodField(read_only=True)
    # customer = serializers.SlugRelatedField(
    #     queryset=User.objects.all(), 
    #     many=False,
    #     slug_field='username' 
    # ) 

    # shippingAddress = serializers.SerializerMethodField(read_only=True)
    # user = serializers.SerializerMethodField(read_only=True)
    customer = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

    def get_sellerOrder(self, obj):
        sellerOrders = obj.sellerOrders
        serializer = SellerOrderSerializer(sellerOrders, many=True)
        return serializer.data 
    
    def get_shippingAddress(self, obj):
        shippingAddress = obj.shippingAddress
        serializer = ShippingAddressSerializer(shippingAddress, many=False)
        return serializer.data 

    def get_customer(self, obj):
        return {
            'id': obj.customer.id,
            'name': obj.customer.username,
            'email': obj.customer.email
            }
    
class MyOrderSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = Order
        fields = '__all__'

    # def get_shippingAddress(self, obj):
    #     try:
    #         address = ShippingAddressSerializer(
    #             obj.shippingaddress, many=False).data
    #     except:
    #         address = False
    #     return address

    # def get_user(self, obj):
    #     user = obj.user
    #     serializer = UserSerializer(user, many=False)
    #     return serializer.data

class OnlineOrderItemSerializer(serializers.ModelSerializer):
    details = serializers.SerializerMethodField(read_only=True) 

    class Meta:
        model = OnlineOrderItem
        fields = '__all__'

    def get_details(self, obj):
        product = obj.product
        serializer = ProductSerializer(product, many=False)
        return serializer.data
    
class InStoreOrderItemSerializer(serializers.ModelSerializer):
    details = serializers.SerializerMethodField(read_only=True) 
    store = serializers.SerializerMethodField(read_only=True) 

    class Meta:
        model = InStoreOrderItem
        fields = '__all__'

    def get_details(self, obj):
        product = obj.product
        serializer = ProductSerializer(product, many=False)
        return serializer.data
    
    def get_store(self, obj):
        store = obj.store
        serializer = StoreSerializer(store, many=False)
        return serializer.data
    
    
class SellerOrderSerializer(serializers.ModelSerializer):
    seller = serializers.SerializerMethodField(read_only=True)
    customer = serializers.SerializerMethodField(read_only=True)
    order = serializers.SerializerMethodField(read_only=True)
    onlineOrderItems = serializers.SerializerMethodField(read_only=True) 
    inStoreOrderItems = serializers.SerializerMethodField(read_only=True) 
    shippingAddress = serializers.SerializerMethodField(read_only=True) 

    class Meta:
        model = SellerOrder
        fields = '__all__'

    def get_seller(self, obj):
        seller = obj.seller
        serializer = UserSerializer(seller, many=False)
        return serializer.data
    
    def get_customer(self, obj):
        customer = obj.customer
        serializer = UserSerializer(customer, many=False)
        return serializer.data
    
    def get_order(self, obj):
        return {
            'id': obj.order.id,
            'isPaid': obj.order.isPaid,
            'paidAt': obj.order.paidAt
        }
    
    def get_onlineOrderItems(self, obj):
        onlineOrderItems = obj.onlineOrderItems
        serializer = OnlineOrderItemSerializer(onlineOrderItems, many=True)
        return serializer.data
    
    def get_inStoreOrderItems(self, obj):
        inStoreOrderItems = obj.inStoreOrderItems
        serializer = InStoreOrderItemSerializer(inStoreOrderItems, many=True)
        return serializer.data
    
    def get_shippingAddress(self, obj):
        shippingAddress = obj.order.shippingAddress
        serializer = ShippingAddressSerializer(shippingAddress, many=False)
        return serializer.data
    
class MySellerOrdersSerializer(serializers.ModelSerializer):
    order = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = SellerOrder
        fields = '__all__'

    def get_order(self, obj):
        return {
            'isPaid': obj.order.isPaid,
            'paidAt': obj.order.paidAt
        }
    
    