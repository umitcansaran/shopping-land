from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class ProductCategory(models.Model):
    name = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return self.name


class ProductSubcategory(models.Model):
    name = models.CharField(max_length=200, null=True, blank=True)

    # Relations:
    category = models.ForeignKey(to=ProductCategory, related_name='subcategories', on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.name


class Profile(models.Model):

    STATUS_CHOICES = (("CUSTOMER", "Customer"), ("STORE_OWNER", "Store_Owner"),)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="CUSTOMER")
    industry = models.CharField(max_length=200, null=True, blank=True)
    founded = models.CharField(max_length=200, null=True, blank=True)
    headquarter = models.CharField(max_length=200, null=True, blank=True)
    website = models.CharField(max_length=200, blank=True, null=True)
    image = models.ImageField(null=True, blank=True, upload_to='profile', default='/no-image.jpeg' )
    description = models.TextField(verbose_name='profile description', blank=True, null=True)

    # Relations:
    user = models.OneToOneField(to=User, related_name='profile', on_delete=models.CASCADE, blank=True, null=True)
    category = models.ManyToManyField( to=ProductCategory, related_name='profile', blank=True)

    def __str__(self):
        return f'{self.user} = {self.status}'


class Store(models.Model):

    name = models.CharField(max_length=50, null=True)
    address = models.CharField(max_length=200, null=True)
    country = models.CharField(max_length=200, null=True)
    city = models.CharField(max_length=200, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    description = models.TextField(verbose_name='store description', blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    image = models.ImageField(null=True, blank=True, upload_to='store', default='/no-image.jpeg' )

     # Relations:
    owner = models.ForeignKey(to=User, related_name='store', on_delete=models.CASCADE, null=True)
    category = models.ManyToManyField( to=ProductCategory, related_name='stores', blank=True)

    def __str__(self):
        return f'{self.owner} - {self.city}'


class Product(models.Model):
    brand = models.CharField(max_length=200, null=True, blank=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    image = models.ImageField(null=True, blank=True, upload_to='product', default='/no-image.jpeg')
    rating = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    numReviews = models.IntegerField(null=True, blank=True, default=0)
    createdAt = models.DateTimeField(auto_now_add=True)

    # Relations:
    seller = models.ForeignKey(to=User, related_name='product', on_delete=models.SET_NULL, null=True)
    category = models.ForeignKey(to=ProductCategory, related_name='products', on_delete=models.CASCADE, blank=True, null=True)
    subcategory = models.ForeignKey(to=ProductSubcategory, related_name='products', on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return f'{self.brand} - {self.name}'


class Stock(models.Model):
    number = models.IntegerField(null=True, blank=True, default=0)

    # Relations:
    product = models.ForeignKey(Product, related_name='stocks', on_delete=models.CASCADE)
    store = models.ForeignKey(Store, related_name='stocks', on_delete=models.CASCADE)

    def __int__(self):
        return f'{self.product} stock__in__{self.store}'


class Review(models.Model):
    name = models.CharField(max_length=200, null=True, blank=True)
    rating = models.IntegerField(null=True, blank=True, default=0)
    comment = models.TextField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)

    # Relations:
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
    
    def __str__(self):
        return str(self.rating)


class Order(models.Model):
    createdAt = models.DateTimeField(auto_now_add=True)
    paymentMethod = models.CharField(max_length=200, null=True, blank=True)
    totalShippingPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    totalPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    isPaid = models.BooleanField(default=False)
    paidAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)

    # Relations:
    customer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f'ID: {self.id}'
    

class SellerOrder(models.Model):
    createdAt = models.DateTimeField(auto_now_add=True)
    shippingPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    isShipped = models.BooleanField(default=False)
    shippedAt = models.DateTimeField(auto_now_add=False, null=True, blank=True) 
    isCompleted = models.BooleanField(default=False)
    completedAt = models.DateTimeField(auto_now_add=False, null=True, blank=True) 
    totalPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    
    # Relations:
    seller = models.ForeignKey(User, related_name='sellerOrders', on_delete=models.SET_NULL, null=True)
    order = models.ForeignKey(Order, related_name='sellerOrders', on_delete=models.CASCADE, null=True)
    customer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f'ID: {self.id}'


class OnlineOrderItem(models.Model):
    name = models.CharField(max_length=200, null=True, blank=True)
    quantity = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    image = models.CharField(max_length=200, null=True, blank=True)
    orderType = models.CharField(max_length=200, null=True, blank=True)

    # Relations:
    sellerOrder = models.ForeignKey(SellerOrder, related_name='onlineOrderItems', on_delete=models.CASCADE, null=True)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return str(self.name)


class InStoreOrderItem(models.Model):
    name = models.CharField(max_length=200, null=True, blank=True)
    quantity = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    image = models.CharField(max_length=200, null=True, blank=True)
    orderType = models.CharField(max_length=200, null=True, blank=True)
    isRetrieved = models.BooleanField(default=False)
    retrievedAt = models.DateTimeField(auto_now_add=False, null=True, blank=True) 

    # Relations:
    sellerOrder = models.ForeignKey(SellerOrder, related_name='inStoreOrderItems', on_delete=models.CASCADE, null=True)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    store = models.ForeignKey(Store, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return str(self.name)


class ShippingAddress(models.Model):
    address = models.CharField(max_length=200, null=True, blank=True)
    city = models.CharField(max_length=200, null=True, blank=True)
    postalCode = models.CharField(max_length=200, null=True, blank=True)
    country = models.CharField(max_length=200, null=True, blank=True)

    # Relations:
    order = models.OneToOneField(Order, related_name='shippingAddress', on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return str(self.address)















