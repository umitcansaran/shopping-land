# Generated by Django 4.1.3 on 2023-01-19 03:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("base", "0007_order_shippingaddress_orderitem"),
    ]

    operations = [
        migrations.AlterField(
            model_name="orderitem",
            name="image",
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="profile",
            name="category",
            field=models.ManyToManyField(
                blank=True, related_name="profile", to="base.productcategory"
            ),
        ),
    ]