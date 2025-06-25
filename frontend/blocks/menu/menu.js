

export class menu extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const template = document.createElement('template');
        template.innerHTML = `
            <link rel="stylesheet" href="./styles.css"> <div class="menu-container">
                <div class="menu-image-section" style="background-image: url(img/menu.png);">
                    <div class="image-overlay">
                        <h3 id="menu-title">MENU</h3>
                        <p id="dish-description" class="menu-description-text"></p>
                    </div>
                </div>
                <div class="menu-list-section">
                    <ul class="menu-filter-list"></ul>
                    <div id="dish-list-container"></div>
                </div>
            </div>
        `;

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.menuFilterList = this.shadowRoot.querySelector('.menu-filter-list');
        this.dishListContainer = this.shadowRoot.querySelector('#dish-list-container');
        this.menuImageSection = this.shadowRoot.querySelector('.menu-image-section');
        this.menuTitleElement = this.shadowRoot.querySelector('#menu-title');
        this.dishDescriptionElement = this.shadowRoot.querySelector('#dish-description');

        this.dishDescriptionElement.textContent = '';
        this.dishDescriptionElement.style.opacity = '0';
    }

    connectedCallback() {
        console.log('Menu component added to the DOM');
        this.fetchMenuData(); // Llama a fetchMenuData cuando el componente se conecta
    }

    async fetchMenuData() {
        try {
            // CORRECCIÓN: Usar el endpoint correcto /api/dishes
            const response = await fetch('http://localhost:4090/api/dishes');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const dishes = await response.json();

            this.allDishes = dishes; // Guardamos todos los platos
            this.renderCategories(dishes);
            this.renderDishes('All'); // Mostramos todos los platos inicialmente
        } catch (error) {
            console.error('Error al cargar los datos del menú:', error);
            this.dishListContainer.innerHTML = '<p>Error al cargar los datos del menú.</p>';
        }
    }

    renderCategories(dishes) {
        this.menuFilterList.innerHTML = '';
        
        // CORRECCIÓN: Generar categorías dinámicamente desde los platos
        const categories = ['All', ...new Set(dishes.map(dish => dish.category))];
        
        categories.forEach(categoryName => {
            const listItem = document.createElement('li');
            listItem.classList.add('menu-filter-card');
            if (categoryName === 'All') {
                listItem.classList.add('active'); // La categoría "All" es la activa por defecto
            }
            listItem.textContent = categoryName;
            listItem.dataset.categoryName = categoryName;
            listItem.addEventListener('click', () => this.filterDishesByCategory(categoryName));
            this.menuFilterList.appendChild(listItem);
        });
    }

    renderDishes(categoryName) {
        this.dishListContainer.innerHTML = '';

        // Resetea la imagen principal al filtrar
        this.menuTitleElement.textContent = 'MENU';
        this.dishDescriptionElement.textContent = '';
        this.dishDescriptionElement.style.opacity = '0';
        this.menuImageSection.style.backgroundImage = 'url(img/menu.png)';

        // Filtra los platos por la categoría seleccionada
        const dishesToRender = categoryName === 'All' 
            ? this.allDishes 
            : this.allDishes.filter(dish => dish.category === categoryName);

        if (categoryName === 'All') {
            // Si es "All", agrupa por categoría
            const categories = [...new Set(this.allDishes.map(d => d.category))];
            categories.forEach(cat => {
                const categoryDishes = this.allDishes.filter(d => d.category === cat);
                if (categoryDishes.length > 0) {
                    const categoryTitle = document.createElement('h1');
                    categoryTitle.classList.add('menu-list-category');
                    categoryTitle.textContent = cat;
                    this.dishListContainer.appendChild(categoryTitle);

                    const dishList = document.createElement('ul');
                    dishList.classList.add('menu-list');
                    categoryDishes.forEach(dish => dishList.appendChild(this.createDishCard(dish)));
                    this.dishListContainer.appendChild(dishList);
                }
            });
        } else {
             // Si es una categoría específica, solo muestra la lista de platos
            if (dishesToRender.length > 0) {
                const dishList = document.createElement('ul');
                dishList.classList.add('menu-list');
                dishesToRender.forEach(dish => dishList.appendChild(this.createDishCard(dish)));
                this.dishListContainer.appendChild(dishList);
            } else {
                this.dishListContainer.innerHTML = `<p>No hay platos en la categoría ${categoryName}.</p>`;
            }
        }
    }

    createDishCard(dish) {
        const listItem = document.createElement('li');
        listItem.classList.add('menu-card-body');
        
        // CORRECCIÓN: Usar los nombres de campo del backend (name, price, description, image_url)
        listItem.innerHTML = `
            <div class="menu-card-thumbnail" style="background-image: url('${dish.image_url}')"></div>
            <div class="menu-card-info">
                <div class="menu-card-info-header">
                    <h2>${dish.name}</h2>
                    <h2 class="menu-card-price">$${Number(dish.price).toFixed(2)}</h2>
                </div>
                <div class="menu-card-info-body">
                    ${dish.description}
                </div>
                <div class="menu-card-actions">
                    <button class="add-to-cart-button" data-dish-id="${dish.id}">Add to Cart</button>
                </div>
            </div>
        `;

        // Evento para añadir al carrito
        listItem.querySelector('.add-to-cart-button').addEventListener('click', (event) => {
            event.stopPropagation();
            this.handleAddToCart(dish);
        });

        // Evento para mostrar el plato en la imagen principal
        listItem.addEventListener('click', () => {
            this.menuImageSection.style.backgroundImage = `url('${dish.image_url}')`;
            this.menuTitleElement.textContent = dish.name;
            this.dishDescriptionElement.textContent = dish.description;
            this.dishDescriptionElement.style.opacity = '1';
        });
        return listItem;
    }

    filterDishesByCategory(categoryName) {
        this.shadowRoot.querySelectorAll('.menu-filter-card').forEach(card => {
            card.classList.toggle('active', card.dataset.categoryName === categoryName);
        });
        this.renderDishes(categoryName);
    }

    handleAddToCart(dish) {
        console.log(`Añadiendo ${dish.name} (ID: ${dish.id}) al carrito.`);
        this.dispatchEvent(new CustomEvent('add-to-cart', {
            detail: { dish: dish },
            bubbles: true,
            composed: true
        }));
    }
}

customElements.define('menu-component', menu);