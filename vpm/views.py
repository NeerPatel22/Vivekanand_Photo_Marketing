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


def index(request):
    return render(request, 'index.html')


def product(request):
    categories = Category.objects.all()
    return render(request, 'product.html',{'categories':categories})


def add_product(request):
    if request.method == 'POST':
        p_name = request.POST['p_name']
        p_desc = request.POST['p_desc']
        p_category_id = request.POST['p_category']
        p_subcategory_id = request.POST['p_subcategory']
        p_image = request.FILES['p_image']
        p_price = request.POST['p_price']

        p_category = Category.objects.get(id=p_category_id)
        p_subcategory = SubCategory.objects.get(id=p_subcategory_id)

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
            'category': p.CategoryName.CategoryName if p.CategoryName else '',
            'category_id': p.CategoryName.id if p.CategoryName else '',
            'subcategory': p.SubCategoryName.SubCategoryName if p.SubCategoryName else '',
            'subcategory_id': p.SubCategoryName.id if p.SubCategoryName else '',
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

        p_cat = request.POST['p_category']
        p_subcat = request.POST['p_subcategory']
        p_category = Category.objects.get(id=p_cat)
        p_subcategory = SubCategory.objects.get(id=p_subcat)

        product.ProductName = request.POST['p_name']
        product.CategoryName = p_category
        product.SubCategoryName = p_subcategory
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


def delete_product(request):
    id = request.GET.get('id')
    del_product = Product.objects.get(id=id)
    del_product.delete()
    messages.success(request, 'Product deleted successfully')
    return redirect('product')

def category(request):
    return render(request, 'category.html')


def category_render(request):
    categories = Category.objects.all()
    data = []
    for c in categories:
        data.append({
            'name': c.CategoryName,
            'id' : c.id,
            'subs': [{'id': s.id, 'name': s.SubCategoryName} for s in c.subs.all()]
        })
    return JsonResponse(data, safe=False)


def add_category(request):
    if request.method == 'POST':
        c_name = request.POST['c_name']

        add_category = Category(CategoryName=c_name)
        add_category.save()
        messages.success(request, 'Category added successfully')
    return redirect('category')


def add_subcategory(request):
    if request.method == 'POST':
        cat_id = request.POST['parent_id']
        subcat_name = request.POST['subcategory_name']

        cat_name = Category.objects.get(id=cat_id)

        sub = SubCategory(CategoryName=cat_name, SubCategoryName=subcat_name)
        sub.save()
        messages.success(request, 'SubCategory added successfully')
    return redirect('category')


def delete_category(request):
    id = request.GET.get('id')
    del_category = Category.objects.get(id=id)
    del_category.delete()
    messages.success(request, 'Category deleted successfully')
    return redirect('category')


def delete_subcategory(request):
    id = request.GET.get('id')
    del_subcategory = SubCategory.objects.get(id=id)
    del_subcategory.delete()
    messages.success(request, 'SubCategory deleted successfully')
    return redirect('category')