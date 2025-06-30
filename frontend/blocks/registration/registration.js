import { authService } from '../../services/auth.service.js';

export class Registration extends HTMLElement {
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
                @import url('/blocks/registration/registration.css');
            </style>
            <div class="registration">
                <div class="registration__container">
                    <h2 class="registration__title">Crear Cuenta</h2>
                    <form class="registration__form">
                        <div class="registration__form-group">
                            <label for="name" class="registration__label">Nombre Completo</label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                class="registration__input" 
                                required
                            >
                        </div>
                        <div class="registration__form-group">
                            <label for="phone" class="registration__label">Teléfono</label>
                            <input 
                                type="tel" 
                                id="phone" 
                                name="phone" 
                                class="registration__input" 
                                required
                            >
                        </div>
                        <div class="registration__form-group">
                            <label for="email" class="registration__label">Correo Electrónico</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                class="registration__input" 
                                required
                            >
                        </div>
                        <div class="registration__form-group">
                            <label for="password" class="registration__label">Contraseña</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                class="registration__input" 
                                required
                            >
                        </div>
                        <div class="registration__form-group">
                            <label for="confirm-password" class="registration__label">Confirmar Contraseña</label>
                            <input 
                                type="password" 
                                id="confirm-password" 
                                name="confirm-password" 
                                class="registration__input" 
                                required
                            >
                        </div>
                        <div class="registration__form-group">
                            <label for="address" class="registration__label">Dirección</label>
                            <input 
                                type="text" 
                                id="address" 
                                name="address" 
                                class="registration__input" 
                                required
                            >
                        </div>
                        <button type="submit" class="registration__button">Registrarse</button>
                        <p class="registration__error-message"></p>
                    </form>
                    <div class="registration__footer">
                        <p class="registration__footer-text">
                            ¿Ya tienes una cuenta? 
                            <a href="/login" class="registration__footer-link">Inicia sesión aquí</a>
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const form = this.shadowRoot.querySelector('.registration__form');
        if (form) {
            form.addEventListener('submit', this.handleSubmit.bind(this));
        }
        
        // Manejar clics en enlaces internos
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
        const name = formData.get('name');
        const phone = formData.get('phone');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm-password');
        const address = formData.get('address');
        const errorMessageElement = this.shadowRoot.querySelector('.registration__error-message');

        // Reset error message
        errorMessageElement.textContent = '';
        errorMessageElement.style.display = 'none';

        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            errorMessageElement.textContent = 'Las contraseñas no coinciden';
            errorMessageElement.style.display = 'block';
            return;
        }

        try {
            const data = await authService.register({
                name,
                email,
                password,
                phone,
                address
            });
            
            console.log('Registration successful:', data);
            
            // Redirigir a la página de login después de un registro exitoso
            window.location.href = '/login';
        } catch (error) {
            console.error('Registration failed:', error);
            const errorMessage = error.message || 'Error al registrar el usuario. Por favor, inténtalo de nuevo.';
            errorMessageElement.textContent = errorMessage;
            errorMessageElement.style.display = 'block';
        }
    }
}

customElements.define('registration-component', Registration);