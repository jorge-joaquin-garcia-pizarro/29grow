// ====================================
// CARRITO DE COMPRAS - 29GROW
// ====================================

// Estado del carrito
let cart = [];

// Elementos del DOM
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartIcon = document.getElementById('cartIconHeader');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalSpan = document.getElementById('cartTotal');
const cartCountSpan = document.getElementById('cartCount');

// ====================================
// FUNCIONES DEL CARRITO
// ====================================

// Guardar carrito en localStorage
function saveCart() {
    localStorage.setItem('cart29grow', JSON.stringify(cart));
}

// Cargar carrito desde localStorage
function loadCart() {
    const saved = localStorage.getItem('cart29grow');
    if (saved) {
        cart = JSON.parse(saved);
    } else {
        cart = [];
    }
    renderCart();
}

// Agregar producto al carrito
function addToCart(productId, name, price) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    saveCart();
    renderCart();
    openCart();
}

// Remover producto del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
}

// Actualizar cantidad
function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        renderCart();
    }
}

// Calcular total
function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Renderizar carrito
function renderCart() {
    // Renderizar items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">🛒 El carrito está vacío</p>';
        cartTotalSpan.innerText = '$0';
        cartCountSpan.innerText = '0';
        return;
    }
    
    let itemsHtml = '';
    cart.forEach(item => {
        itemsHtml += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toLocaleString()}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="decr-qty" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="incr-qty" data-id="${item.id}">+</button>
                    <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = itemsHtml;
    
    // Total
    const total = calculateTotal();
    cartTotalSpan.innerText = `$${total.toLocaleString()}`;
    
    // Contador de items en el ícono
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.innerText = totalItems;
    
    // Agregar event listeners a los botones dinámicos
    document.querySelectorAll('.decr-qty').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            const item = cart.find(i => i.id === id);
            if (item) {
                updateQuantity(id, item.quantity - 1);
            }
        });
    });
    
    document.querySelectorAll('.incr-qty').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            const item = cart.find(i => i.id === id);
            if (item) {
                updateQuantity(id, item.quantity + 1);
            }
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            removeFromCart(id);
        });
    });
}

// Abrir carrito
function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('active');
}

// Cerrar carrito
function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('active');
}

// ====================================
// EVENT LISTENERS
// ====================================

// Botones de agregar al carrito
document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const productCard = btn.closest('.product-card');
        const productId = parseInt(productCard.dataset.id);
        const productName = productCard.dataset.nombre;
        const productPrice = parseInt(productCard.dataset.precio);
        
        addToCart(productId, productName, productPrice);
    });
});

// Abrir/cerrar carrito
if (cartIcon) cartIcon.addEventListener('click', openCart);
if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

// Checkout
const checkoutBtn = document.getElementById('checkoutBtn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('🛒 Tu carrito está vacío. Agregá productos para continuar.');
        } else {
            const total = calculateTotal();
            alert(`✅ Pedido confirmado! Total: $${total.toLocaleString()}\n\nEn breve nos contactaremos.`);
            // Opcional: vaciar carrito después del checkout
            // cart = [];
            // saveCart();
            // renderCart();
            // closeCart();
        }
    });
}

// Formulario de contacto
const enviarConsulta = document.getElementById('enviarConsulta');
if (enviarConsulta) {
    enviarConsulta.addEventListener('click', () => {
        const nombre = document.getElementById('contactNombre')?.value || '';
        const email = document.getElementById('contactEmail')?.value || '';
        const mensaje = document.getElementById('contactMensaje')?.value || '';
        
        if (nombre && email && mensaje) {
            alert(`✅ Gracias ${nombre}! Hemos recibido tu consulta y te responderemos a la brevedad.`);
            // Limpiar formulario
            if (document.getElementById('contactNombre')) document.getElementById('contactNombre').value = '';
            if (document.getElementById('contactEmail')) document.getElementById('contactEmail').value = '';
            if (document.getElementById('contactMensaje')) document.getElementById('contactMensaje').value = '';
        } else {
            alert('⚠️ Por favor completá todos los campos.');
        }
    });
}

// ====================================
// MENÚ HAMBURGUESA
// ====================================
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Cerrar menú al hacer click en un enlace
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ====================================
// INICIALIZAR
// ====================================
loadCart();