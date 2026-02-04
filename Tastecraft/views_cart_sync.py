from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from Tastecraft.models import MenuItem, Order, User

def sync_cart(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            cart = data.get('cart', [])
            request.session['cart'] = cart
            request.session.modified = True
            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Invalid method'}, status=405)

@csrf_exempt
def paystack_save_order(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        reference = data.get('reference')
        customer_id = data.get('customer_id')
        cart = data.get('items', [])  # Get cart from POST body, not session
        cart_total = 0
        try:
            user = User.objects.get(id=customer_id)
        except User.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'User not found'}, status=404)
        order = Order.objects.create(
            customer=user,
            total=0,
            status='Pending',
            reference=reference
        )
        order_items_details = []
        for item_data in cart:
            try:
                menu_item = MenuItem.objects.get(id=item_data['id'])
                order.items.add(menu_item)
                quantity = item_data.get('quantity', 1)
                cart_total += menu_item.price * quantity
                order_items_details.append({
                    'name': menu_item.name,
                    'price': menu_item.price,
                    'quantity': quantity
                })
            except MenuItem.DoesNotExist:
                continue
        order.total = cart_total
        order.save()

        # --- EMAIL MESSAGE (HTML) ---
        from django.core.mail import EmailMultiAlternatives
        from django.conf import settings
        from django.templatetags.static import static

        def build_order_html(order, items):
            # logo_url = getattr(settings, 'APP_LOGO_URL', 'https://mydomain.com/static/logo.png')
            logo_url = static('images/Tastecraft.jpg')
            table_rows = ""
            for item in items:
                subtotal = float(item['price']) * int(item['quantity'])
                table_rows += f"""
                    <tr>
                        <td style=\"padding:8px;border:1px solid #ddd;\">{item['name']}</td>
                        <td style=\"padding:8px;border:1px solid #ddd;text-align:center;\">{item['quantity']}</td>
                        <td style=\"padding:8px;border:1px solid #ddd;\">₦{float(item['price']):,.2f}</td>
                        <td style=\"padding:8px;border:1px solid #ddd;\">₦{subtotal:,.2f}</td>
                    </tr>
                """
            html = f"""
            <div style=\"font-family:sans-serif;max-width:600px;margin:auto;\">
                <div style=\"text-align:center;margin-bottom:20px;\">
                    <img src=\"{logo_url}\" alt=\"Tastecraft Logo\" style=\"max-width:180px;height:auto;\">
                </div>
                <h2 style=\"color:#333;\">Order Confirmation</h2>
                <p>Thank you for your order, <b>{order.customer.username}</b>!</p>
                <p><b>Order ID:</b> {order.id}</p>
                <p><b>Email:</b> {order.customer.email}</p>
                <table style=\"width:100%;border-collapse:collapse;margin-top:20px;\">
                    <thead>
                        <tr>
                            <th style=\"padding:8px;border:1px solid #ddd;background:#f8f8f8;\">Item</th>
                            <th style=\"padding:8px;border:1px solid #ddd;background:#f8f8f8;\">Qty</th>
                            <th style=\"padding:8px;border:1px solid #ddd;background:#f8f8f8;\">Unit Price</th>
                            <th style=\"padding:8px;border:1px solid #ddd;background:#f8f8f8;\">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {table_rows}
                    </tbody>
                </table>
                <h3 style=\"text-align:right;margin-top:20px;\">Total: ₦{float(order.total):,.2f}</h3>
                <p style=\"margin-top:30px;\">We appreciate your business!</p>
            </div>
            """
            return html

        subject = f"Tastecraft Order Confirmation - Order #{order.id}"
        html_message = build_order_html(order, order_items_details)
        user_email = order.customer.email
        admin_email = getattr(settings, 'ADMIN_EMAIL', None)

        # Send to user
        email = EmailMultiAlternatives(
            subject,
            "Thank you for your order.",  # Fallback plain text
            settings.DEFAULT_FROM_EMAIL,
            [user_email]
        )
        email.attach_alternative(html_message, "text/html")
        email.send(fail_silently=True)

        # Send to admin
        if admin_email:
            admin_subject = f"New Order Placed - Order #{order.id}"
            admin_email_msg = EmailMultiAlternatives(
                admin_subject,
                "A new order has been placed.",
                settings.DEFAULT_FROM_EMAIL,
                [admin_email]
            )
            admin_email_msg.attach_alternative(html_message, "text/html")
            admin_email_msg.send(fail_silently=True)

        return JsonResponse({'status': 'success', 'order_id': order.id})
    return JsonResponse({'status': 'error', 'message': 'Invalid method'}, status=405)


