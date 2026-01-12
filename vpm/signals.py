import os
from django.db.models.signals import pre_save, post_delete
from django.dispatch import receiver
from .models import Product



# 1. Automatically delete file from system when object is deleted
@receiver(post_delete, sender=Product)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    if instance.ProductImage:
        if os.path.isfile(instance.ProductImage.path):
            os.remove(instance.ProductImage.path)

# 2. Automatically delete old file from system when image is updated
@receiver(pre_save, sender=Product)
def auto_delete_file_on_change(sender, instance, **kwargs):
    if not instance.pk:
        return False

    try:
        old_file = Product.objects.get(pk=instance.pk).ProductImage
    except Product.DoesNotExist:
        return False

    new_file = instance.ProductImage
    if not old_file == new_file:
        if os.path.isfile(old_file.path):
            os.remove(old_file.path)

