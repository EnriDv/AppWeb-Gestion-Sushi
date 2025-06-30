import { authService } from '../../services/auth.service.js';
import { reservationService } from '../../services/reservation.service.js';

export class Reservation extends HTMLElement {
    showMessage(msg, type = 'info') {
        let msgBox = this.shadowRoot.getElementById('reservation-msg');
        if (!msgBox) {
            msgBox = document.createElement('div');
            msgBox.id = 'reservation-msg';
            msgBox.style.margin = '1rem 0';
            msgBox.style.textAlign = 'center';
            this.shadowRoot.querySelector('.right-section').insertBefore(msgBox, this.shadowRoot.querySelector('.reservation-form, form'));
        }
        msgBox.textContent = msg;
        msgBox.style.color = type === 'success' ? 'green' : (type === 'error' ? 'red' : 'var(--text-color)');
    }
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.shadowRoot.querySelector('form').addEventListener('submit', this.handleSubmit.bind(this));
        window.addEventListener('auth-change', this.handleAuthChange.bind(this));
    }

    disconnectedCallback() {
        window.removeEventListener('auth-change', this.handleAuthChange.bind(this));
        const form = this.shadowRoot.querySelector('form');
        if (form) {
            form.removeEventListener('submit', this.handleSubmit.bind(this));
        }
    }

    handleAuthChange() {
        this.render();
        this.shadowRoot.querySelector('form').addEventListener('submit', this.handleSubmit.bind(this));
    }

    render() {
        const isAuthenticated = authService.isAuthenticated();
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/blocks/reservation/reservation.css">
            <div class="reservation-container">
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
                    ${isAuthenticated ? this.renderAuthenticatedForm() : this.renderGuestForm()}
                    <div class="footer-links">
                        <a href="#">Licensing</a>
                        <a href="#">Styleguide</a>
                    </div>
                </div>
            </div>
        `;
    }

    renderGuestForm() {
        return `
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
        `;
    }

    renderAuthenticatedForm() {
        const user = authService.getUser();
        return `
            <form id="reservation-form">
                <div class="form-group inline-fields">
                    <input type="number" id="guests" name="guests" placeholder="Guests" min="1" required>
                    <input type="date" id="date" name="date" placeholder="Date" required>
                    <input type="time" id="time" name="time" placeholder="Time" required>
                </div>
                <button type="submit" class="reserve-button">RESERVE</button>
            </form>
        `;
    }

    async handleSubmit(event) {
        event.preventDefault();
        const isAuthenticated = authService.isAuthenticated();
        let reservationData = {};

        try {
            if (isAuthenticated) {
                // Usuario autenticado: obtener datos del perfil
                const user = await authService.fetchUserData();
                if (!user) {
                    throw new Error('No se pudieron cargar los datos del usuario');
                }

                reservationData = {
                    name: user.name || '',
                    email: user.email || '',
                    phone_number: user.phone_number || '',
                    number_of_guests: parseInt(this.shadowRoot.getElementById('guests').value, 10) || 1,
                    reservation_date: this.shadowRoot.getElementById('date').value,
                    reservation_time: this.shadowRoot.getElementById('time').value,
                    special_requests: this.shadowRoot.getElementById('special-requests')?.value || ''
                };
            } else {
                // Usuario no autenticado: obtener datos del formulario
                reservationData = {
                    name: this.shadowRoot.getElementById('name').value,
                    email: this.shadowRoot.getElementById('email').value,
                    phone_number: this.shadowRoot.getElementById('phone').value,
                    number_of_guests: parseInt(this.shadowRoot.getElementById('guests').value, 10) || 1,
                    reservation_date: this.shadowRoot.getElementById('date').value,
                    reservation_time: this.shadowRoot.getElementById('time').value,
                    special_requests: this.shadowRoot.getElementById('special-requests')?.value || ''
                };
            }

            // Obtener el token si existe
            const token = authService.getToken ? authService.getToken() : null;
            
            // Enviar la reserva
            const result = await reservationService.createReservation(reservationData, token);
            
            if (result && result.id) {
                this.showMessage('¡Reserva realizada con éxito!', 'success');
                this.shadowRoot.querySelector('form').reset();
            } else {
                throw new Error('Error al crear la reserva');
            }
            
        } catch (error) {
            console.error('Error al procesar la reserva:', error);
            this.showMessage('Error al crear la reserva: ' + error.message, 'error');
        }
    }
}

customElements.define('reservation-component', Reservation);