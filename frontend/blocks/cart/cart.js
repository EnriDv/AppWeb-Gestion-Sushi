export class Cart extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.cartItems = this.loadCartFromLocalStorage();

        const template = document.createElement('template');
        template.innerHTML = `
            <link rel="stylesheet" href="styles.css">
            <div class="cart-container">
                <div class="left-section">
                    <img src="img/cart-main.png" alt="A person holding a bowl of food">
                    <div class="overlay-content">
                        <h1>CART</h1>
                    </div>
                </div>
                <div class="right-section">
                    <div class="cart-header">
                        <h2>MY CART</h2>
                    </div>

                    <div class="cart-items-list" id="cart-items-list">
                        <p class="empty-cart-message">Your cart is empty.</p>
                    </div>

                    <div class="cart-summary-section">
                        <div class="cart-subtotal">
                            <span class="subtotal-label">SUBTOTAL</span>
                            <span class="subtotal-amount" id="cart-subtotal">$0.00</span>
                        </div>
                        <div class="cart-shipping">
                            <span class="shipping-label">SHIPPING</span>
                            <span class="shipping-amount" id="cart-shipping">$0.00</span>
                        </div>
                        <div class="cart-total">
                            <span class="total-label">TOTAL</span>
                            <span class="total-amount" id="cart-total">$0.00</span>
                        </div>
                    </div>

                    <button type="button" class="place-order-button">PLACE ORDER</button>

                    <div class="footer-links">
                        <a href="#">Licensing</a>
                        <a href="#">Styleguide</a>
                    </div>
                </div>
            </div>
        `;

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.cartItemsList = this.shadowRoot.getElementById('cart-items-list');
        this.cartSubtotalElement = this.shadowRoot.getElementById('cart-subtotal');
        this.cartTotalElement = this.shadowRoot.getElementById('cart-total');
        this.placeOrderButton = this.shadowRoot.querySelector('.place-order-button');

        this.renderCart();
    }

    connectedCallback() {
        console.log('Cart component added to the DOM');
        window.addEventListener('add-to-cart', this.handleAddToCartEvent.bind(this));
        if (this.placeOrderButton) {
            this.placeOrderButton.addEventListener('click', this.handlePlaceOrder.bind(this));
        }
    }

    disconnectedCallback() {
        console.log('Cart component removed from the DOM');
        window.removeEventListener('add-to-cart', this.handleAddToCartEvent.bind(this));
        if (this.placeOrderButton) {
            this.placeOrderButton.removeEventListener('click', this.handlePlaceOrder.bind(this));
        }
    }

    loadCartFromLocalStorage() {
        try {
            const storedCart = localStorage.getItem('qitchen-cart');
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (e) {
            console.error("Error loading cart from local storage:", e);
            return [];
        }
    }

    saveCartToLocalStorage() {
        try {
            localStorage.setItem('qitchen-cart', JSON.stringify(this.cartItems));
        } catch (e) {
            console.error("Error saving cart to local storage:", e);
        }
    }

    handleAddToCartEvent(event) {
        const dish = event.detail.dish;
        this.addItemToCart(dish);
    }

    addItemToCart(dish) {
        const existingItem = this.cartItems.find(item => item.id === dish.id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cartItems.push({ ...dish, quantity: 1 });
        }
        this.saveCartToLocalStorage();
        this.renderCart();
    }

    removeItemFromCart(dishId) {
        this.cartItems = this.cartItems.filter(item => item.id !== dishId);
        this.saveCartToLocalStorage();
        this.renderCart();
    }

    updateItemQuantity(dishId, change) {
        const item = this.cartItems.find(item => item.id === dishId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeItemFromCart(dishId);
            } else {
                this.saveCartToLocalStorage();
                this.renderCart();
            }
        }
    }

    calculateTotals() {
        let subtotal = 0;
        this.cartItems.forEach(item => {
            subtotal += item.precio * item.quantity;
        });
        const shipping = 5.00;
        const total = subtotal + shipping;
        return { subtotal, shipping, total };
    }

    renderCart() {
        this.cartItemsList.innerHTML = '';

        if (this.cartItems.length === 0) {
            this.cartItemsList.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
            this.placeOrderButton.disabled = true;
        } else {
            this.placeOrderButton.disabled = false;
            this.cartItems.forEach(item => {
                this.cartItemsList.appendChild(this.createCartItemElement(item));
            });
        }

        const { subtotal, shipping, total } = this.calculateTotals();
        this.cartSubtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        this.shadowRoot.getElementById('cart-shipping').textContent = `$${shipping.toFixed(2)}`;
        this.cartTotalElement.textContent = `$${total.toFixed(2)}`;
    }

    createCartItemElement(item) {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');
        cartItemDiv.dataset.dishId = item.id;

        cartItemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.nombre}">
            <div class="item-details">
                <h3 class="item-name">${item.nombre}</h3>
                <p class="item-description">${item.descripcion}</p>
            </div>
            <div class="item-price-qty">
                <div class="qty-controls">
                    <button class="qty-minus" data-id="${item.id}">-</button>
                    <span class="qty">${item.quantity}</span>
                    <button class="qty-plus" data-id="${item.id}">+</button>
                </div>
                <span class="price">$${(item.precio * item.quantity).toFixed(2)}</span>
            </div>
            <button class="remove-item-button" data-id="${item.id}">X</button>
        `;

        cartItemDiv.querySelector('.qty-minus').addEventListener('click', () => this.updateItemQuantity(item.id, -1));
        cartItemDiv.querySelector('.qty-plus').addEventListener('click', () => this.updateItemQuantity(item.id, 1));
        cartItemDiv.querySelector('.remove-item-button').addEventListener('click', () => this.removeItemFromCart(item.id));

        return cartItemDiv;
    }

    handlePlaceOrder() {
        if (this.cartItems.length === 0) {
            alert('Your cart is empty. Please add items before placing an order.');
            return;
        }
        alert('Order Placed! (This is a simulation)');
        console.log('Place Order button clicked with cart:', this.cartItems);
        this.cartItems = [];
        this.saveCartToLocalStorage();
        this.renderCart();
    }
}

customElements.define('cart-component', Cart);
