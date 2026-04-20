"""
URL configuration for TastecraftMe project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from Tastecraft import views
from Tastecraft.views_cart_sync import paystack_save_order


# for images upload (continuation from settings.url)
from django.conf import settings
from django.conf.urls.static import static



urlpatterns = [
    # urls for the general people...
    path('', views.gen_home, name='gen_home'), # the landing page
    path('gen_menu', views.gen_menu, name='gen_menu'),
    path('gen_about', views.gen_about, name='gen_about'),
    path('gen_contact', views.gen_contact, name='gen_contact'),
    path('sync_cart/', views.sync_cart, name='sync_cart'),
    path('gen_cart/', views.gen_cart, name='gen_cart'),

    # the urls for the users
    path('login/', views.login_page, name='login'),
    path('log_out/', views.log_out, name='logout'),
    path('sign_up/', views.signup_page, name='signup'),
    path('home', views.home_page, name='home'),
    path('menu', views.menu_page, name='menu'),
    path('about', views.about_page, name='about'),
    path('contact', views.contact_page, name='contact'),
    path('profile/<int:id>/', views.profile_page, name='profile'),
    path('cart_page', views.cart_page, name='cart_page'),


# admin_url_section
    path('sign_admin/', views.admin_signup_page, name='sign_admin'),
    path('admin_dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('admin_logout/', views.admin_logout, name='admin_logout'),
    
    # path('admin/', admin.site.urls),   .. the default admin url for django

    path('paystack_save_order/', paystack_save_order, name='paystack_save_order'),
    path('orders/<int:order_id>/approve/', views.approve_order, name='approve_order'),
    path('update_order_status_ajax/', views.update_order_status_ajax, name='update_order_status_ajax'),
    path('orders_table_ajax/', views.orders_table_ajax, name='orders_table_ajax')

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) # still for the image
