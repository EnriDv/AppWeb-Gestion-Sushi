import { authService } from './auth.service.js';

class RouterService {
    constructor() {
        this.currentPage = null;
        this.layout = null;
        this.currentRoute = null;
        this.init();
    }

    static getInstance() {
        if (!RouterService.instance) {
            RouterService.instance = new RouterService();
        }
        return RouterService.instance;
    }

    async init() {
        try {
            // Create layout if it doesn't exist
            if (!this.layout) {
                // Ensure the app-layout component is defined
                if (!customElements.get('app-layout')) {
                    // If not defined, wait for it to be defined
                    await customElements.whenDefined('app-layout');
                }
                
                // Create and append the layout
                this.layout = document.createElement('app-layout');
                document.body.prepend(this.layout);
                
                // Wait for the layout's shadow DOM to be ready
                await new Promise(resolve => {
                    const checkShadowRoot = () => {
                        if (this.layout.shadowRoot) {
                            resolve();
                        } else {
                            requestAnimationFrame(checkShadowRoot);
                        }
                    };
                    checkShadowRoot();
                });
                
                // Ensure main element exists
                let main = document.querySelector('main');
                if (!main) {
                    main = document.createElement('main');
                    this.layout.appendChild(main);
                }
                
                // Set up event listeners for navigation
                this.setupNavigation();
                
                // Handle popstate (browser back/forward)
                window.addEventListener('popstate', this.handlePopState.bind(this));
            }
            
            return true;
        } catch (error) {
            console.error('Error initializing router:', error);
            throw error;
        }
    }

    async navigateTo(route) {
        try {
            // Handle logout route
            if (route === '/logout') {
                await authService.logout();
                route = '/';
            }
            
            // Prevent navigation to the same route
            if (this.currentRoute === route) {
                return true;
            }
            
            // Get the page component for the route
            const pageComponent = this.getPageComponent(route);
            if (!pageComponent) {
                console.error(`No component found for route: ${route}`);
                return false;
            }
            
            // Check if user is authenticated for protected routes
            const isProtectedRoute = ['/orders', '/reservation', '/profile', '/cart'].includes(route);
            const isAuthPage = ['/login', '/register'].includes(route);
            const isAuthenticated = authService.isAuthenticated();
            
            // Redirect to login if trying to access protected route
            if (isProtectedRoute && !isAuthenticated) {
                this.navigateTo(`/login?redirect=${encodeURIComponent(route)}`);
                return false;
            }
            
            // Redirect away from auth pages if already authenticated
            if (isAuthPage && isAuthenticated) {
                this.navigateTo('/');
                return false;
            }
            
            // Update the URL
            if (window.location.pathname !== route) {
                window.history.pushState({ route }, '', route);
            }
            
            // Update current route
            this.currentRoute = route;
            
            // Get the main content area
            const main = document.querySelector('main');
            if (!main) {
                console.error('Main content area not found');
                return false;
            }
            
            // Show loading state
            main.innerHTML = '<div class="loading">Loading...</div>';
            
            // Create and append the new page component
            try {
                const pageElement = document.createElement(pageComponent);
                main.innerHTML = '';
                main.appendChild(pageElement);
                
                // Update page title
                document.title = this.getPageTitle(route) || 'Sushi App';
                
                // Update active nav item in layout
                this.updateActiveNav(route);
                
                // Dispatch route change event
                window.dispatchEvent(new CustomEvent('route-change', { 
                    detail: { route, component: pageComponent } 
                }));
                
                // Scroll to top
                window.scrollTo(0, 0);
                
                return true;
                
            } catch (error) {
                console.error(`Error rendering ${pageComponent}:`, error);
                main.innerHTML = `<div class="error">Error loading page. Please try again.</div>`;
                throw error;
            }
            
        } catch (error) {
            console.error('Navigation error:', error);
            throw error;
        }
    }

    /**
     * Set up navigation event listeners
     */
    setupNavigation() {
        // Handle internal navigation
        document.addEventListener('click', (e) => {
            // Handle links with data-route attribute
            if (e.target.matches('[data-route]') || e.target.closest('[data-route]')) {
                e.preventDefault();
                const link = e.target.closest('[data-route]');
                const route = link.getAttribute('data-route');
                if (route) {
                    this.navigateTo(route);
                }
            }
            // Handle regular anchor links
            else if (e.target.matches('a[href^="/"]') && !e.target.matches('a[target="_blank"]')) {
                e.preventDefault();
                const route = new URL(e.target.href).pathname;
                this.navigateTo(route);
            }
        });
    }
    
    /**
     * Handle browser back/forward navigation
     */
    handlePopState(event) {
        const route = event.state?.route || window.location.pathname;
        this.navigateTo(route);
    }
    
    /**
     * Update active navigation item in the layout
     */
    updateActiveNav(route) {
        if (!this.layout || !this.layout.shadowRoot) return;
        
        // Remove active class from all nav items
        const navItems = this.layout.shadowRoot.querySelectorAll('.layout__nav-item');
        navItems.forEach(item => item.classList.remove('layout__nav-item--active'));
        
        // Add active class to current route
        const activeItem = this.layout.shadowRoot.querySelector(`[data-route="${route}"]`);
        if (activeItem) {
            activeItem.classList.add('layout__nav-item--active');
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
            '/login': 'login-component',
            '/register': 'registration-component',
            '/cart': 'cart-component',
            '/reservation': 'reservation-component',
            '/contact': 'contact-component',
            '/blog-post': 'blog-post-component',
            '/profile': 'profile-component',
            '/logout': '' // Handled by the router
        };

        // Handle dynamic routes like /blog-post/123
        if (route.startsWith('/blog-post/')) {
            return 'blog-post-component';
        }

        return routeMap[route] || 'not-found-component';
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
        const loginComponent = document.querySelector('login-component');
        if (!loginComponent) return;
        
        const form = loginComponent.shadowRoot?.querySelector('form');
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const email = formData.get('email');
            const password = formData.get('password');
            const errorElement = loginComponent.shadowRoot.querySelector('.error-message');

            if (!email || !password) {
                if (errorElement) {
                    errorElement.textContent = 'Por favor ingrese email y contraseña';
                    errorElement.style.display = 'block';
                }
                return;
            }

            try {
                await authService.login(email, password);
                this.navigateTo('/');
                window.dispatchEvent(new CustomEvent('auth-change'));
            } catch (error) {
                if (errorElement) {
                    errorElement.textContent = error.message || 'Error al iniciar sesión';
                    errorElement.style.display = 'block';
                }
            }
        });
    }

    addRegisterListeners() {
        const registerComponent = document.querySelector('registration-component');
        if (!registerComponent) return;
        
        const form = registerComponent.shadowRoot?.querySelector('form');
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const name = formData.get('name');
            const email = formData.get('email');
            const password = formData.get('password');
            const confirmPassword = formData.get('confirm-password');
            const errorElement = registerComponent.shadowRoot.querySelector('.error-message');

            if (!name || !email || !password || !confirmPassword) {
                if (errorElement) {
                    errorElement.textContent = 'Por favor complete todos los campos';
                    errorElement.style.display = 'block';
                }
                return;
            }
            
            if (password !== confirmPassword) {
                if (errorElement) {
                    errorElement.textContent = 'Las contraseñas no coinciden';
                    errorElement.style.display = 'block';
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