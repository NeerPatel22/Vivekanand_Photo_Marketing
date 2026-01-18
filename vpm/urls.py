from django.urls import path
from . import views

urlpatterns = [
    path('', views.product, name='product'),
    path('add_product', views.add_product, name='add_product'),
    path('product_render', views.product_render, name='product_render'),
    path('update_product', views.update_product, name='update_product'),
    path('delete_product', views.delete_product, name='delete_product'),
    path('category', views.category, name='category'),
    path('category_render', views.category_render, name='category_render'),
    path('add_category', views.add_category, name='add_category'),
    path('add_subcategory', views.add_subcategory, name='add_subcategory'),
    path('delete_subcategory', views.delete_subcategory, name='delete_subcategory'),
    path('delete_category', views.delete_category, name='delete_category'),
]