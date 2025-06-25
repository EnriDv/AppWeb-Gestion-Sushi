export class About extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const template = document.createElement('template');
        template.innerHTML = `
            <link rel="stylesheet" href="./styles.css">
            <div class="about-container">
                <div class="left-section">
                    <img src="img/about-main.png" alt="Chef espolvoreando sal">
                    <div class="overlay-content">
                        <h1>ABOUT</h1>
                    </div>
                </div>
                <div class="right-section">
                    <div class="top-content">
                        <div class="top-text">
                            <h2>SUSHI ARTISTRY REDEFINED</h2>
                            <p>Where culinary craftsmanship meets modern elegance. Indulge in the finest sushi, expertly curated to elevate your dining experience.</p>
                        </div>
                        <div class="bar-image">
                            <img src="img/art.png" alt="Interior del bar del restaurante">
                        </div>
                    </div>

                    <div class="achievements-grid">
                        <div class="achievement-card">
                            <div class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                            <h3>TRIP ADVISOR</h3>
                            <p>BEEF STEAK HOUSE<br>PRAGUE</p>
                        </div>
                        <div class="achievement-card">
                            <div class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                            <h3>MICHELIN GUIDE</h3>
                            <p>BEEF STEAK HOUSE<br>PRAGUE</p>
                        </div>
                        <div class="achievement-card">
                            <div class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                            <h3>STAR DINING</h3>
                            <p>BEEF STEAK HOUSE<br>PRAGUE</p>
                        </div>
                    </div>

                    <div class="bottom-content">
                        <div class="chefs-image">
                            <img src="img/story.png" alt="Chefs trabajando en la cocina">
                        </div>
                        <div class="our-story-text">
                            <h3>OUR STORY</h3>
                            <p>Founded with a passion for culinary excellence, Qitchen's journey began in the heart of Prague. Over years, it evolved into a haven for sushi enthusiasts, celebrated for its artful mastery and devotion to redefining gastronomy.</p>
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
        console.log('About component added to the DOM');
    }

    disconnectedCallback() {
        console.log('About component removed from the DOM');
    }
}

customElements.define('about-component', About);