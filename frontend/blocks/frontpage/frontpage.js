import { Router } from '../../services/router.js';

/**
 * FrontPage component - Muestra las tarjetas principales de navegación
 */
export class FrontPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.router = Router.getInstance();
        this.cards = [
            {
                id: 'menu',
                title: 'Menú',
                image: '/img/card1.png',
                route: '/menu',
                description: 'Explora nuestra deliciosa selección de sushi y platos japoneses.'
            },
            {
                id: 'reservation',
                title: 'Reservas',
                image: '/img/card2.png',
                route: '/reservation',
                description: 'Reserva tu mesa para disfrutar de la mejor experiencia gastronómica.'
            },
            {
                id: 'about',
                title: 'Sobre Nosotros',
                image: '/img/card3.png',
                route: '/about',
                description: 'Conoce nuestra historia y filosofía culinaria.'
            }
        ];
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    /**
     * Renderiza el componente
     */
    render() {
        try {
            const template = document.createElement('template');
            template.innerHTML = `
                <style>
                    @import '/blocks/frontpage/frontpage.css';
                </style>
                <div class="frontpage">
                    <h1 class="frontpage__title">Bienvenido a Sushi App</h1>
                    <p class="frontpage__subtitle">Descubre una experiencia culinaria única</p>
                    <ul class="frontpage__card-list">
                        ${this.cards.map(card => `
                            <li class="frontpage__card" id="card-${card.id}">
                                <div class="frontpage__card-image" 
                                     style="background-image: url('${card.image}');"
                                     aria-label="${card.title}">
                                </div>
                                <div class="frontpage__card-content">
                                    <h3 class="frontpage__card-title">${card.title}</h3>
                                    <p class="frontpage__card-description">${card.description}</p>
                                    <button class="frontpage__card-button" 
                                            data-href="${card.route}"
                                            aria-label="Ir a ${card.title}">
                                        <span class="frontpage__card-arrow" aria-hidden="true">→</span>
                                    </button>
                                </div>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;

            // Limpiar y renderizar el contenido
            this.shadowRoot.innerHTML = '';
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        } catch (error) {
            console.error('Error rendering FrontPage:', error);
            this.shadowRoot.innerHTML = `
                <div class="error-message">
                    <p>Lo sentimos, ha ocurrido un error al cargar la página.</p>
                    <button onclick="window.location.reload()">Recargar página</button>
                </div>
            `;
        }
    }

    /**
     * Configura los event listeners para la navegación
     */
    setupEventListeners() {
        try {
            const navButtons = this.shadowRoot.querySelectorAll('.frontpage__card-button');
            
            navButtons.forEach(button => {
                // Eliminar listeners previos para evitar duplicados
                button.removeEventListener('click', this.handleNavigation);
                button.addEventListener('click', this.handleNavigation.bind(this));
            });
        } catch (error) {
            console.error('Error setting up event listeners:', error);
        }
    }

    /**
     * Maneja la navegación al hacer clic en una tarjeta
     * @param {Event} event - El evento de clic
     */
    handleNavigation(event) {
        try {
            event.preventDefault();
            const button = event.currentTarget;
            const href = button?.dataset?.href;
            
            if (href) {
                // Verificar si la ruta requiere autenticación
                const protectedRoutes = ['/reservation', '/orders', '/profile'];
                if (protectedRoutes.includes(href) && !this.router.isAuthenticated()) {
                    this.router.go(`/login?redirect=${encodeURIComponent(href)}`);
                    return;
                }
                this.router.go(href);
            }
        } catch (error) {
            console.error('Navigation error:', error);
        }
    }

    disconnectedCallback() {
        // Limpiar event listeners
        const buttons = this.shadowRoot?.querySelectorAll('.frontpage__card-button');
        buttons?.forEach(button => {
            button.removeEventListener('click', this.handleNavigation);
        });
    }
}

// Registrar el componente personalizado
if (!customElements.get('frontpage-component')) {
    customElements.define('frontpage-component', FrontPage);
}

export default FrontPage;