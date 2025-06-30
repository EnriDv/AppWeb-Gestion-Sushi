// contact.js
export class Contact extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const template = document.createElement('template');
        template.innerHTML = `
            <link rel="stylesheet" href="/blocks/contact/contact.css"> <div class="contact-container">
                <div class="left-section">
                    <img src="img/contact-main.png" alt="Plato de comida del restaurante">
                    <div class="overlay-content">
                        <h1>CONTACT</h1>
                    </div>
                </div>
                <div class="right-section">
                    <div class="top-row">
                        <div class="opening-hours">
                            <h2>OPENING HOURS</h2>
                            <ul>
                                <li><span>Monday</span> <span>16:00 - 22:30</span></li>
                                <li><span>Tuesday</span> <span>16:00 - 22:30</span></li>
                                <li><span>Wednesday</span> <span>16:00 - 22:30</span></li>
                                <li><span>Thursday</span> <span>16:00 - 22:30</span></li>
                                <li><span>Friday</span> <span>16:00 - 22:30</span></li>
                                <li><span>Saturday & Sunday</span> <span>16:00 - 22:30</span></li>
                            </ul>
                        </div>
                        <div class="gallery">
                            <img src="img/dish2.png" alt="Plato 1">
                            <img src="img/dish2.png" alt="Plato 2">
                            <img src="img/dish2.png" alt="Plato 3">
                            <img src="img/dish2.png" alt="Plato 4">
                            <img src="img/dish2.png" alt="Plato 5">
                            <img src="img/dish2.png" alt="Plato 6">
                        </div>
                    </div>

                    <div class="bottom-row">
                        <div class="map-section">
                            <img src="img/map.png" alt="Mapa de la ubicación del restaurante" class="map-image">
                            <a href="#" class="show-route-btn">SHOW ROUTE &rarr;</a>
                        </div>
                        <div class="get-in-touch">
                            <h2>GET IN TOUCH</h2>
                            <div class="contact-info-grid">
                                <span class="label">ADDRESS</span>
                                <span class="value">23, Greenfield Avenue,<br>Prague, 05-100</span>

                                <span class="label">PHONE</span>
                                <span class="value">+49 1234 567890</span>

                                <span class="label">EMAIL</span>
                                <span class="value">email@example.com</span>

                                <span class="label">FOLLOW</span>
                                <span class="value social-icons">
                                    <a href="#"><img src="./assets/icons/instagram.svg" alt="Instagram"></a>
                                    <a href="#"><img src="./assets/icons/facebook.svg" alt="Facebook"></a>
                                    <a href="#"><img src="./assets/icons/twitter.svg" alt="Twitter"></a>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="footer-links">
                        <a href="#">Licensing</a>
                        <a href="#">Styleguide</a>
                    </div>
                </div>
            </div>
        `;

        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        console.log('Contact component added to the DOM');
    }

    disconnectedCallback() {
        console.log('Contact component removed from the DOM');
    }
}

customElements.define('contact-component', Contact);