import { authService } from '../../services/auth.service.js';

export class Login extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                @import url('/blocks/login/login.css');
            </style>
            <div class="login">
                <div class="login__container">
                    <h2 class="login__title">Iniciar Sesión</h2>
                    <form class="login__form">
                        <div class="login__form-group">
                            <label for="email" class="login__label">Correo Electrónico</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                class="login__input" 
                                required
                            >
                        </div>
                        <div class="login__form-group">
                            <label for="password" class="login__label">Contraseña</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                class="login__input" 
                                required
                            >
                        </div>
                        <button type="submit" class="login__button">Acceder</button>
                        <p class="login__error-message"></p>
                    </form>
                    <div class="login__footer">
                        <p class="login__footer-text">
                            ¿No tienes cuenta? 
                            <a href="/register" class="login__footer-link">Regístrate aquí</a>
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const form = this.shadowRoot.querySelector('.login__form');
        if (form) {
            form.addEventListener('submit', this.handleSubmit.bind(this));
        }
        
        const links = this.shadowRoot.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href.startsWith('/')) {
                    window.history.pushState({}, '', href);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                }
            });
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');
        const errorMessageElement = this.shadowRoot.querySelector('.login__error-message');

        errorMessageElement.textContent = '';
        errorMessageElement.style.display = 'none';

        try {
            await authService.login(email, password);
            window.dispatchEvent(new CustomEvent('auth-change'));
            window.location.hash = '/';
        } catch (error) {
            console.error('Login failed:', error);
            const errorMessage = error.message || 'Error al iniciar sesión';
            errorMessageElement.textContent = errorMessage;
            errorMessageElement.style.display = 'block';
        }
    }
}

customElements.define('login-component', Login);