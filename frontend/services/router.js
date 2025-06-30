export const Router = {
    init() {
        document.body.addEventListener("click", e => {
            const link = e.target.closest('a[href^="/"]');
            if (link && !link.hasAttribute('target')) {
                e.preventDefault();
                Router.go(link.getAttribute("href"));
            }
        });
        window.addEventListener("popstate", e => {
            Router.go(e.state?.route || '/', false);
        });
        Router.go(location.pathname, false);
    },
    go(route, addToHistory = true) {
        if (addToHistory) {
            history.pushState({ route }, "", route);
        }
        let pageElement = null;
        let pageTagName = null;
        switch (route) {
            case "/":
            case "/home":
                pageTagName = "frontpage-component";
                break;
            case "/menu":
                pageTagName = "menu-component";
                break;
            case "/blog":
                pageTagName = "blog-component";
                break;
            case "/about":
                pageTagName = "about-component";
                break;
            case "/orders":
                pageTagName = "orders-component";
                break
            case "/login":
                pageTagName = "login-component";
                break
            case "/register": 
                pageTagName = "registration-component";
                break;
            case "/cart": 
                pageTagName = "cart-component";
                break;
            case "/reservation":
                pageTagName = "reservation-component";
                break;
            case "/contact":
                pageTagName = "contact-component";
                break;
            case "/blog-post":
                pageTagName = "blog-post-component";
                break;
            default:
                if (route.startsWith("/blog-post")) {
                    pageTagName = "blog-post-component";
                } else {
                    pageTagName = "h1"; 
                }
                break;
        }
            if (pageTagName) {
            if (pageTagName.includes('-')) {
                if (customElements.get(pageTagName)) {
                    pageElement = document.createElement(pageTagName);
                } else {
                    console.error(`Error de Router: El componente <${pageTagName}> no está definido. Revisa index.html o el script del componente.`);
                    pageElement = document.createElement("h1");
                    pageElement.textContent = "Error: No se pudo cargar el componente de la página.";
                }
            } else {
                pageElement = document.createElement(pageTagName);
            }
        }
            if (pageElement) {
            if (pageElement.tagName === 'H1' && !pageElement.textContent) {
                pageElement.textContent = "404 - Página no encontrada";
            }
            
            const main = document.querySelector("main");
            if (main) {
                main.innerHTML = "";
                main.appendChild(pageElement);
                window.scrollTo(0, 0);
            } else {
                console.error("Error crítico: No se encontró el elemento <main> en el DOM.");
            }
        }
    }
};

/*

import { authService } from './auth.service.js';

class RouterService {
    constructor() {
        this.currentPage = null;
    }
    
    static init() {
        const router = RouterService.getInstance();
        router._init();
        return router;
    }

    static getInstance() {
        if (!RouterService.instance) {
            RouterService.instance = new RouterService();
        }
        return RouterService.instance;
    }
    
    _init() {

        document.body.addEventListener("click", e => {
            const link = e.target.closest('a[href^="/"]');
            if (link && !link.hasAttribute('target')) {
                e.preventDefault();
                this.go(link.getAttribute("href"));
            }
        });

        window.addEventListener("popstate", e => {
            this.go(e.state?.route || '/', false);
        });

        this.go(location.pathname, false);
    }

    async go(route, addToHistory = true) {
        const protectedRoutes = ['/cart', '/orders'];
        if (protectedRoutes.includes(route) && !authService.isAuthenticated()) {
            this.go('/login', false);
            return;
        }

        if (this.currentPage && this.currentPage.disconnectedCallback) {
            this.currentPage.disconnectedCallback();
        }

        if (addToHistory) {
            history.pushState({ route }, "", route);
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
            const main = document.getElementById('main');
            if (main) {
                main.innerHTML = '';
                main.appendChild(pageElement);
                
                window.scrollTo(0, 0);

                window.dispatchEvent(new CustomEvent('route-change', { 
                    detail: { route, component: pageTagName } 
                }));

                if (pageTagName === 'login-form') {
                    this.addLoginListeners();
                } else if (pageTagName === 'register-form') {
                    this.addRegisterListeners();
                }
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

export { RouterService as Router };


*/