// registration.js
export class Registration extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const template = document.createElement('template');
        template.innerHTML = `
            <link rel="stylesheet" href="styles.css"> <div class="registration-container">
                <div class="left-section">
                    <img src="img/registration-main.png" alt="Copas de vino en una mesa de restaurante">
                    <div class="overlay-content">
                        <h1>REGISTRATION</h1>
                    </div>
                </div>
                <div class="right-section">
                    <div class="registration-form-header">
                        <h2>REGISTRATION</h2>
                    </div>

                    <form class="registration-form">
                        <div class="form-group">
                            <input type="text" id="name" name="name" placeholder="Name" required>
                        </div>
                        <div class="form-group">
                            <input type="tel" id="phone" name="phone" placeholder="Phone Number" required>
                        </div>
                        <div class="form-group">
                            <input type="email" id="email" name="email" placeholder="Email" required>
                        </div>
                        <div class="form-group">
                            <input type="password" id="password" name="password" placeholder="Password" required>
                        </div>
                        <div class="form-group">
                            <input type="password" id="confirm-password" name="confirm-password" placeholder="Confirm Password" required>
                        </div>
                        <div class="form-group">
                            <input type="text" id="address" name="address" placeholder="Address">
                        </div>
                        <button type="submit" class="register-button">REGISTER</button>
                        <a href="#/login" class="login-link">Go to login instead</a>
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
        console.log('Registration component added to the DOM');
        const form = this.shadowRoot.querySelector('.registration-form');
        form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    disconnectedCallback() {
        console.log('Registration component removed from the DOM');
        const form = this.shadowRoot.querySelector('.registration-form');
        if (form) {
            form.removeEventListener('submit', this.handleSubmit.bind(this));
        }
    }

    handleSubmit(event) {
        event.preventDefault();

        const name = this.shadowRoot.getElementById('name').value;
        const phone = this.shadowRoot.getElementById('phone').value;
        const email = this.shadowRoot.getElementById('email').value;
        const password = this.shadowRoot.getElementById('password').value;
        const confirmPassword = this.shadowRoot.getElementById('confirm-password').value;
        const address = this.shadowRoot.getElementById('address').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        console.log('Formulario de registro enviado:', {
            name, phone, email, password, address
        });

        alert('Registro enviado! (Esto es solo una simulación)');
    }
}

customElements.define('registration-component', Registration);