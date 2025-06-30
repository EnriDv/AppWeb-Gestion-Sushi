import productService from './product.service.js';

class CartService {
    #items = new Map(); // {productId: quantity}
    
    constructor() {
        if (CartService._instance) {
            return CartService._instance;
        }
        CartService._instance = this;
        
        this.loadFromLocalStorage();
    }

    // Cargar carrito desde localStorage
    loadFromLocalStorage() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                const parsed = JSON.parse(savedCart);
                this.#items = new Map(parsed);
            } catch (e) {
                console.error('Error al cargar el carrito:', e);
                this.#items = new Map();
            }
        }
    }

    // Guardar carrito en localStorage
    #saveToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify([...this.#items]));
    }

    // Añadir producto al carrito
    addItem(productId, quantity = 1) {
        const currentQty = this.#items.get(productId) || 0;
        this.#items.set(productId, currentQty + quantity);
        this.#saveToLocalStorage();
        this.#notifyChange();
    }

    // Eliminar producto del carrito
    removeItem(productId) {
        this.#items.delete(productId);
        this.#saveToLocalStorage();
        this.#notifyChange();
    }

    // Actualizar cantidad de un producto
    updateQuantity(productId, quantity) {
        if (quantity <= 0) {
            this.removeItem(productId);
            return;
        }
        this.#items.set(productId, quantity);
        this.#saveToLocalStorage();
        this.#notifyChange();
    }

    // Vaciar el carrito
    clear() {
        this.#items.clear();
        this.#saveToLocalStorage();
        this.#notifyChange();
    }

    // Obtener todos los items con detalles del producto
    async getItems() {
        const items = [];
        for (const [productId, quantity] of this.#items.entries()) {
            try {
                const product = await productService.getProductById(productId);
                if (product) {
                    items.push({
                        product: {
                            ...product,
                            price: Number(product.price) || 0
                        },
                        quantity,
                        subtotal: (Number(product.price) || 0) * quantity
                    });
                }
            } catch (error) {
                console.error(`Error al cargar el producto ${productId}:`, error);
            }
        }
        return items;
    }

    // Obtener cantidad total de ítems
    getTotalItems() {
        return Array.from(this.#items.values()).reduce((total, qty) => total + qty, 0);
    }

    // Calcular el total del carrito
    async getTotal() {
        const items = await this.getItems();
        return items.reduce((total, item) => total + (item.subtotal || 0), 0);
    }

    // Verificar si el carrito está vacío
    isEmpty() {
        return this.#items.size === 0;
    }

    // Notificar cambios a los suscriptores
    #subscribers = new Set();

    subscribe(callback) {
        this.#subscribers.add(callback);
        return () => this.#subscribers.delete(callback);
    }

    #notifyChange() {
        this.#subscribers.forEach(callback => callback(this.getItems()));
    }
}

// Exportar una única instancia del servicio
export default new CartService();
