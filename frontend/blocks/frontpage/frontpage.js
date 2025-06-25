export class frontPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const template = document.createElement('template');
        template.innerHTML = `
            <link rel="stylesheet" href="./styles.css">
            <div class="main-body">
                <div class="main-image" style="background-image: url(img/main.png);"> <h3>SUSHI <br> SENSATION</h3>
                    <div class="social-list">
                        <button class="social-button">🟦</button>
                        <button class="social-button">🐤</button>
                        <button class="social-button">📷</button>
                    </div>
                </div>
                <ul class="main-card-list">
                    <li class="main-card" style="background-image: url(img/card1.png);"> <div class="main-card-info">
                            <h3>Menu</h3>
                            <button class="main-card-info-button" data-href="/menu">→</button> </div>
                    </li>
                    <li class="main-card" style="background-image: url(img/card2.png);"> <div class="main-card-info">
                            <h3>Reservation</h3>
                            <button class="main-card-info-button" data-href="/reservation">→</button> </div>
                    </li>
                    <li class="main-card" style="background-image: url(img/card3.png);"> <div class="main-card-info">
                            <h3>About</h3>
                            <button class="main-card-info-button" data-href="/about">→</button> </div>
                    </li>
                </ul>
            </div>
        `;

        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        console.log('FrontPage component added to the DOM');

        const navButtons = this.shadowRoot.querySelectorAll('.main-card-info-button');

        navButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const href = event.target.dataset.href;
                if (href) {
                    Router.go(href);
                }
            });
        });
    }

    disconnectedCallback() {
        console.log('FrontPage component removed from the DOM');
        const navButtons = this.shadowRoot.querySelectorAll('.main-card-info-button');
        navButtons.forEach(button => {
        });
    }
}

customElements.define('frontpage-component', frontPage);