from django.urls import path
from . import views

urlpatterns = [
    path('', views.product, name='product'),
    path('load_subcategory', views.load_subcategory, name='load_subcategory'),
    path('add_product', views.add_product, name='add_product'),
    path('product_render', views.product_render, name='product_render'),
    path('update_product', views.update_product, name='update_product'),
]