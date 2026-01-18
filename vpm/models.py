from tkinter import image_names

from django.db import models
import os
from uuid import uuid4
from django.utils.text import slugify
from PIL import Image
from io import BytesIO
from django.core.files import File
import datetime
from django.db.models.signals import pre_save, post_delete
from django.dispatch import receiver

def rename_image(instance, filename):
    ext = filename.split('.')[-1]
    if instance.ProductImage:
        name = slugify(instance.ProductName)
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
    CategoryName = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subs')
    SubCategoryName = models.CharField(max_length=100)

class Product(models.Model):
    ProductName = models.CharField(max_length=100)
    CategoryName = models.ForeignKey(Category, on_delete=models.CASCADE,null=True, related_name='products')
    SubCategoryName = models.ForeignKey(SubCategory, on_delete=models.CASCADE,null=True, related_name='products')
    ProductDescription = models.TextField()
    ProductPrice = models.CharField(max_length=50)
    ProductImage = models.ImageField(upload_to=rename_image, null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.ProductImage:
            img = Image.open(self.ProductImage)

            if img.mode != 'RGB':
                img = img.convert('RGB')

            if img.height > 800 or img.width > 800:
                output_size = (800, 800)
                img.thumbnail(output_size)

            output = BytesIO()
            img.save(output, format='JPEG', quality=70)
            output.seek(0)

            name = rename_image(self, self.ProductImage.name)

            self.ProductImage.save(name, File(output), save=False)

        super().save(*args, **kwargs)