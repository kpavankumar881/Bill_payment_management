/* ========================================
   BILL MANAGEMENT SYSTEM - JAVASCRIPT
   All Dynamic Functionality
   ======================================== */

// ========================================
// LOCAL STORAGE MANAGEMENT
// ========================================

// Initialize local storage with default data
function initializeStorage() {
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify([]));
    }
    if (!localStorage.getItem('customers')) {
        localStorage.setItem('customers', JSON.stringify([]));
    }
    if (!localStorage.getItem('bills')) {
        localStorage.setItem('bills', JSON.stringify([]));
    }
    if (!localStorage.getItem('currentUser')) {
        localStorage.setItem('currentUser', 'Guest User');
    }
}

// ========================================
// LOGIN FUNCTIONALITY
// ========================================

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMsg = document.getElementById('errorMessage');

    // Simple validation
    if (!username || !password) {
        showError(errorMsg, 'Please fill in all fields');
        return;
    }

    if (password.length < 3) {
        showError(errorMsg, 'Password must be at least 3 characters');
        return;
    }

    // Store user and redirect
    localStorage.setItem('currentUser', username);
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = 'dashboard.html';
}

function showError(element, message) {
    element.textContent = message;
    element.classList.add('show');
    setTimeout(() => {
        element.classList.remove('show');
    }, 4000);
}

function showSuccess(message) {
    const alert = document.querySelector('.alert-success');
    if (alert) {
        alert.textContent = message;
        alert.classList.add('show');
        setTimeout(() => {
            alert.classList.remove('show');
        }, 3000);
    }
}

// ========================================
// AUTHENTICATION CHECK
// ========================================

function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname.split('/').pop();
    
    if (!isLoggedIn && currentPage !== 'index.html' && currentPage !== '') {
        window.location.href = 'index.html';
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// ========================================
// UPDATE USER INFO IN NAVBAR
// ========================================

function updateUserInfo() {
    const userName = localStorage.getItem('currentUser') || 'User';
    const userElement = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    
    if (userElement) {
        userElement.textContent = userName;
    }
    
    if (userAvatar) {
        userAvatar.textContent = userName.charAt(0).toUpperCase();
    }
}

// ========================================
// SET ACTIVE SIDEBAR LINK
// ========================================

function setActiveSidebarLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// ========================================
// DASHBOARD FUNCTIONALITY
// ========================================

function loadDashboard() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    const bills = JSON.parse(localStorage.getItem('bills')) || [];
    
    // Update stat cards
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('totalCustomers').textContent = customers.length;
    document.getElementById('totalBills').textContent = bills.length;
    
    // Load recent bills
    loadRecentBills(bills.slice(-5).reverse());
}

function loadRecentBills(billsList) {
    const tableBody = document.getElementById('recentBillsBody');
    
    if (!tableBody) return;
    
    if (billsList.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No bills yet</td></tr>';
        return;
    }
    
    tableBody.innerHTML = billsList.map(bill => `
        <tr>
            <td>#${bill.id}</td>
            <td>${bill.customerName}</td>
            <td>${bill.date}</td>
            <td>₹${bill.total.toFixed(2)}</td>
            <td>
                <button class="btn btn-view btn-sm" onclick="viewBillDetails(${bill.id})">View</button>
            </td>
        </tr>
    `).join('');
}

// ========================================
// PRODUCT MANAGEMENT
// ========================================

function addProduct(event) {
    event.preventDefault();
    
    const productName = document.getElementById('productName').value.trim();
    const productPrice = parseFloat(document.getElementById('productPrice').value);
    const productQuantity = parseInt(document.getElementById('productQuantity').value);
    
    // Validation
    if (!productName || !productPrice || !productQuantity) {
        alert('Please fill in all product fields');
        return;
    }
    
    if (productPrice <= 0 || productQuantity <= 0) {
        alert('Price and quantity must be greater than 0');
        return;
    }
    
    // Get existing products
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Create new product
    const newProduct = {
        id: Date.now(),
        name: productName,
        price: productPrice,
        quantity: productQuantity,
        dateAdded: new Date().toLocaleDateString()
    };
    
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    
    // Reset form and reload
    document.getElementById('productForm').reset();
    loadProductsList();
    showSuccess('Product added successfully');
}

function loadProductsList() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const tableBody = document.getElementById('productsBody');
    
    if (!tableBody) return;
    
    if (products.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No products added yet</td></tr>';
        return;
    }
    
    tableBody.innerHTML = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>₹${product.price.toFixed(2)}</td>
            <td>${product.quantity}</td>
            <td>${product.dateAdded}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-edit btn-sm" onclick="editProduct(${product.id})">Edit</button>
                    <button class="btn btn-delete btn-sm" onclick="deleteProduct(${product.id})">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('products', JSON.stringify(products));
        loadProductsList();
        showSuccess('Product deleted successfully');
    }
}

function editProduct(productId) {
    alert('Edit functionality can be extended by implementing a modal form');
}

// ========================================
// CUSTOMER MANAGEMENT
// ========================================

function addCustomer(event) {
    event.preventDefault();
    
    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();
    const customerAddress = document.getElementById('customerAddress').value.trim();
    
    // Validation
    if (!customerName || !customerPhone || !customerAddress) {
        alert('Please fill in all customer fields');
        return;
    }
    
    if (customerPhone.length < 10) {
        alert('Phone number must be at least 10 digits');
        return;
    }
    
    // Get existing customers
    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    
    // Create new customer
    const newCustomer = {
        id: Date.now(),
        name: customerName,
        phone: customerPhone,
        address: customerAddress,
        dateAdded: new Date().toLocaleDateString()
    };
    
    customers.push(newCustomer);
    localStorage.setItem('customers', JSON.stringify(customers));
    
    // Reset form and reload
    document.getElementById('customerForm').reset();
    loadCustomersList();
    loadCustomerDropdown(); // Update dropdown in bill generation
    showSuccess('Customer added successfully');
}

function loadCustomersList() {
    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    const tableBody = document.getElementById('customersBody');
    
    if (!tableBody) return;
    
    if (customers.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No customers added yet</td></tr>';
        return;
    }
    
    tableBody.innerHTML = customers.map(customer => `
        <tr>
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.phone}</td>
            <td>${customer.address}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-delete btn-sm" onclick="deleteCustomer(${customer.id})">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function deleteCustomer(customerId) {
    if (confirm('Are you sure you want to delete this customer?')) {
        let customers = JSON.parse(localStorage.getItem('customers')) || [];
        customers = customers.filter(c => c.id !== customerId);
        localStorage.setItem('customers', JSON.stringify(customers));
        loadCustomersList();
        showSuccess('Customer deleted successfully');
    }
}

function loadCustomerDropdown() {
    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    const dropdown = document.getElementById('customerSelect');
    
    if (!dropdown) return;
    
    dropdown.innerHTML = '<option value="">Select a customer</option>' +
        customers.map(customer => `
            <option value="${customer.id}">${customer.name} (${customer.phone})</option>
        `).join('');
}

// ========================================
// GENERATE BILL FUNCTIONALITY
// ========================================

function loadProductDropdown() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const dropdown = document.getElementById('productSelect');
    
    if (!dropdown) return;
    
    dropdown.innerHTML = '<option value="">Select a product</option>' +
        products.map(product => `
            <option value="${product.id}" data-price="${product.price}">
                ${product.name} (₹${product.price.toFixed(2)})
            </option>
        `).join('');
}

function addProductToBill(event) {
    event.preventDefault();
    
    const productSelect = document.getElementById('productSelect');
    const quantityInput = document.getElementById('billQuantity');
    const productId = parseInt(productSelect.value);
    const quantity = parseInt(quantityInput.value);
    
    if (!productId || !quantity || quantity <= 0) {
        alert('Please select a product and enter valid quantity');
        return;
    }
    
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        alert('Product not found');
        return;
    }
    
    // Get bill items list or create it
    let billItems = JSON.parse(localStorage.getItem('billItems')) || [];
    
    // Check if product already exists in bill
    const existingItem = billItems.find(item => item.productId === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        billItems.push({
            productId: productId,
            productName: product.name,
            price: product.price,
            quantity: quantity
        });
    }
    
    localStorage.setItem('billItems', JSON.stringify(billItems));
    
    productSelect.value = '';
    quantityInput.value = '';
    loadBillItemsList();
    calculateBillTotal();
}

function loadBillItemsList() {
    const billItems = JSON.parse(localStorage.getItem('billItems')) || [];
    const container = document.getElementById('billItemsList');
    
    if (!container) return;
    
    if (billItems.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">No items added to bill</p>';
        return;
    }
    
    container.innerHTML = billItems.map(item => `
        <div class="bill-item">
            <span>${item.productName}</span>
            <span>₹${item.price.toFixed(2)}</span>
            <span>Qty: ${item.quantity}</span>
            <button type="button" class="bill-item-remove" onclick="removeBillItem(${item.productId})">Remove</button>
        </div>
    `).join('');
}

function removeBillItem(productId) {
    let billItems = JSON.parse(localStorage.getItem('billItems')) || [];
    billItems = billItems.filter(item => item.productId !== productId);
    localStorage.setItem('billItems', JSON.stringify(billItems));
    loadBillItemsList();
    calculateBillTotal();
}

function calculateBillTotal() {
    const billItems = JSON.parse(localStorage.getItem('billItems')) || [];
    
    const subtotal = billItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);
    
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + tax;
    
    // Update display
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('taxAmount');
    const totalEl = document.getElementById('totalAmount');
    
    if (subtotalEl) subtotalEl.textContent = '₹' + subtotal.toFixed(2);
    if (taxEl) taxEl.textContent = '₹' + tax.toFixed(2);
    if (totalEl) totalEl.textContent = '₹' + total.toFixed(2);
    
    return total;
}

function generateBill(event) {
    event.preventDefault();
    
    const customerSelect = document.getElementById('customerSelect');
    const customerId = parseInt(customerSelect.value);
    const billItems = JSON.parse(localStorage.getItem('billItems')) || [];
    
    if (!customerId) {
        alert('Please select a customer');
        return;
    }
    
    if (billItems.length === 0) {
        alert('Please add products to the bill');
        return;
    }
    
    // Calculate total
    const subtotal = billItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;
    
    // Get customer details
    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    const customer = customers.find(c => c.id === customerId);
    
    // Create bill
    const bills = JSON.parse(localStorage.getItem('bills')) || [];
    const newBill = {
        id: Date.now(),
        customerId: customerId,
        customerName: customer.name,
        items: billItems,
        subtotal: subtotal,
        tax: tax,
        total: total,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
    };
    
    bills.push(newBill);
    localStorage.setItem('bills', JSON.stringify(bills));
    
    // Generate preview
    generateBillPreview(newBill);
    
    // Clear bill items
    localStorage.removeItem('billItems');
    loadBillItemsList();
    calculateBillTotal();
    customerSelect.value = '';
    
    showSuccess('Bill generated successfully');
}

function generateBillPreview(bill) {
    const preview = document.getElementById('billPreview');
    
    if (!preview) return;
    
    let itemsHtml = bill.items.map(item => `
        <div class="bill-item-row">
            <span>${item.productName} x ${item.quantity}</span>
            <span>₹${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    const html = `
        <div class="bill-preview-content">
            <div class="bill-header">
                <h3>BILL INVOICE</h3>
                <p>Bill ID: #${bill.id}</p>
            </div>
            
            <div class="bill-info">
                <p><strong>Customer:</strong> ${bill.customerName}</p>
                <p><strong>Date:</strong> ${bill.date}</p>
                <p><strong>Time:</strong> ${bill.time}</p>
            </div>
            
            <div class="bill-items-preview">
                <div style="text-align: center; margin-bottom: 10px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <span>Description</span>
                        <span>Amount</span>
                    </div>
                </div>
                ${itemsHtml}
            </div>
            
            <div class="bill-summary">
                <div class="bill-summary-row">
                    <span>Subtotal:</span>
                    <span>₹${bill.subtotal.toFixed(2)}</span>
                </div>
                <div class="bill-summary-row">
                    <span>Tax (5%):</span>
                    <span>₹${bill.tax.toFixed(2)}</span>
                </div>
                <div class="bill-summary-row total">
                    <span>TOTAL:</span>
                    <span>₹${bill.total.toFixed(2)}</span>
                </div>
            </div>
            
            <p style="margin-top: 20px; font-size: 12px; color: #999;">
                Thank you for your purchase!
            </p>
        </div>
    `;
    
    preview.innerHTML = html;
}

function printBill() {
    const preview = document.getElementById('billPreview');
    if (!preview || !preview.innerHTML) {
        alert('Please generate a bill first');
        return;
    }
    
    window.print();
}

// ========================================
// BILL HISTORY
// ========================================

function loadBillHistory() {
    const bills = JSON.parse(localStorage.getItem('bills')) || [];
    const tableBody = document.getElementById('billHistoryBody');
    
    if (!tableBody) return;
    
    if (bills.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No bills found</td></tr>';
        return;
    }
    
    // Sort by date descending
    bills.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    tableBody.innerHTML = bills.map(bill => `
        <tr>
            <td>#${bill.id}</td>
            <td>${bill.customerName}</td>
            <td>${bill.date}</td>
            <td>₹${bill.total.toFixed(2)}</td>
            <td>
                <button class="btn btn-view btn-sm" onclick="viewBill(${bill.id})">View</button>
            </td>
        </tr>
    `).join('');
}

function viewBill(billId) {
    const bills = JSON.parse(localStorage.getItem('bills')) || [];
    const bill = bills.find(b => b.id === billId);
    
    if (!bill) {
        alert('Bill not found');
        return;
    }
    
    generateBillPreview(bill);
    alert('Bill preview generated. Click View to see in a modal or use Print button to print.');
}

function viewBillDetails(billId) {
    viewBill(billId);
}

// ========================================
// PAGE INITIALIZATION
// ========================================

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeStorage();
    checkAuth();
    updateUserInfo();
    setActiveSidebarLink();
    
    // Load page-specific data
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'dashboard.html' || currentPage === '') {
        loadDashboard();
    } else if (currentPage === 'add-product.html') {
        loadProductsList();
    } else if (currentPage === 'customer.html') {
        loadCustomersList();
    } else if (currentPage === 'generate-bill.html') {
        loadCustomerDropdown();
        loadProductDropdown();
        loadBillItemsList();
        calculateBillTotal();
    } else if (currentPage === 'bill-history.html') {
        loadBillHistory();
    }
});
