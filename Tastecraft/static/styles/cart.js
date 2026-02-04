
            document.addEventListener('DOMContentLoaded', function() {
                var paystackForm = document.getElementById('paystack-form');
                var paymentBtn = document.getElementById('payment-btn');
                if (paystackForm) {
                    paystackForm.addEventListener('click', function(e) {
                        e.preventDefault();
                        paystackForm.disabled = true;
                        paystackForm.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Processing...';
                        const email = document.getElementById('user-email').value;
                        payWithPaystack(email, paystackForm);
                    });
                }
                if (paymentBtn) {
                    paymentBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        paymentBtn.disabled = true;
                        paymentBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Processing...';
                        const email = document.getElementById('user-email').value;
                        payWithPaystack(email, paymentBtn);
                    });
                }
            });
    
            document.addEventListener('DOMContentLoaded', function() {
                let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
                const cartContainer = document.querySelector('.cart-items');
                const emptyCartDiv = document.querySelector('.empty-cart');
                const checkoutBtn = document.querySelector('.checkout-btn');
                const cartSummary = document.querySelector('.cart-summary');
    
                function updateCartCount() {
                    // Update cart count in sidebar if present
                    const cartCountSidebar = document.getElementById('cart-count-sidebar');
                    if (cartCountSidebar) {
                        const totalCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
                        cartCountSidebar.textContent = totalCount;
                    }
                }
    
                function renderCart() {
                    // Clear previous items except template and empty cart
                    cartContainer.querySelectorAll('.cart-item').forEach(el => el.remove());
    
                    if (cartItems.length > 0) {
                        emptyCartDiv.style.display = 'none';
                        cartSummary.style.display = 'block';
    
                        cartItems.forEach((item, idx) => {
                            const cartItem = document.createElement('div');
                            cartItem.className = 'cart-item';
                            cartItem.innerHTML = `
                                <div class="cart-item-img">
                                    <img src="${item.image || '/static/images/Tastecraft.JPG'}" alt="${item.name}">
                                </div>
                                <div class="cart-item-details">
                                    <h4 class="cart-item-name">${item.name}</h4>
                                    <div class="cart-item-price">₦${item.price.toLocaleString()}</div>
                                    <div class="quantity-control">
                                        <button class="quantity-btn minus"><i class="fas fa-minus"></i></button>
                                        <span class="quantity">${item.quantity}</span>
                                        <button class="quantity-btn plus"><i class="fas fa-plus"></i></button>
                                    </div>
                                    <button class="remove-item"><i class="fas fa-trash-alt"></i> Remove</button>
                                </div>
                            `;
    
                            // Remove item
                            cartItem.querySelector('.remove-item').addEventListener('click', function() {
                                cartItems.splice(idx, 1);
                                localStorage.setItem('cart', JSON.stringify(cartItems));
                                renderCart();
                                updateCartCount();
                            });
    
    
                            // Quantity controls
                            cartItem.querySelector('.minus').addEventListener('click', function() {
                                if (item.quantity > 1) {
                                    item.quantity -= 1;
                                    localStorage.setItem('cart', JSON.stringify(cartItems));
                                    renderCart();
                                    updateCartCount();
                                } else {
                                    // Remove item if quantity reaches 0
                                    cartItems.splice(idx, 1);
                                    localStorage.setItem('cart', JSON.stringify(cartItems));
                                    renderCart();
                                    updateCartCount();
                                }
                            });
    
                            cartItem.querySelector('.plus').addEventListener('click', function() {
                                item.quantity += 1;
                                localStorage.setItem('cart', JSON.stringify(cartItems));
                                renderCart();
                                updateCartCount();
                            });
    
                            cartContainer.appendChild(cartItem);
                        });
    
                        updateSummary();
                        if (checkoutBtn) {
                            checkoutBtn.classList.add('visible');
                        }
                    } else {
                        cartSummary.style.display = 'none';
                        emptyCartDiv.style.display = 'block';
                        updateCartCount();
                    }
                }
    
                function updateSummary() {
                    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    const deliveryFee = 1000;
                    const total = subtotal + deliveryFee;
                    document.querySelectorAll('.summary-row')[0].lastElementChild.textContent = `₦${subtotal.toLocaleString()}`;
                    document.querySelector('.summary-total').lastElementChild.textContent = `₦${total.toLocaleString()}`;
                }
                
                renderCart();
            });

    
        
   {/* Paystack Inline Script */}
    <script src="https://js.paystack.co/v1/inline.js"></script>

            function syncCartToBackend(cart) {
        fetch('/sync_cart/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({cart: cart})
        });
    }
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    
            let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
            const cartContainer = document.querySelector('.cart-items');
            const emptyCartDiv = document.querySelector('.empty-cart');
            const checkoutBtn = document.querySelector('.checkout-btn');
            const cartSummary = document.querySelector('.cart-summary');
            // Paystack payment integration
            if (checkoutBtn) {
                checkoutBtn.addEventListener('click', function() {
                    const paystackForm = document.getElementById('paystack-form');
                    if (paystackForm) {
                        paystackForm.classList.add('show');
                    }
                    const customerEmailInput = document.getElementById('customer-email');
                    if (customerEmailInput) {
                        customerEmailInput.focus();
                    }
                });
            }
    
            const customerEmailInput = document.getElementById('customer-email');
            if (customerEmailInput) {
                customerEmailInput.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        payWithPaystack();
                    }
                });
                customerEmailInput.addEventListener('blur', function(e) {
                    if (e.target.value) payWithuPaystack();
                });
            }
    
            function payWithPaystack(email, btn) {
                // Syncing cart to database before payment
                let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
                syncCartToBackend(cartItems);
                if (!email) {
                    alert('Please enter your email to proceed with payment.');
                    if (btn) {
                        btn.disabled = false;
                        btn.innerHTML = btn.id === 'payment-btn' ? '<i class="fas fa-money-bill-wave"></i> Payment' : '<i class="fas fa-credit-card"></i> Proceed to Checkout';
                    }
                    return;
                }
                const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const deliveryFee = 1000;
                const total = subtotal + deliveryFee;
                const amount = total * 100; // Paystack expects kobo
                const paystackPublicKey = 'pk_test_d5daa3c74dbff17765c854451a7325908c239195'; // Test key
                let handler = PaystackPop.setup({
                    key: paystackPublicKey,
                    email: email,
                    amount: amount,
                    currency: 'NGN',
                    ref: 'TC-' + Math.floor((Math.random() * 1000000000) + 1),
                    callback: function(response) {
                        // Save order to backend with items and total
                        // for the admin email submittion
                        fetch('/paystack_save_order/', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRFToken': getCookie('csrftoken')
                            },
                            body: JSON.stringify({
                                reference: response.reference,
                                customer_id: CURRENT_USER_ID, // set this variable to the logged-in user's ID
                                items: cartItems,
                                total: total
                            })
                            // for the payment success and clearing the page when payment is initiated
                        }).then(res => res.json()).then(data => {
                            localStorage.removeItem('cart');
                            cartItems = [];
                            if (typeof renderCart === 'function') {
                                renderCart();
                            }
                            alert('Payment complete! Reference: ' + response.reference);
                            setTimeout(function() {
                                if (data.status === 'success') {
                                    window.location.reload();
                                }
                            }, 500);
                        });
                    },
                    onClose: function() {
                        alert('Payment window closed.');
                        if (btn) {
                            btn.disabled = false;
                            btn.innerHTML = btn.id === 'payment-btn' ? '<i class=\'fas fa-money-bill-wave\'></i> Payment' : '<i class=\'fas fa-credit-card\'></i> Proceed to Checkout';
                        }
                    }
                });
                handler.openIframe();
            }
            
            const CURRENT_USER_ID = "{{ request.user.id }}";
