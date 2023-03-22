from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()

class ProductCategory(models.Model):
    name = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return self.name


class ProductSubcategory(models.Model):
    name = models.CharField(max_length=200, null=True, blank=True)
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
    user = models.ForeignKey(to=User, related_name='profile', on_delete=models.CASCADE, blank=True, null=True)
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
        return f'{self.name} in {self.city}, {self.country}'


class Product(models.Model):
    brand = models.CharField(max_length=200, null=True, blank=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    image = models.ImageField(null=True, blank=True, upload_to='product', default='/no-image.jpeg')
    rating = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    numReviews = models.IntegerField(null=True, blank=True, default=0)
    countInStock = models.IntegerField(null=True, blank=True, default=0)
    createdAt = models.DateTimeField(auto_now_add=True)

    # Relations:
    seller = models.ForeignKey(to=User, related_name='product', on_delete=models.SET_NULL, null=True)
    category = models.ForeignKey(to=ProductCategory, related_name='products', on_delete=models.CASCADE, blank=True, null=True)
    subcategory = models.ForeignKey(to=ProductSubcategory, related_name='products', on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.name


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
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    paymentMethod = models.CharField(max_length=200, null=True, blank=True)
    taxPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    shippingPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    totalPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    isPaid = models.BooleanField(default=False)
    paidAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    isDelivered = models.BooleanField(default=False)
    deliveredAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.createdAt)


class OrderItem(models.Model):
    name = models.CharField(max_length=200, null=True, blank=True)
    quantity = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    image = models.CharField(max_length=200, null=True, blank=True)

    # Relations:
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return str(self.name)


class ShippingAddress(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, null=True, blank=True)
    address = models.CharField(max_length=200, null=True, blank=True)
    city = models.CharField(max_length=200, null=True, blank=True)
    postalCode = models.CharField(max_length=200, null=True, blank=True)
    country = models.CharField(max_length=200, null=True, blank=True)
    shippingPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return str(self.address)















