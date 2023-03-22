from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from django.contrib.auth.models import User
from .models import Store, Profile, Product, ProductCategory, ProductSubcategory, Stock, Review, Order, OrderItem, ShippingAddress
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password

class ProductSubcategorySerializer(ModelSerializer):

    class Meta:
        model = ProductSubcategory
        fields = '__all__' 


class StockSerializer(ModelSerializer):
    product_details = serializers.SerializerMethodField(read_only=True)
    store_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Stock
        fields = '__all__' 

    def get_product_details(self, obj):
        return {
            'id': obj.product.id,
            'name': obj.product.name,
            'price': obj.product.price,
            'category': obj.product.category.name,
            'brand': obj.product.brand
        }

    def get_store_name(self, obj):
        name = obj.store.name
        return name


class ProductCategorySerializer(ModelSerializer):
    subcategories = ProductSubcategorySerializer(many=True)

    class Meta:
        model = ProductCategory
        fields = '__all__'


class ProfileSerializer(ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Profile
        fields = '__all__'

    def get_name(self, obj):
        name = obj.user.username

        return name


class StoreSerializer(ModelSerializer):
    category = serializers.SlugRelatedField(
        queryset=ProductCategory.objects.all(),
        many=True,
        slug_field='name'
    )
    stocks = StockSerializer(many=True, read_only = True)

    owner_name = serializers.ReadOnlyField(
        source='owner.username'
    )

    class Meta:
        model = Store
        fields = '__all__'


class ProductSerializer(ModelSerializer):
    category = serializers.SlugRelatedField(
        queryset=ProductCategory.objects.all(),
        slug_field='name',
    )
    subcategory = serializers.SlugRelatedField(
        queryset=ProductSubcategory.objects.all(),
        slug_field='name',
    )
    seller = serializers.SlugRelatedField(
        queryset=User.objects.all(),
        slug_field='username',
    )
    stocks = StockSerializer(many=True, read_only = True)

    class Meta:
        model = Product
        fields = '__all__'
  

class SearchStockSerializer(ModelSerializer):
    product = ProductSerializer(many=False)

    class Meta:
        model = Stock
        fields = '__all__' 


class ReviewSerializer(serializers.ModelSerializer):
    product = ProductSerializer(many=False)

    class Meta:
        model = Review
        fields = '__all__'


class UserSerializer(ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    profile = ProfileSerializer(many=True)
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


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    orderItems = serializers.SerializerMethodField(read_only=True)
    shippingAddress = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

    def get_orderItems(self, obj):
        items = obj.orderitem_set.all()
        serializer = OrderItemSerializer(items, many=True)
        return serializer.data

    def get_shippingAddress(self, obj):
        try:
            address = ShippingAddressSerializer(
                obj.shippingaddress, many=False).data
        except:
            address = False
        return address

    def get_user(self, obj):
        user = obj.user
        serializer = UserSerializer(user, many=False)
        return serializer.data