    
    document.addEventListener('DOMContentLoaded', function () {
        // Modal population
        document.querySelectorAll('button[data-bs-target="#updateOrderStatusModal"]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                document.getElementById('updateOrderId').value = btn.getAttribute('data-id');
                document.getElementById('modalCustomer').textContent = btn.getAttribute('data-customer') || '-';
                document.getElementById('modalTotal').textContent = btn.getAttribute('data-total') || '-';
                document.getElementById('modalItems').textContent = btn.getAttribute('data-items') || '-';
              
                var status = btn.getAttribute('data-status');
                var select = document.getElementById('orderStatusSelect');
                if (select && status) select.value = status;
                // Hide alerts
                document.getElementById('orderStatusSuccess').classList.add('d-none');
                document.getElementById('orderStatusError').classList.add('d-none');
            });
        });

        // AJAX form submit for status update
        var form = document.getElementById('updateOrderStatusForm');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                var orderId = document.getElementById('updateOrderId').value;
                var status = document.getElementById('orderStatusSelect').value;
                var csrfToken = form.querySelector('[name=csrfmiddlewaretoken]').value;
                var formData = new FormData();
                formData.append('order_id', orderId);
                formData.append('status', status);
                formData.append('csrfmiddlewaretoken', csrfToken);
                fetch('/update_order_status_ajax/', {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: formData
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        document.getElementById('orderStatusSuccess').classList.remove('d-none');
                        document.getElementById('orderStatusError').classList.add('d-none');
                        setTimeout(() => {
                            var modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('updateOrderStatusModal'));
                            modal.hide();
                            window.location.reload();
                        }, 1000);
                    } else {
                        document.getElementById('orderStatusError').classList.remove('d-none');
                        document.getElementById('orderStatusSuccess').classList.add('d-none');
                    }
                })
                .catch(() => {
                    document.getElementById('orderStatusError').classList.remove('d-none');
                    document.getElementById('orderStatusSuccess').classList.add('d-none');
                });
            });
        }
    });


    
        // Responsive sidebar toggle
        document.addEventListener('DOMContentLoaded', function() {
            const sidebar = document.getElementById('adminSidebar');
            const sidebarToggle = document.getElementById('sidebarToggle');
            const mainContent = document.querySelector('.main-content');
            function closeSidebarOnMobile() {
                if (window.innerWidth < 768) {
                    sidebar.classList.remove('active');
                    mainContent.style.marginLeft = '0';
                } else {
                    sidebar.classList.add('active');
                    mainContent.style.marginLeft = 'var(--sidebar-width)';
                }
            }
            if (sidebarToggle) {
                sidebarToggle.addEventListener('click', function(e) {
                    sidebar.classList.toggle('active');
                    if (sidebar.classList.contains('active')) {
                        mainContent.style.marginLeft = 'var(--sidebar-width)';
                    } else {
                        mainContent.style.marginLeft = '0';
                    }
                });
            }
            window.addEventListener('resize', closeSidebarOnMobile);
            closeSidebarOnMobile();

            // Section title
            const sectionTitle = document.getElementById('sectionTitle');
            const tabLinks = document.querySelectorAll('#sidebarTab .nav-link');
            const titles = {
                'dashboard-link': 'Dashboard Overview',
                'orders-link': 'Order Management',
                'menu-link': 'Menu Management',
                'users-link': 'Users',
                'settings-link': 'Settings',
                'profile-link': 'Admin Profile'
            };
            tabLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const tabName = link.getAttribute('data-bs-target').replace('#', '');
                    if (tabName === 'users' || tabName === 'orders') {
                        fetch(window.location.pathname + '?tab=' + tabName, {
                            headers: { 'X-Requested-With': 'XMLHttpRequest' }
                        })
                        .then(response => response.text())
                        .then(html => {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(html, 'text/html');
                            const tabContent = doc.getElementById(tabName);
                            if (tabContent) {
                                document.getElementById(tabName).innerHTML = tabContent.innerHTML;
                                sectionTitle.textContent = titles[link.id] || 'Dashboard Overview';
                            }
                        });
                    } else {
                        // Tab behavior for other tabs
                        const tabTrigger = new bootstrap.Tab(link);
                        tabTrigger.show();
                        sectionTitle.textContent = titles[link.id] || 'Dashboard Overview';
                    }
                });
            });
        });

            document.addEventListener('DOMContentLoaded', function() {

                
                const tabLinks = document.querySelectorAll('#sidebarTab .nav-link');
                tabLinks.forEach(link => {
                    link.addEventListener('shown.bs.tab', function(e) {
                        // Tab name from href
                        const urlParams = new URLSearchParams(e.target.href.split('?')[1]);
                        const tabName = urlParams.get('tab');
                        
                        // Update URL without reloading
                        const newUrl = `${window.location.pathname}?tab=${tabName}`;
                        window.history.replaceState(null, null, newUrl);
                        
                        // Update section title
                        const sectionTitle = document.getElementById('sectionTitle');
                        const titles = {
                            'dashboard': 'Dashboard Overview',
                            'orders': 'Order Management',
                            'menu': 'Menu Management',
                            'users': 'Users',
                            'settings': 'Settings',
                            'profile': 'Admin Profile'
                        };
                        sectionTitle.textContent = titles[tabName] || 'Dashboard Overview';
                    });
                });

                // Force a full page reload to the correct tab if not already on the correct tab
                const urlParams = new URLSearchParams(window.location.search);
                const activeTab = urlParams.get('tab') || 'dashboard';
                const tabPane = document.getElementById(activeTab);
                // If not already on the correct tab, reload to the correct tab
                if (!tabPane || !tabPane.classList.contains('show')) {
                    // Only reload if not already on the correct tab
                    window.location.href = window.location.pathname + '?tab=' + activeTab;
                }
            });




        // AJAX for Add, Edit, and Delete Menu Modals
        document.addEventListener('DOMContentLoaded', function() {
            // Add Menu7
            const addMenuForm = document.getElementById('addMenuForm');
            if (addMenuForm) {
                addMenuForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const formData = new FormData(addMenuForm);
                    fetch(window.location.pathname + '?tab=menu', {
                        method: 'POST',
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                        body: formData
                    })
                    .then(response => {
                        if (response.ok) {
                            const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('addMenuModal'));
                            modal.hide();
                            window.location.href = window.location.pathname + '?tab=menu';
                        } else {
                            alert('Failed to add menu item.');
                        }
                    })
                    .catch(() => alert('Failed to add menu item.'));
                });
            }

            // Edit Menu
            const editMenuModal = document.getElementById('editMenuModal');
            const editMenuForm = document.getElementById('editMenuForm');
            if (editMenuModal && editMenuForm) {
                editMenuModal.addEventListener('show.bs.modal', function(event) {
                    const button = event.relatedTarget;
                    document.getElementById('editMenuId').value = button.getAttribute('data-id');
                    document.getElementById('editMenuName').value = button.getAttribute('data-name');
                    document.getElementById('editMenuCategory').value = button.getAttribute('data-category');
                    document.getElementById('editMenuPrice').value = button.getAttribute('data-price');
                    document.getElementById('editMenuDescription').value = button.getAttribute('data-description');
                    document.getElementById('editMenuAvailable').checked = button.getAttribute('data-available') === 'True';
                    document.getElementById('editMenuSpecial').checked = button.getAttribute('data-special') === 'True';
                    const imgPreview = document.getElementById('editMenuImagePreview');
                    if (button.getAttribute('data-image')) {
                        imgPreview.src = button.getAttribute('data-image');
                        imgPreview.style.display = 'block';
                    } else {
                        imgPreview.style.display = 'none';
                    }
                });
                editMenuForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const formData = new FormData(editMenuForm);
                    fetch(window.location.pathname + '?tab=menu', {
                        method: 'POST',
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                        body: formData
                    })
                    .then(response => {
                        if (response.ok) {
                            const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('editMenuModal'));
                            modal.hide();
                            window.location.href = window.location.pathname + '?tab=menu';
                        } else {
                            alert('Failed to edit menu item.');
                        }
                    })
                    .catch(() => alert('Failed to edit menu item.'));
                });
            }

            // Delete Menu
            const deleteMenuModal = document.getElementById('deleteMenuModal');
            const deleteMenuForm = document.getElementById('deleteMenuForm');
            if (deleteMenuModal && deleteMenuForm) {
                deleteMenuModal.addEventListener('show.bs.modal', function(event) {
                    const button = event.relatedTarget;
                    document.getElementById('deleteMenuId').value = button.getAttribute('data-id');
                    document.getElementById('deleteMenuText').textContent = `Are you sure you want to delete "${button.getAttribute('data-name')}"?`;
                });
                deleteMenuForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const formData = new FormData(deleteMenuForm);
                    fetch(window.location.pathname + '?tab=menu', {
                        method: 'POST',
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                        body: formData
                    })
                    .then(response => {
                        if (response.ok) {
                            const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('deleteMenuModal'));
                            modal.hide();
                            window.location.href = window.location.pathname + '?tab=menu';
                        } else {
                            alert('Failed to delete menu item.');
                        }
                    })
                    .catch(() => alert('Failed to delete menu item.'));
                });
            }
        });