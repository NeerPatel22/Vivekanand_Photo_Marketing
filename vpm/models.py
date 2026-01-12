from tkinter import image_names

from django.db import models
import os
from uuid import uuid4
from django.utils.text import slugify
import datetime
from django.db.models.signals import pre_save, post_delete
from django.dispatch import receiver

def rename_image(instance, filename):
    ext = filename.split('.')[-1]
    if instance.ProductImage:
        name= slugify(instance.ProductName)
    else:
        name = uuid4().hex[:10]
    image_name = f'{name}.{ext}'
    return os.path.join('', image_name)


class Login(models.Model):
    username = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=100)

class Category(models.Model):
    CategoryName = models.CharField(max_length=100)

class SubCategory(models.Model):
    CategoryName = models.CharField(max_length=100)
    SubCategoryName = models.CharField(max_length=100)

class Product(models.Model):
    ProductName = models.CharField(max_length=100)
    CategoryName = models.CharField(max_length=100)
    SubCategoryName = models.CharField(max_length=100)
    ProductDescription = models.TextField()
    ProductPrice = models.CharField(max_length=50)
    ProductImage = models.ImageField(upload_to=rename_image, null=True, blank=True)
