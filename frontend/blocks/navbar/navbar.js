import { Router } from '../../services/router.js';
import { MenuOverlay } from '../menu-overlay/menu-overlay.js';

export class Navbar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const template = document.createElement('template');
        template.innerHTML = `
            <link rel="stylesheet" href="./styles.css"> <div class="first-navbar-body">
                <button class="first-navbar-button-burger">≡</button>
                <a class="first-navbar-logo nav-link" href="/">Qitchen</a>
                <a class="first-navbar-link nav-link desktop-only" href="/menu">Menu</a>
                <a class="first-navbar-link nav-link desktop-only" href="/about">About</a>
                <a class="first-navbar-link nav-link desktop-only" href="/reservation">Book A Table</a>
            </div>
            <div class="second-navbar-body" style="margin-left:40%">
                <a href="/registration" class="first-navbar-link nav-link">Registrarse</a>
                <a href="/cart" class="secon-navbar-button nav-link">🛒</a>
            </div>
            `;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
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
                const href = event.target.getAttribute('href') || event.target.dataset.href;
                Router.go(href);
            });
        });
    }
}

customElements.define('navbar-component', Navbar);