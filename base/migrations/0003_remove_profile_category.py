# Generated by Django 4.1.3 on 2023-01-12 15:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("base", "0002_profile_category"),
    ]

    operations = [
        migrations.RemoveField(model_name="profile", name="category",),
    ]