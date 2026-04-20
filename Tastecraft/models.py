from django.db import models
from turtle import reset
from django.contrib.auth.models import User, auth

from django_resized import ResizedImageField

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class MenuItem(models.Model):
    name = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='menu_items')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='menu_images/', blank=True, null=True)
    description = models.TextField(blank=True)
    available = models.BooleanField(default=True)
    special = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Order(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]
    customer = models.ForeignKey(User, on_delete=models.CASCADE)
    items = models.ManyToManyField(MenuItem) 
    total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    date = models.DateTimeField(auto_now_add=True)
    reference = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"Order #{self.id} - {self.customer} - Orders {self.items} and total price is {self.total}"

# Create your models here.
class User_info(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    passport = ResizedImageField(size=[320,300], upload_to="passport/", null=True, blank=True) # this is for picture resizing when uploaded
    full_name = models.CharField(max_length=500, null=True, blank=True)
    username = models.CharField(max_length=500, null=True, blank=True)
    email = models.EmailField(max_length=500, null=True, blank=True)
    is_superuser = models.CharField(max_length=500, null=True, blank=500)
    phone = models.CharField(max_length=500, null=True, blank=True)
    address = models.CharField(max_length=500, null=True, blank=True)
    location = models.CharField(max_length=500, null=True, blank=True)
    password = models.CharField(max_length=500, null=True, blank=500)
    class Meta:
        managed = True
        db_table = 'user_info' # this is the table name in the database and also for the signup form
    
class Admin_info(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    passport = ResizedImageField(size=[320,300], upload_to="passport/", null=True, blank=True) # this is for picture resizing when uploaded
    full_name = models.CharField(max_length=500, null=True, blank=True)
    username = models.CharField(max_length=500, null=True, blank=True)
    email = models.EmailField(max_length=500, null=True, blank=True)
    is_superuser = models.CharField(max_length=500, null=True, blank=500)
    phone = models.CharField(max_length=500, null=True, blank=True)
    address = models.CharField(max_length=500, null=True, blank=True)
    location = models.CharField(max_length=500, null=True, blank=True)
    password = models.CharField(max_length=500, null=True, blank=500)
    class Meta:
        managed = True
        db_table = 'admin_info' # this is the table name in the database and also for the signup form
