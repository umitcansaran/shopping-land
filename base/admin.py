from django.contrib import admin
from .models import Store, Profile, Product, ProductCategory, ProductSubcategory, Stock, Review, Order, SubOrder, OrderItem, ShippingAddress

# Register your models here.

admin.site.register(ProductCategory)
admin.site.register(ProductSubcategory)
admin.site.register(Store)
admin.site.register(Profile)
admin.site.register(Product)
admin.site.register(Stock)
admin.site.register(Review)
admin.site.register(Order)
admin.site.register(SubOrder)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)








