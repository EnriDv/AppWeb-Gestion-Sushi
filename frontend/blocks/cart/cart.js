import cartService from '../../services/cart.service.js';
import productService from '../../services/product.service.js';
import OrderService from '../../services/order.service.js';

export class Cart extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.unsubscribe = null;
        this.renderShell();
    }

    async connectedCallback() {
        // Suscribirse a cambios en el carrito
        this.unsubscribe = cartService.subscribe(() => this.renderCart());
        
        // Cargar productos y renderizar carrito
        await this.loadProducts();
    }

    disconnectedCallback() {
        // Limpiar la suscripción cuando el componente se desmonte
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    async loadProducts() {
        try {
            await productService.getProducts();
            this.renderCart();
        } catch (error) {
            console.error('Error al cargar productos:', error);
            this.showError('Error al cargar los productos. Por favor, intente nuevamente.');
        }
    }
    
    showError(message) {
        const cartList = this.shadowRoot.getElementById('cart-items-list');
        if (cartList) {
            cartList.innerHTML = `
                <div class="error-message">
                    <p>${message}</p>
                    <button id="retry-button">Reintentar</button>
                </div>
            `;
            
            const retryButton = this.shadowRoot.getElementById('retry-button');
            if (retryButton) {
                retryButton.addEventListener('click', () => this.loadProducts());
            }
        }
    }

    renderShell() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/blocks/cart/cart.css">
            <div class="cart-container">
                <div class="left-section">
                    <img src="img/cart-main.png" alt="A person holding a bowl of food">
                    <div class="overlay-content"><h1>CART</h1></div>
                </div>
                <div class="right-section">
                    <div class="cart-header">
                        <h2>MI CARRITO</h2>
                        <button id="clear-cart" class="clear-cart-btn">Vaciar carrito</button>
                    </div>
                    <div class="cart-items-list" id="cart-items-list">
                        <p class="empty-message">Tu carrito está vacío</p>
                    </div>
                    <div class="cart-summary-section">
                        <div class="cart-subtotal">
                            <span class="subtotal-label">SUBTOTAL</span>
                            <span class="subtotal-amount" id="cart-subtotal">$0.00</span>
                        </div>
                        <div class="cart-shipping">
                            <span class="shipping-label">ENVÍO</span>
                            <span class="shipping-amount">GRATIS</span>
                        </div>
                        <div class="cart-total">
                            <span class="total-label">TOTAL</span>
                            <span class="total-amount" id="cart-total">$0.00</span>
                        </div>
                    </div>
                    <button type="button" class="place-order-button" id="place-order">REALIZAR PEDIDO</button>
                </div>
            </div>
        `;

        // Agregar event listeners
        this.addEventListeners();
    }

    addEventListeners() {
        // Botón de vaciar carrito
        const clearCartBtn = this.shadowRoot.getElementById('clear-cart');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
                    cartService.clear();
                }
            });
        }

        // Botón de realizar pedido
        const placeOrderBtn = this.shadowRoot.getElementById('place-order');
        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', () => this.handlePlaceOrder());
        }
    }

    async renderCart() {
        const cartList = this.shadowRoot.getElementById('cart-items-list');
        const subtotalEl = this.shadowRoot.getElementById('cart-subtotal');
        const totalEl = this.shadowRoot.getElementById('cart-total');
        const placeOrderBtn = this.shadowRoot.getElementById('place-order');
        const clearCartBtn = this.shadowRoot.getElementById('clear-cart');
        
        // Mostrar estado de carga
        cartList.innerHTML = '<p class="loading-message">Cargando carrito...</p>';
        
        try {
            const cartItems = await cartService.getItems();
            
            if (cartItems.length === 0) {
                cartList.innerHTML = '<p class="empty-message">Tu carrito está vacío</p>';
                subtotalEl.textContent = '$0.00';
                totalEl.textContent = '$0.00';
                placeOrderBtn.disabled = true;
                if (clearCartBtn) clearCartBtn.style.display = 'none';
                return;
            }

        // Mostrar botón de vaciar carrito
        if (clearCartBtn) clearCartBtn.style.display = 'block';
        
        // Habilitar botón de realizar pedido
        placeOrderBtn.disabled = false;

        // Renderizar items del carrito
        cartList.innerHTML = cartItems.map(item => `
            <div class="cart-item" data-product-id="${item.product.id}">
                <div class="item-image">
                    <img src="${item.product.image || 'img/placeholder.jpg'}" alt="${item.product.name}">
                </div>
                <div class="item-details">
                    <h3 class="item-name">${item.product.name}</h3>
                    <p class="item-price">$${item.product.price.toFixed(2)}</p>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn minus" data-action="decrease">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-action="increase">+</button>
                </div>
                <div class="item-subtotal">
                    $${(item.subtotal || 0).toFixed(2)}
                </div>
                <button class="remove-item" data-action="remove">×</button>
            </div>
        `).join('');

        // Actualizar totales
        const subtotal = cartItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        totalEl.textContent = `$${subtotal.toFixed(2)}`;

        // Agregar event listeners a los botones de cantidad
        this.addQuantityEventListeners();
        } catch (error) {
            console.error('Error al cargar el carrito:', error);
            cartList.innerHTML = `
                <div class="error-message">
                    <p>Error al cargar el carrito. Por favor, intente nuevamente.</p>
                    <button id="retry-cart">Reintentar</button>
                </div>
            `;
            
            const retryBtn = this.shadowRoot.getElementById('retry-cart');
            if (retryBtn) {
                retryBtn.addEventListener('click', () => this.renderCart());
            }
        }
    }

    async addQuantityEventListeners() {
        const cartItems = this.shadowRoot.querySelectorAll('.cart-item');
        
        for (const item of cartItems) {
            const productId = item.dataset.productId;
            if (!productId) continue;
            
            // Botones de incrementar/disminuir
            const minusBtn = item.querySelector('.minus');
            const plusBtn = item.querySelector('.plus');
            const removeBtn = item.querySelector('.remove-item');
            
            // Función auxiliar para actualizar la cantidad
            const updateQuantity = async (newQty) => {
                if (newQty < 1) {
                    cartService.removeItem(productId);
                } else {
                    cartService.updateQuantity(productId, newQty);
                }
            };
            
            // Manejar clic en botón de disminuir
            minusBtn?.addEventListener('click', async () => {
                try {
                    const items = await cartService.getItems();
                    const cartItem = items.find(i => i.product?.id?.toString() === productId);
                    if (cartItem) {
                        await updateQuantity(cartItem.quantity - 1);
                    }
                } catch (error) {
                    console.error('Error al actualizar cantidad:', error);
                }
            });
            
            // Manejar clic en botón de aumentar
            plusBtn?.addEventListener('click', async () => {
                try {
                    const items = await cartService.getItems();
                    const cartItem = items.find(i => i.product?.id?.toString() === productId);
                    if (cartItem) {
                        await updateQuantity(cartItem.quantity + 1);
                    }
                } catch (error) {
                    console.error('Error al actualizar cantidad:', error);
                }
            });
            
            // Manejar clic en botón de eliminar
            removeBtn?.addEventListener('click', () => {
                cartService.removeItem(productId);
            });
        }
    }

    async handlePlaceOrder() {
        const placeOrderBtn = this.shadowRoot.getElementById('place-order');
        const originalText = placeOrderBtn?.textContent;
        
        try {
            // Deshabilitar el botón y mostrar estado de carga
            if (placeOrderBtn) {
                placeOrderBtn.disabled = true;
                placeOrderBtn.textContent = 'Procesando...';
            }
            
            // Obtener los ítems del carrito
            const items = await cartService.getItems();
            
            // Validar que haya ítems en el carrito
            if (!items || items.length === 0) {
                throw new Error('El carrito está vacío');
            }
            
            // Preparar los datos del pedido en el formato que espera el backend
            const orderItems = items.map(item => ({
                dish_id: item.product?.id, // El backend espera dish_id, no productId
                quantity: item.quantity,
                price: item.product?.price || 0
            }));
            
            // Validar que todos los ítems tengan los datos necesarios
            if (orderItems.some(item => !item.dish_id || !item.quantity)) {
                throw new Error('Algunos productos no son válidos');
            }

            const orderData = {
                items: orderItems,
                total: await cartService.getTotal(),
                status: 'pending',
                // Agrega más detalles del pedido según sea necesario
            };

            // Crear el pedido
            const response = await OrderService.createOrder(orderData);
            
            // Limpiar el carrito después de un pedido exitoso
            cartService.clear();
            
            // Mostrar mensaje de éxito
            alert('¡Pedido realizado con éxito!');
            
            // Redirigir a la página de confirmación o historial de pedidos
            window.location.href = '/ordenes';
            
        } catch (error) {
            console.error('Error al realizar el pedido:', error);
            alert(`Error al realizar el pedido: ${error.message || 'Por favor, intente nuevamente'}`);
        } finally {
            // Restaurar el estado del botón
            if (placeOrderBtn) {
                placeOrderBtn.disabled = false;
                placeOrderBtn.textContent = originalText;
            }
        }
    }

    updateTotals(subtotal) {
        const subtotalEl = this.shadowRoot.getElementById('cart-subtotal');
        const totalEl = this.shadowRoot.getElementById('cart-total');
        
        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;
    }
}

customElements.define('cart-component', Cart);
