

import productService from '../../services/product.service.js';
import cartService from '../../services/cart.service.js';

export class menu extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.products = [];
        this.categories = [];
        this.selectedCategory = 'all';
        this.isLoading = false;
        this.error = null;
        
        this.renderShell();
    }

    connectedCallback() {
        this.loadProducts();
        this.addEventListeners();
    }

    disconnectedCallback() {
        this.removeEventListeners();
    }

    async loadProducts() {
        this.isLoading = true;
        this.error = null;
        this.render();
        
        try {
            this.products = await productService.getProducts();
            this.extractCategories();
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            this.error = 'No se pudieron cargar los productos. Por favor, intente nuevamente.';
        } finally {
            this.isLoading = false;
            this.render();
        }
    }

    extractCategories() {
        const categorySet = new Set();
        this.products.forEach(product => {
            if (product.category) {
                categorySet.add(product.category);
            }
        });
        this.categories = ['all', ...Array.from(categorySet)];
    }

    filterProducts() {
        if (this.selectedCategory === 'all') {
            return this.products;
        }
        return this.products.filter(product => 
            product.category === this.selectedCategory
        );
    }

    addToCart(productId, event) {
        event.stopPropagation();
        cartService.addItem(productId, 1);
        this.showNotification('Producto añadido al carrito');
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('notification--hide');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    renderShell() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/blocks/menu/menu.css">
            <div class="menu">
                <div class="products">
                    <h1 class="products__title">Nuestro Menú</h1>
                    <ul class="products__filters" id="category-filters">
                        <!-- Filtros de categoría se generarán dinámicamente -->
                    </ul>
                    
                    <div id="content">
                        <!-- Contenido dinámico (productos, loading, error) -->
                    </div>
                </div>
            </div>
        `;
    }
    
    render() {
        const contentEl = this.shadowRoot.getElementById('content');
        
        if (this.isLoading) {
            contentEl.innerHTML = '<div class="loading">Cargando productos...</div>';
            return;
        }
        
        if (this.error) {
            contentEl.innerHTML = `
                <div class="error">
                    <p>${this.error}</p>
                    <button id="retry-btn" class="products__filter">Reintentar</button>
                </div>
            `;
            
            const retryBtn = this.shadowRoot.getElementById('retry-btn');
            if (retryBtn) {
                retryBtn.addEventListener('click', () => this.loadProducts());
            }
            return;
        }
        
        const filteredProducts = this.filterProducts();
        
        if (filteredProducts.length === 0) {
            contentEl.innerHTML = `
                <div class="loading">
                    No hay productos disponibles${this.selectedCategory !== 'all' ? ' en esta categoría' : ''}.
                </div>`;
            return;
        }
        
        contentEl.innerHTML = `
            <div class="products__grid">
                ${filteredProducts.map(product => `
                    <article class="product-card">
                        <img 
                            src="${product.image || 'img/placeholder.jpg'}" 
                            alt="${product.name}" 
                            class="product-card__image"
                            loading="lazy"
                        >
                        <div class="product-card__info">
                            <div class="product-card__header">
                                <h3 class="product-card__title">${product.name}</h3>
                                <span class="product-card__price">$${(Number(product.price) || 0).toFixed(2)}</span>
                            </div>
                            ${product.description ? `
                                <p class="product-card__description">
                                    ${product.description}
                                </p>
                            ` : ''}
                            <div class="product-card__footer">
                                <button 
                                    class="product-card__button" 
                                    data-product-id="${product.id}"
                                    aria-label="Añadir ${product.name} al carrito"
                                >
                                    Añadir al carrito
                                </button>
                            </div>
                        </div>
                    </article>
                `).join('')}
            </div>
        `;
        
        this.renderCategoryFilters();
    }
    
    renderCategoryFilters() {
        const filtersContainer = this.shadowRoot.getElementById('category-filters');
        
        if (!filtersContainer) return;
        
        filtersContainer.innerHTML = this.categories.map(category => `
            <li>
                <button 
                    class="products__filter ${this.selectedCategory === category ? 'products__filter--active' : ''}"
                    data-category="${category}"
                    aria-pressed="${this.selectedCategory === category}"
                >
                    ${category === 'all' ? 'Todos' : this.formatCategoryName(category)}
                </button>
            </li>
        `).join('');
    }
    
    formatCategoryName(category) {
        return category
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    
    addEventListeners() {
        this.shadowRoot.addEventListener('click', (e) => {
            // Manejar clic en filtros de categoría
            const categoryBtn = e.target.closest('.products__filter');
            if (categoryBtn) {
                e.preventDefault();
                this.selectedCategory = categoryBtn.dataset.category;
                this.render();
                return; // Importante: salir después de manejar el clic
            }
            
            // Manejar clic en botón de añadir al carrito
            const addToCartBtn = e.target.closest('.product-card__button');
            if (addToCartBtn) {
                const productId = addToCartBtn.dataset.productId;
                if (productId) {
                    this.addToCart(parseInt(productId, 10), e);
                }
            }
        });
    }
    
    removeEventListeners() {
    }
    cleanup() {
    }
}

customElements.define('menu-component', menu);