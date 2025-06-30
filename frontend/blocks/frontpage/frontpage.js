import { Router } from '../../services/router.js';

export class frontPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.router = Router.getInstance();
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                @import '/blocks/frontpage/frontpage.css';
            </style>
            <div class="frontpage">
                <ul class="frontpage__card-list">
                    <li class="frontpage__card">
                        <div class="frontpage__card-image" style="background-image: url('/img/card1.png');"></div>
                        <div class="frontpage__card-content">
                            <h3 class="frontpage__card-title">Menu</h3>
                            <button class="frontpage__card-button" data-href="/menu">
                                <span class="frontpage__card-arrow">→</span>
                            </button>
                        </div>
                    </li>
                    <li class="frontpage__card">
                        <div class="frontpage__card-image" style="background-image: url('/img/card2.png');"></div>
                        <div class="frontpage__card-content">
                            <h3 class="frontpage__card-title">Reservation</h3>
                            <button class="frontpage__card-button" data-href="/reservation">
                                <span class="frontpage__card-arrow">→</span>
                            </button>
                        </div>
                    </li>
                    <li class="frontpage__card">
                        <div class="frontpage__card-image" style="background-image: url('/img/card3.png');"></div>
                        <div class="frontpage__card-content">
                            <h3 class="frontpage__card-title">About</h3>
                            <button class="frontpage__card-button" data-href="/about">
                                <span class="frontpage__card-arrow">→</span>
                            </button>
                        </div>
                    </li>
                </ul>
            </div>
        `;

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    setupEventListeners() {
        const navButtons = this.shadowRoot.querySelectorAll('.frontpage__card-button');
        navButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const href = event.currentTarget.dataset.href;
                if (href) {
                    this.router.go(href);
                }
            });
        });
    }

    disconnectedCallback() {
    }
}

if (!customElements.get('frontpage-component')) {
    customElements.define('frontpage-component', frontPage);
}

export default frontPage;