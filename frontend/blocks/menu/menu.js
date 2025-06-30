import productService from '../../services/product.service.js';
import cartService from '../../services/cart.service.js';

export class menu extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.products = [];
        this.filteredProducts = [];
        this.categories = [];
        this.selectedCategory = 'all';
        this.isLoading = false;
        this.page = 1;
        this.productsPerPage = 5;
        this.hasMore = true;
        this.observer = null;
        this.sentinel = null;
        this.renderShell();
    }

    connectedCallback() {
        this.loadProducts();
        this.addEventListeners();
    }

    disconnectedCallback() {
        this.removeEventListeners();
        if (this.observer) {
            this.observer.disconnect();
        }
    }

    async loadProducts() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.error = null;

        try {
            const data = await productService.getProducts();
            this.products = data;
            this.extractCategories();
            this.filterProducts();
            this.setup();
            console.log(this.products)
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            this.error = 'No se pudieron cargar los productos. Por favor, intente nuevamente.';
            this.renderError();
        } finally {
            this.isLoading = false;
        }
    }

    setup() {
        if (this.observer) {
            this.observer.disconnect();
        }

        const grid = this.shadowRoot.querySelector('.products__grid');
        if (!grid) return;

        const existingSentinel = this.shadowRoot.querySelector('.product__sentinel');
        if (existingSentinel) {
            existingSentinel.remove();
        }

        this.sentinel = document.createElement('div');
        this.sentinel.className = 'product__sentinel';
        grid.appendChild(this.sentinel);

        this.observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !this.isLoading && this.hasMore) {
                this.loadMoreProducts();
            }
        }, { rootMargin: '100px' });

        this.observer.observe(this.sentinel);
    }

    loadMoreProducts() {
        const start = (this.page - 1) * this.productsPerPage;
        const end = start + this.productsPerPage;
        const paginatedProducts = this.filteredProducts.slice(start, end);

        if (paginatedProducts.length === 0) {
            this.hasMore = false;
            if (this.sentinel) {
                this.sentinel.style.display = 'none';
            }
            return;
        }

        this.renderProducts(paginatedProducts, true);
        this.page++;
    }

    renderProducts(products, append = false) {
        const productsGrid = this.shadowRoot.querySelector('.products__grid');
        
        if (!productsGrid) return;

        if (!append) {
            productsGrid.innerHTML = '';
            this.page = 1;
            this.hasMore = true;
        }

        if (products.length === 0 && !append) {
            productsGrid.innerHTML = `
                <div class="no-products">
                    No hay productos disponibles${this.selectedCategory !== 'all' ? ' en esta categoría' : ''}.
                </div>
            `;
            return;
        }

        const productsHTML = products.map(product => `
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
        `).join('');

        if (append) {
            productsGrid.insertAdjacentHTML('beforeend', productsHTML);
        } else {
            productsGrid.innerHTML = productsHTML;
            this.setup();
        }
        console.error("holaaa")
    }

    renderLoading() {
        const contentEl = this.shadowRoot.getElementById('content');
        if (!contentEl) return;
        
        contentEl.innerHTML = `
            <div class="loading">
                <p>Cargando productos...</p>
            </div>
        `;
    }

    renderError() {
        const contentEl = this.shadowRoot.getElementById('content');
        if (!contentEl) return;
        
        contentEl.innerHTML = `
            <div class="error">
                <p>${this.error}</p>
                <button id="retry-btn" class="products__filter">Reintentar</button>
            </div>
        `;
        
        const retryBtn = this.shadowRoot.getElementById('retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                this.page = 1;
                this.loadProducts();
            });
        }
    }

    renderShell() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/blocks/menu/menu.css">
            <div class="menu">
                <div class="products">
                    <h1 class="products__title">Nuestro Menú</h1>
                    <ul class="products__filters" id="category-filters">
                        
                    </ul>
                    
                    <div id="content">
                        <div class="products__grid"></div>
                    </div>
                </div>
            </div>
        `;
    }

    extractCategories() {
        const categorySet = new Set();
        this.products.forEach(product => {
            if (product.category) {
                categorySet.add(product.category);
            }
        });
        this.categories = ['all', ...Array.from(categorySet)];
        this.renderCategoryFilters();
    }

    filterProducts() {
        this.filteredProducts = this.selectedCategory === 'all'
            ? [...this.products]
            : this.products.filter(product => product.category === this.selectedCategory);
        
        this.page = 1;
        this.hasMore = this.filteredProducts.length > 0;
        this.renderProducts(this.filteredProducts.slice(0, this.productsPerPage));
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
            const categoryBtn = e.target.closest('.products__filter');
            if (categoryBtn) {
                e.preventDefault();
                this.selectedCategory = categoryBtn.dataset.category;
                this.filterProducts();
                return; 
            }
            
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
}

customElements.define('menu-component', menu);