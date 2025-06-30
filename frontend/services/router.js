import { authService } from './auth.service.js';

class RouterService {
    constructor() {
        this.currentPage = null;
        this.layout = null;
        this.init();
    }

    static getInstance() {
        if (!RouterService.instance) {
            RouterService.instance = new RouterService();
        }
        return RouterService.instance;
    }
    
    init() {
        // Create layout if it doesn't exist
        if (!this.layout) {
            this.layout = document.createElement('app-layout');
            document.body.prepend(this.layout);
            
            // Move main content inside layout
            const main = document.querySelector('main');
            if (main) {
                this.layout.shadowRoot.querySelector('.layout__content').appendChild(main);
            } else {
                const newMain = document.createElement('main');
                this.layout.shadowRoot.querySelector('.layout__content').appendChild(newMain);
            }
        }

        // Handle navigation
        document.body.addEventListener("click", e => {
            const link = e.target.closest('a[href^="/"]');
            if (link && !link.hasAttribute('target')) {
                e.preventDefault();
                this.go(link.getAttribute("href"));
            }
        });

        // Handle browser back/forward
        window.addEventListener("popstate", e => {
            this.go(e.state?.route || '/', false);
        });

        // Initial route
        this.go(location.pathname, false);
    }

    async go(route, addToHistory = true) {
        const protectedRoutes = ['/cart', '/orders'];
        if (protectedRoutes.includes(route) && !authService.isAuthenticated()) {
            this.go('/login', false);
            return;
        }

        // Clean up current page
        if (this.currentPage && this.currentPage.disconnectedCallback) {
            this.currentPage.disconnectedCallback();
        }

        // Update URL if needed
        if (addToHistory) {
            history.pushState({ route }, "", route);
        }

        // Update layout title based on route
        if (this.layout) {
            const title = this.getPageTitle(route);
            this.layout.setAttribute('data-title', title);
        }

        let pageElement = null;
        let pageTagName = this.getPageComponent(route);

        if (pageTagName) {
            try {
                if (customElements.get(pageTagName)) {
                    pageElement = document.createElement(pageTagName);
                    this.currentPage = pageElement;
                } else {
                    throw new Error(`Component ${pageTagName} not defined`);
                }
            } catch (error) {
                console.error(`Router Error: Component <${pageTagName}> not found.`, error);
                pageElement = document.createElement('div');
                pageElement.innerHTML = `
                    <h1>Error 404</h1>
                    <p>Page not found: ${route}</p>
                    <a href="/">Go to Home</a>
                `;
            }
        }

        if (pageElement) {
            const main = this.layout?.shadowRoot?.querySelector('.layout__content');
            if (main) {
                // Clear existing content
                main.innerHTML = '';
                main.appendChild(pageElement);
                
                // Scroll to top
                window.scrollTo(0, 0);

                // Dispatch route change event
                window.dispatchEvent(new CustomEvent('route-change', { 
                    detail: { route, component: pageTagName } 
                }));

                // Add specific listeners based on page
                if (pageTagName === 'login-form') {
                    this.addLoginListeners();
                } else if (pageTagName === 'register-form') {
                    this.addRegisterListeners();
                }
            } else {
                console.error("Critical Error: Could not find layout content area");
            }
        }
    }

    getPageComponent(route) {
        const routeMap = {
            '/': 'frontpage-component',
            '/home': 'frontpage-component',
            '/menu': 'menu-component',
            '/blog': 'blog-component',
            '/about': 'about-component',
            '/orders': 'orders-component',
            '/login': 'login-form',
            '/register': 'register-form',
            '/cart': 'cart-component',
            '/reservation': 'reservation-component',
            '/contact': 'contact-component',
            '/blog-post': 'blog-post-component'
        };

        // Handle dynamic routes like /blog-post/123
        if (route.startsWith('/blog-post/')) {
            return 'blog-post-component';
        }

        return routeMap[route] || null;
    }

    getPageTitle(route) {
        const titleMap = {
            '/': 'Inicio',
            '/home': 'Inicio',
            '/menu': 'Menú',
            '/blog': 'Blog',
            '/about': 'Sobre Nosotros',
            '/orders': 'Mis Pedidos',
            '/login': 'Iniciar Sesión',
            '/register': 'Registro',
            '/cart': 'Carrito',
            '/reservation': 'Reservas',
            '/contact': 'Contacto'
        };

        if (route.startsWith('/blog-post/')) {
            return 'Artículo del Blog';
        }

        return titleMap[route] || 'Sushi App';
    }

    addLoginListeners() {
        const form = document.querySelector('login-form')?.shadowRoot?.querySelector('#login-form');
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = form.email?.value;
            const password = form.password?.value;
            const errorMessage = form.parentElement?.querySelector('#error-message');

            if (!email || !password) {
                if (errorMessage) {
                    errorMessage.textContent = 'Por favor ingrese email y contraseña';
                    errorMessage.style.display = 'block';
                }
                return;
            }

            try {
                await authService.login(email, password);
                this.go('/');
                window.dispatchEvent(new CustomEvent('auth-change'));
            } catch (error) {
                if (errorMessage) {
                    errorMessage.textContent = error.message || 'Error al iniciar sesión';
                    errorMessage.style.display = 'block';
                }
            }
        });
    }

    addRegisterListeners() {
        const form = document.querySelector('register-form')?.shadowRoot?.querySelector('#register-form');
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = form.name?.value;
            const email = form.email?.value;
            const password = form.password?.value;
            const confirmPassword = form['confirm-password']?.value;
            const errorMessage = form.parentElement?.querySelector('#error-message');

            if (!name || !email || !password || !confirmPassword) {
                if (errorMessage) {
                    errorMessage.textContent = 'Por favor complete todos los campos';
                    errorMessage.style.display = 'block';
                }
                return;
            }

            if (password !== confirmPassword) {
                if (errorMessage) {
                    errorMessage.textContent = 'Las contraseñas no coinciden';
                    errorMessage.style.display = 'block';
                }
                return;
            }

            try {
                await authService.register(name, email, password);
                this.go('/login');
            } catch (error) {
                if (errorMessage) {
                    errorMessage.textContent = error.message || 'Error al registrar el usuario';
                    errorMessage.style.display = 'block';
                }
            }
        });
    }
}

// Export the RouterService class
export { RouterService as Router };
