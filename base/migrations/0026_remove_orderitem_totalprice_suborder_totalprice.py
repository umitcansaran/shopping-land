# Generated by Django 4.1.3 on 2023-05-24 21:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("base", "0025_rename_shippedat_suborder_shippedat_and_more"),
    ]

    operations = [
        migrations.RemoveField(model_name="orderitem", name="totalPrice",),
        migrations.AddField(
            model_name="suborder",
            name="totalPrice",
            field=models.DecimalField(
                blank=True, decimal_places=2, max_digits=7, null=True
            ),
        ),
    ]