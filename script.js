// ====================================
// CARRITO DE COMPRAS - 29GROW CON WHATSAPP
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

// Número de WhatsApp (formato internacional sin + ni espacios)
const WHATSAPP_NUMBER = '5492234365650';

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
    
    const total = calculateTotal();
    cartTotalSpan.innerText = `$${total.toLocaleString()}`;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.innerText = totalItems;
    
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
// MODAL PROFESIONAL DE CONFIRMACIÓN
// ====================================

function showProfessionalModal(titulo, mensaje, onConfirm, onCancel) {
    const modalHtml = `
        <div id="customConfirmModal" class="custom-confirm-modal">
            <div class="custom-confirm-content">
                <div class="custom-confirm-header">
                    <h3><i class="fas ${titulo.includes('éxito') ? 'fa-check-circle' : 'fa-question-circle'}"></i> ${titulo}</h3>
                </div>
                <div class="custom-confirm-body">
                    <p>${mensaje}</p>
                </div>
                <div class="custom-confirm-footer">
                    <button class="confirm-btn-cancel" id="confirmCancelBtn">Cancelar</button>
                    <button class="confirm-btn-accept" id="confirmAcceptBtn">Aceptar</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = document.getElementById('customConfirmModal');
    
    const closeModal = () => {
        modal.remove();
    };
    
    const acceptBtn = document.getElementById('confirmAcceptBtn');
    const cancelBtn = document.getElementById('confirmCancelBtn');
    
    acceptBtn.addEventListener('click', () => {
        if (onConfirm) onConfirm();
        closeModal();
    });
    
    cancelBtn.addEventListener('click', () => {
        if (onCancel) onCancel();
        closeModal();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            if (onCancel) onCancel();
            closeModal();
        }
    });
}

// ====================================
// MODAL DE ÉXITO (pedido enviado)
// ====================================

function showExitoModal(mensaje, onAceptar) {
    const modalHtml = `
        <div id="exitoModal" class="custom-confirm-modal">
            <div class="custom-confirm-content exito">
                <div class="custom-confirm-header exito-header">
                    <h3><i class="fas fa-check-circle"></i> ¡Pedido enviado!</h3>
                </div>
                <div class="custom-confirm-body">
                    <p>${mensaje}</p>
                </div>
                <div class="custom-confirm-footer">
                    <button class="confirm-btn-accept" id="exitoAcceptBtn">Continuar</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = document.getElementById('exitoModal');
    
    const closeModal = () => {
        modal.remove();
        if (onAceptar) onAceptar();
    };
    
    const acceptBtn = document.getElementById('exitoAcceptBtn');
    acceptBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// ====================================
// FORMULARIO DE DATOS DEL CLIENTE
// ====================================

function showCheckoutForm() {
    if (cart.length === 0) {
        showProfessionalModal(
            'Carrito vacío',
            'No hay productos en tu carrito. Agregá algunos productos antes de finalizar la compra.',
            null,
            null
        );
        return;
    }
    
    const modalHtml = `
        <div id="checkoutModal" class="checkout-modal">
            <div class="checkout-modal-content">
                <div class="checkout-modal-header">
                    <h3><i class="fas fa-clipboard-list"></i> Completá tus datos</h3>
                    <button class="close-modal-btn" id="closeModalBtn">&times;</button>
                </div>
                <div class="checkout-modal-body">
                    <div class="form-group">
                        <label>Nombre *</label>
                        <input type="text" id="clienteNombre" placeholder="Tu nombre" required>
                    </div>
                    <div class="form-group">
                        <label>Apellido *</label>
                        <input type="text" id="clienteApellido" placeholder="Tu apellido" required>
                    </div>
                    <div class="form-group">
                        <label>Dirección *</label>
                        <input type="text" id="clienteDireccion" placeholder="Calle y número" required>
                    </div>
                    <div class="form-group">
                        <label>Teléfono *</label>
                        <input type="tel" id="clienteTelefono" placeholder="Ej: 3511234567" required>
                    </div>
                    <div class="form-group">
                        <label>Entrega *</label>
                        <select id="clienteEntrega" required>
                            <option value="">Seleccioná una opción</option>
                            <option value="Envío a domicilio">🚚 Envío a domicilio</option>
                            <option value="Retiro por local">🏪 Retiro por local (Av. Siempre Verde 2949, Córdoba)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Nota adicional (opcional)</label>
                        <textarea id="clienteNota" rows="2" placeholder="Algún comentario adicional..."></textarea>
                    </div>
                </div>
                <div class="checkout-modal-footer">
                    <button class="btn-cancelar" id="cancelarCheckout">Cancelar</button>
                    <button class="btn-enviar-whatsapp" id="enviarWhatsappBtn">Enviar pedido por WhatsApp</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    const modal = document.getElementById('checkoutModal');
    const closeBtn = document.getElementById('closeModalBtn');
    const cancelarBtn = document.getElementById('cancelarCheckout');
    const enviarBtn = document.getElementById('enviarWhatsappBtn');
    
    const closeModal = () => {
        modal.remove();
    };
    
    closeBtn.addEventListener('click', closeModal);
    cancelarBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    enviarBtn.addEventListener('click', () => {
        const nombre = document.getElementById('clienteNombre')?.value.trim();
        const apellido = document.getElementById('clienteApellido')?.value.trim();
        const direccion = document.getElementById('clienteDireccion')?.value.trim();
        const telefono = document.getElementById('clienteTelefono')?.value.trim();
        const entrega = document.getElementById('clienteEntrega')?.value;
        const nota = document.getElementById('clienteNota')?.value.trim();
        
        if (!nombre || !apellido || !direccion || !telefono || !entrega) {
            showProfessionalModal(
                'Campos incompletos',
                'Por favor, completá todos los campos obligatorios (*) antes de continuar.',
                null,
                null
            );
            return;
        }
        
        enviarPedidoWhatsApp(nombre, apellido, direccion, telefono, entrega, nota);
        closeModal();
    });
}

// ====================================
// ENVIAR PEDIDO A WHATSAPP
// ====================================

function enviarPedidoWhatsApp(nombre, apellido, direccion, telefono, entrega, nota) {
    let productosLista = '';
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        productosLista += `• ${item.name} x${item.quantity} = $${subtotal.toLocaleString()}\n`;
    });
    
    const total = calculateTotal();
    const fecha = new Date().toLocaleString('es-AR');
    
    let mensaje = `🛒 *NUEVO PEDIDO 29GROW* 🛒\n\n`;
    mensaje += `📅 *Fecha:* ${fecha}\n\n`;
    mensaje += `👤 *DATOS DEL CLIENTE*\n`;
    mensaje += `Nombre: ${nombre} ${apellido}\n`;
    mensaje += `Teléfono: ${telefono}\n`;
    mensaje += `Dirección: ${direccion}\n`;
    mensaje += `Entrega: ${entrega}\n\n`;
    mensaje += `📦 *PRODUCTOS SOLICITADOS*\n`;
    mensaje += `${productosLista}\n`;
    mensaje += `💰 *TOTAL: $${total.toLocaleString()}*\n\n`;
    
    if (nota) {
        mensaje += `📝 *Nota adicional:* ${nota}\n\n`;
    }
    
    mensaje += `✨ ¡Gracias por confiar en 29Grow! ✨\n`;
    mensaje += `Te contactaremos a la brevedad.`;
    
    const mensajeCodificado = encodeURIComponent(mensaje);
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensajeCodificado}`;
    
    // Mostrar modal de éxito antes de abrir WhatsApp
    showExitoModal(
        'Tu pedido fue enviado correctamente. Serás redirigido a WhatsApp para confirmar el mensaje.',
        () => {
            // Preguntar después del envío si quiere vaciar el carrito
            showProfessionalModal(
                'Carrito después de la compra',
                '¿Querés vaciar el carrito o mantener los productos para seguir comprando?',
                () => {
                    // Aceptar = vaciar carrito
                    cart = [];
                    saveCart();
                    renderCart();
                    closeCart();
                },
                () => {
                    // Cancelar = mantener carrito
                    closeCart();
                }
            );
        }
    );
    
    window.open(whatsappLink, '_blank');
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
    checkoutBtn.addEventListener('click', showCheckoutForm);
}

// Formulario de contacto
const enviarConsulta = document.getElementById('enviarConsulta');
if (enviarConsulta) {
    enviarConsulta.addEventListener('click', () => {
        const nombre = document.getElementById('contactNombre')?.value || '';
        const email = document.getElementById('contactEmail')?.value || '';
        const mensaje = document.getElementById('contactMensaje')?.value || '';
        
        if (nombre && email && mensaje) {
            showProfessionalModal(
                'Consulta enviada',
                `Gracias ${nombre}, hemos recibido tu consulta. Te responderemos a la brevedad.`,
                null,
                null
            );
            if (document.getElementById('contactNombre')) document.getElementById('contactNombre').value = '';
            if (document.getElementById('contactEmail')) document.getElementById('contactEmail').value = '';
            if (document.getElementById('contactMensaje')) document.getElementById('contactMensaje').value = '';
        } else {
            showProfessionalModal(
                'Campos incompletos',
                'Por favor completá todos los campos para enviar tu consulta.',
                null,
                null
            );
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

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ====================================
// INICIALIZAR
// ====================================
loadCart();