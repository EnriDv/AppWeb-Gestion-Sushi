const API_URL = 'http://localhost:4090/api/dishes';

class ProductService {
    #products = [];
    #isLoading = false;
    #error = null;

    constructor() {
        if (ProductService._instance) {
            return ProductService._instance;
        }
        ProductService._instance = this;
        
        this.#initialize();
    }

    #initialize() {
        // Inicialización adicional si es necesaria
    }

    async #fetchProducts() {
        if (this.#isLoading) return;
        
        this.#isLoading = true;
        this.#error = null;
        
        try {
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al cargar los productos');
            }
            
            const data = await response.json();
            console.log('Productos cargados:', data); // Para depuración
            this.#products = Array.isArray(data) ? data : [];
            
            // Asegurarse de que cada producto tenga una categoría
            this.#products = this.#products.map(product => ({
                ...product,
                category: product.category || 'other',
                price: Number(product.price) || 0,
                image: product.image_url || 'img/placeholder.jpg'
            }));
        } catch (error) {
            console.error('Error fetching products:', error);
            this.#error = error.message;
            this.#products = [];
        } finally {
            this.#isLoading = false;
        }
    }

    setProducts(products) {
        this.#products = products.map(p => {
            // Asegurarse de que el precio sea un número válido
            const price = typeof p.price === 'string' 
                ? parseFloat(p.price.replace(/[^0-9.-]+/g, ''))
                : Number(p.price);
                
            return {
                id: p.id,
                name: p.name,
                description: p.description || '',
                price: isNaN(price) ? 0 : price,
                image: p.image || 'img/placeholder.jpg',
                categoryId: p.categoryId ? Number(p.categoryId) : null,
                isAvailable: p.isAvailable !== false,
                ...p
            };
        });
    }

    async getProducts() {
        if (this.#products.length === 0) {
            await this.#fetchProducts();
        }
        return this.#products;
    }

    async getProductById(id) {
        if (this.#products.length === 0) {
            await this.#fetchProducts();
        }
        return this.#products.find(p => p.id === Number(id));
    }

    async getProductsByCategory(categoryId) {
        if (this.#products.length === 0) {
            await this.#fetchProducts();
        }
        return this.#products.filter(p => p.categoryId === Number(categoryId));
    }

    get isLoading() {
        return this.#isLoading;
    }

    get error() {
        return this.#error;
    }
}

// Exportar una única instancia del servicio
export default new ProductService();
