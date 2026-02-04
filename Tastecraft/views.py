from django.shortcuts import render, redirect, get_object_or_404
from datetime import datetime
import pytz
total_time_package = datetime.now(pytz.timezone("Africa/Lagos")) 
from Tastecraft.models import * # the asteriks here implies all the tables in our models
from django.contrib import messages
from django.contrib.auth.hashers import make_password
from dateutil.parser import parse 
from django.contrib import auth
from django.db.models import Q
from django.contrib.auth.decorators import login_required
from django.db.models import Sum
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse
from django.template.loader import render_to_string
from .views_cart_sync import sync_cart, paystack_save_order

# from rest_framework.views import APIView
# from rest_framework.response import Response
# from .serializers import SignupSerializer


# Create your views here.

@login_required(login_url='login')
def orders_table_ajax(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        orders = Order.objects.all().order_by('-id')
        html = render_to_string('admin_dashboard_table.html', {'orders': orders}, request=request)
        return HttpResponse(html)
    return HttpResponse('', status=400)



# General Views Section
def gen_home(request):
    return render(request, 'gen_home.html')

def gen_menu(request):
    return render(request, 'gen_menu.html')

def gen_about(request):
    return render(request, 'gen_about.html')

def gen_contact(request):
    return render(request, 'gen_contact.html')

@login_required
def gen_cart(request):
    return render(request, 'gen_cart.html')

# End General Views Section


# User Views Section
def login_page(request):
    if request.method == 'POST':
        get_username = request.POST.get("username")
        get_password = request.POST.get("password")
        user = auth.authenticate(username=get_username, password=get_password)

        if user is None:
            messages.info(request, "Invalid Email Address or Password")
            return redirect ("/login")
        else:
            auth.login(request, user)
            get_username = request.user
            get_superuser = get_username.is_superuser
            # get_user_info_row = User_info.objects.get(username=get_username)
            # get_status = get_user_info_row.status

            # if get_status =="block":
            #     messages.info(request, "Your account has been blocked. Please......")
            #     return render(request, 'login.html')
            # else:
            if  get_superuser == 1:
                return redirect("/admin_dashboard")
            else:
                return redirect("/menu")
    else:
        return render(request, 'login.html')

@login_required(login_url='login') 
def log_out(request):
    auth.logout(request)
    return redirect('/login')

def signup_page(request):
    if request.method == "POST":
        # Get all data & Submit to database
        get_full_name = request.POST.get('fullname')
        get_username = request.POST.get('username')
        get_email = request.POST.get('email')
        get_password = request.POST.get('password')

        # To check for existing username and email
        if User.objects.filter(username=get_username).exists() or User.objects.filter(email=get_email).exists():
            # single equal to is used to compare in django db not double
            messages.info(request, "Email or Username already used by another customer!.")
            return redirect('/sign_up')
        else:
            # Free to submit to database
            # 1 Lets submit to auth_user which is the default django table for sign up 
            auth_user_submit = User.objects.create_user(password=get_password, is_superuser=0, username=get_username, first_name=get_full_name, email=get_email)
            auth_user_submit.save()

            # 2. Lets submit to sign up which is the table we created and houses all other sign up info
            user_info_submit = User_info.objects.create(email=get_email, full_name=get_full_name, username=get_username, user=auth_user_submit, is_superuser=0)
            user_info_submit.save()

            messages.info(request, f"{get_full_name}, thank you for registering with us. You will be redirected to login to our page!.")
            return redirect('/login')
    else:    
        return render(request, 'sign_up.html')
    
@login_required(login_url='login')
def home_page(request):
    return render(request, 'home_page.html')

@login_required(login_url='login')
def menu_page(request):
    # Show only available menu items to users
    menu_items = MenuItem.objects.filter(available=True)
    categories = Category.objects.all()
    return render(request, 'menu_page.html', {
        'menu_items': menu_items,
        'categories': categories,
    })

@login_required(login_url='login')
def about_page(request):
    return render(request, 'about_page.html')

@login_required(login_url='login')
def contact_page(request):
    return render(request, 'contact_page.html')

@login_required(login_url='login')
def profile_page(request, id):
    if request.method == "POST":
        get_full_name = request.POST.get('full_name')
        get_phone = request.POST.get('phone')
        get_email = request.POST.get('email')
        get_address = request.POST.get('address')
        get_location = request.POST.get('location')
        get_profile_image = request.FILES.get('profile_image')

        user_identity = User.objects.get(id=id)
        user_identity.first_name = get_full_name
        user_identity.email = get_email
        user_identity.save()

        user_info_identity = User_info.objects.get(user_id=id)
        user_info_identity.full_name = get_full_name
        user_info_identity.phone = get_phone
        user_info_identity.email = get_email
        user_info_identity.location = get_location
        user_info_identity.address = get_address
        if get_profile_image:
            user_info_identity.passport = get_profile_image
        user_info_identity.save()

        messages.info(request, "Your profile has been updated")
        return redirect(f'/profile/{id}')
    else:
        user_info_identity = User_info.objects.get(user_id=id)
        # Get all orders for this user
        user_orders = Order.objects.filter(customer_id=id).order_by('-id')
        return render(request, 'profile_page.html', {'user_info': user_info_identity, 'orders': user_orders})
    
@login_required(login_url='login')
def cart_page(request):
    return render(request, 'cart_page.html')
# End User Views Section


# Admin Views Section
@login_required(login_url='login')
def admin_dashboard(request):
    tab = request.GET.get('tab', 'dashboard')
    # Always fetch categories for all tabs
    categories = Category.objects.all()
    context = {'active_tab': tab, 'categories': categories}

    # Most popular order items (top 3 by order count)
    from django.db.models import Count
    popular_order_items = (
        MenuItem.objects.annotate(orders_count=Count('order'))
        .order_by('-orders_count')[:3]
    )
    context['popular_order_items'] = popular_order_items


    # Always include dashboard info
    context['total_revenue'] = Order.objects.aggregate(Sum('total'))['total__sum'] or 0 # total_revenue is {'total__sum': Decimal('93000.00')}
    context['menu_count'] = MenuItem.objects.count() if 'MenuItem' in globals() else 0
    context['order_count'] = Order.objects.count() if 'Order' in globals() else 0
    context['customer_count'] = User_info.objects.count() if 'User_info' in globals() else 0
    context['popular_menu'] = MenuItem.objects.all()[:3] if 'MenuItem' in globals() else []
    context['recent_orders'] = Order.objects.all().order_by('-id')[:4] if 'Order' in globals() else []
    context['pending_orders_count'] = Order.objects.filter(status='Pending').count()  # New line for pending orders count

    # Always include menu management info
    query = request.GET.get('search', '')
    category_id = request.GET.get('category', '')
    menu_items = MenuItem.objects.all() 
    if query:
        menu_items = menu_items.filter(Q(name__icontains=query) | Q(description__icontains=query))
    if category_id:
        menu_items = menu_items.filter(category_id=category_id)
    categories = Category.objects.all()
    context['categories'] = categories
    context['menu_items'] = menu_items

    # Handle add/edit/delete POST actions only if on menu tab
    if tab == 'menu' and request.method == 'POST':
        action = request.POST.get('action')
        if action == 'add':
            name = request.POST.get('name')
            category_id = request.POST.get('category')
            price = request.POST.get('price')
            image = request.FILES.get('image')
            description = request.POST.get('description')
            available = request.POST.get('available') == 'on'
            special = request.POST.get('special') == 'on'
            category_obj = None
            if category_id:
                try:
                    category_obj = Category.objects.get(id=category_id)
                except Category.DoesNotExist:
                    category_obj = None
            MenuItem.objects.create(
                name=name,
                category=category_obj,
                price=price,
                image=image,
                description=description,
                available=available,
                special=special
            )
            messages.success(request, 'Menu item added successfully!')
            return redirect(f'{request.path}?tab=menu')
        elif action == 'edit':
            pk = request.POST.get('id')
            menu_item = get_object_or_404(MenuItem, pk=pk)
            menu_item.name = request.POST.get('name')
            category_id = request.POST.get('category')
            if category_id:
                try:
                    menu_item.category = Category.objects.get(id=category_id)
                except Category.DoesNotExist:
                    menu_item.category = None
            menu_item.price = request.POST.get('price')
            if request.FILES.get('image'):
                menu_item.image = request.FILES.get('image')
            menu_item.description = request.POST.get('description')
            menu_item.available = request.POST.get('available') == 'on'
            menu_item.special = request.POST.get('special') == 'on'
            menu_item.save()
            messages.success(request, 'Menu item updated successfully!')
            return redirect(f'{request.path}?tab=menu')
        elif action == 'delete':
            pk = request.POST.get('id')
            menu_item = get_object_or_404(MenuItem, pk=pk)
            menu_item.delete()
            messages.success(request, 'Menu item deleted successfully!')
            return redirect(f'{request.path}?tab=menu')

    # Order Management Tab
    elif tab == 'orders':
        # Handle order approval POST
        if request.method == 'POST' and request.POST.get('action') == 'approve':
            order_id = request.POST.get('order_id')
            order = Order.objects.get(id=order_id)
            order.status = 'Approved'
            order.save()
            messages.success(request, f'Order #{order.id} approved!')
            return redirect(f'{request.path}?tab=orders')
        # Show all orders for admin, with search
        orders = Order.objects.all().order_by('-id') if 'Order' in globals() else []
        search_query = request.GET.get('search_customer', '').strip()
        item_search_query = request.GET.get('item_search', '').strip()
        if search_query:
            if search_query.isdigit():
                orders = orders.filter(id=search_query)
            else:
                orders = orders.filter(
                    Q(customer__username__icontains=search_query) |
                    Q(customer__first_name__icontains=search_query) |
                    Q(customer__email__icontains=search_query)
                )
        if item_search_query:
            orders = orders.filter(items__name__icontains=item_search_query).distinct()
        context['orders'] = orders

    # Users Tab
    elif tab == 'users':
        users = User_info.objects.all() if 'User_info' in globals() else []
        context['users'] = users

    return render(request, 'admin_dashboard.html', context)

def admin_signup_page(request):
    if request.method == "POST":
        get_full_name = request.POST.get('fullname')
        get_username = request.POST.get('username')
        get_email = request.POST.get('email')
        get_password = request.POST.get('password')

        # To check for existing username and email
        if User.objects.filter(username=get_username).exists() or User.objects.filter(email=get_email).exists():
            messages.info(request, "Email or Username already used or an admin by a customer!.")
            return redirect('sign_admin')
        else:
            auth_user_submit = User.objects.create_user(password=get_password, is_superuser=1, username=get_username, first_name=get_full_name, email=get_email)
            auth_user_submit.save()

            admin_info_submit = Admin_info.objects.create(email=get_email, full_name=get_full_name, username=get_username, user=auth_user_submit, is_superuser=1)
            admin_info_submit.save()

            messages.info(request, f"{get_full_name}, You have been registered as an admin for Tastcraft RETAURANT!.")
            return redirect('login')
    else:
        return render(request, 'sign_admin.html')


# End Admin Views Section


# In your Paystack payment callback view
def paystack_callback(request):
    # Example: Get payment reference from request (adjust as needed)
    payment_successful = False
    reference = request.GET.get('reference') or request.POST.get('reference')
    if reference:
        # TODO: Add actual Paystack API verification here
        # For now, simulate success for testing
        payment_successful = True

    if payment_successful:
        cart = request.session.get('cart', [])
        cart_total = 0
        order = Order.objects.create(
            customer=request.user,
            total=0,
            status='Pending'
        )
        for item_data in cart:
            try:
                menu_item = MenuItem.objects.get(id=item_data['id'])
                order.items.add(menu_item)
                cart_total += menu_item.price * item_data.get('quantity', 1)
            except MenuItem.DoesNotExist:
                continue
        order.total = cart_total
        order.save()

# order management view
def approve_order(request, order_id):
    order = Order.objects.get(id=order_id)
    order.status = 'Approved'
    order.save()

@csrf_exempt
@login_required(login_url='login')
def update_order_status_ajax(request):
    if request.method == 'POST' and request.headers.get('x-requested-with') == 'XMLHttpRequest':
        order_id = request.POST.get('order_id')
        status = request.POST.get('status')
        try:
            order = Order.objects.get(id=order_id)
            order.status = status
            order.save()
            return JsonResponse({'success': True})
        except Order.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Order not found'})
    return JsonResponse({'success': False, 'error': 'Invalid request'})



@login_required(login_url='login') 
def admin_logout(request):
    auth.logout(request)
    return redirect('/login')