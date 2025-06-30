import { Router } from '../../services/router.js';
import { authService } from '../../services/auth.service.js';
import { MenuOverlay } from '../menu-overlay/menu-overlay.js';

export class Navbar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() {
        const isAuthenticated = authService.isAuthenticated();
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/blocks/navbar/navbar.css">
            <div class="first-navbar-body">
                <button class="first-navbar-button-burger">≡</button>
                <a class="first-navbar-logo nav-link" href="/">Qitchen</a>
                <a class="first-navbar-link nav-link desktop-only" href="/menu">Menu</a>
                <a class="first-navbar-link nav-link desktop-only" href="/about">About</a>
                <a class="first-navbar-link nav-link desktop-only" href="/reservation">Book A Table</a>
            </div>
            <div class="second-navbar-body" style="margin-left:40%">
                ${isAuthenticated
                    ? `<a href="#" id="logout-button" class="first-navbar-link nav-link">Logout</a>`
                    : `<a href="/login" class="first-navbar-link nav-link">Login</a>
                       <a href="/register" class="first-navbar-link nav-link">Registrarse</a>`
                }
                <a href="/cart" class="secon-navbar-button nav-link">🛒</a>
            </div>
        `;
        this.addEventListeners();
    }

    connectedCallback() {
        this.render();
        window.addEventListener('auth-change', () => this.render());
    }

    addEventListeners() {
        const navButton = this.shadowRoot.querySelector('.first-navbar-button-burger');
        let menuOverlay = document.querySelector('menu-overlay-component');
        if (!menuOverlay) {
            menuOverlay = document.createElement('menu-overlay-component');
            document.body.appendChild(menuOverlay);
        }

        if (navButton) {
            navButton.addEventListener('click', () => {
                menuOverlay.openMenu();
            });
        }

        this.shadowRoot.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();

                if (event.target.id === 'logout-button') {
                    authService.logout();
                    Router.go('/');
                    window.dispatchEvent(new CustomEvent('auth-change'));
                    return;
                }

                const href = event.target.getAttribute('href') || event.target.dataset.href;
                Router.go(href);
            });
        });
    }
}
customElements.define('navbar-component', Navbar);