from django.contrib import admin
from .models import Category, Order, MenuItem, User_info

admin.site.register(Category)
admin.site.register(Order)
admin.site.register(MenuItem)
admin.site.register(User_info)
