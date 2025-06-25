// reservation.js
export class Reservation extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const template = document.createElement('template');
        template.innerHTML = `
            <link rel="stylesheet" href="styles.css"> <div class="reservation-container">
                <div class="left-section">
                    <img src="img/reservation-main.png" alt="Copas de vino en una mesa de restaurante">
                    <div class="overlay-content">
                        <h1>BOOK<br>A TABLE</h1>
                    </div>
                </div>
                <div class="right-section">
                    <div class="reservation-form-header">
                        <h2>RESERVATION</h2>
                        <p>Secure your spot at Qitchen, where exceptional sushi and a remarkable dining experience await.</p>
                    </div>

                    <form class="reservation-form">
                        <div class="form-group">
                            <input type="text" id="name" name="name" placeholder="Name" required>
                        </div>
                        <div class="form-group">
                            <input type="tel" id="phone" name="phone" placeholder="Phone Number" required>
                        </div>
                        <div class="form-group">
                            <input type="email" id="email" name="email" placeholder="Email" required>
                        </div>
                        <div class="form-group inline-fields">
                            <input type="number" id="guests" name="guests" placeholder="Guests" min="1" required>
                            <input type="date" id="date" name="date" placeholder="Date" required>
                            <input type="time" id="time" name="time" placeholder="Time" required>
                        </div>
                        <button type="submit" class="reserve-button">RESERVE</button>
                    </form>

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
        console.log('Reservation component added to the DOM');
        const form = this.shadowRoot.querySelector('.reservation-form');
        form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    disconnectedCallback() {
        console.log('Reservation component removed from the DOM');
        const form = this.shadowRoot.querySelector('.reservation-form');
        if (form) {
            form.removeEventListener('submit', this.handleSubmit.bind(this));
        }
    }

    handleSubmit(event) {
        event.preventDefault();

        const name = this.shadowRoot.getElementById('name').value;
        const phone = this.shadowRoot.getElementById('phone').value;
        const email = this.shadowRoot.getElementById('email').value;
        const guests = this.shadowRoot.getElementById('guests').value;
        const date = this.shadowRoot.getElementById('date').value;
        const time = this.shadowRoot.getElementById('time').value;

        console.log('Formulario de reserva enviado:', {
            name, phone, email, guests, date, time
        });

        alert('Reserva enviada! (Esto es solo una simulación)');
    }
}

customElements.define('reservation-component', Reservation);