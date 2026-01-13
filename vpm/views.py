from os import P_NOWAIT
from django.shortcuts import render
import requests
from django.shortcuts import render, redirect
import hashlib
from .models import *
from django.http import JsonResponse
from django.contrib import messages
from django.conf import settings
from django.core.mail import send_mail
import math
import random
# Create your views here.

def product(request):
    category =Category.objects.all()
    return render(request, 'product.html', {'category':category})


def load_subcategory(request):
    category = request.GET.get('category')
    subcategory = SubCategory.objects.all().filter(CategoryName = category).values('SubCategoryName', 'CategoryName')
    return JsonResponse(list(subcategory), safe=False)

def add_product(request):
    if request.method == 'POST':
        p_name = request.POST['p_name']
        p_desc = request.POST['p_desc']
        p_category = request.POST['p_category']
        p_subcategory = request.POST['p_subcategory']
        p_image = request.FILES['p_image']
        p_price = request.POST['p_price']

        add_product = Product(ProductName=p_name,
                              CategoryName=p_category,
                              SubCategoryName=p_subcategory,
                              ProductDescription=p_desc,
                              ProductPrice=p_price,
                              ProductImage=p_image)
        add_product.save()
        messages.success(request, 'Product added successfully')
        return redirect('product')
    else:
        return redirect('product')


def product_render(request):
    products = Product.objects.all()
    data = []
    for p in products:
        data.append({
            'name': p.ProductName,
            'category': p.CategoryName,
            'subcategory': p.SubCategoryName,
            'desc': p.ProductDescription,
            'price': p.ProductPrice,
            'id': p.id,
            'image': p.ProductImage.url,
        })
    # print(data)
    return JsonResponse(data, safe=False)


def update_product(request):
    if request.method == 'POST':
        product = Product.objects.get(id=request.POST['p_id'])
        product.ProductName = request.POST['p_name']
        product.CategoryName = request.POST['p_category']
        product.SubCategoryName = request.POST['p_subcategory']
        product.ProductDescription = request.POST['p_desc']
        product.ProductPrice = request.POST['p_price']
        image = request.FILES.get('p_image')

        if image:
            product.ProductImage = image
        product.save()
        messages.success(request, 'Product updated successfully')
        return redirect('product')
    else:
        return redirect('product')