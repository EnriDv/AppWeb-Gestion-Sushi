export class NotFound extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    connectedCallback() {
        this.setupEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    padding: 2rem;
                    text-align: center;
                    color: #EFE7D2;
                }
                
                .not-found__container {
                    max-width: 600px;
                    margin: 0 auto;
                }
                
                .not-found__title {
                    font-size: 6rem;
                    font-weight: 700;
                    margin: 0;
                    line-height: 1;
                    color: #E63946;
                    font-family: 'Forum', serif;
                }
                
                .not-found__subtitle {
                    font-size: 2rem;
                    margin: 1rem 0 2rem;
                    color: #EFE7D2;
                }
                
                .not-found__message {
                    font-size: 1.1rem;
                    margin-bottom: 2.5rem;
                    line-height: 1.6;
                    color: #CCC;
                }
                
                .not-found__button {
                    display: inline-block;
                    background-color: #E63946;
                    color: white;
                    padding: 0.8rem 2rem;
                    border-radius: 4px;
                    text-decoration: none;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    border: none;
                    cursor: pointer;
                    font-size: 1rem;
                }
                
                .not-found__button:hover {
                    background-color: #C1121F;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                }
                
                @media (max-width: 768px) {
                    .not-found__title {
                        font-size: 4rem;
                    }
                    
                    .not-found__subtitle {
                        font-size: 1.5rem;
                    }
                    
                    .not-found__message {
                        font-size: 1rem;
                    }
                }
            </style>
            <div class="not-found__container">
                <h1 class="not-found__title">404</h1>
                <h2 class="not-found__subtitle">Página no encontrada</h2>
                <p class="not-found__message">
                    Lo sentimos, la página que estás buscando no existe o ha sido movida.
                    Por favor, verifica la URL o regresa a la página de inicio.
                </p>
                <button class="not-found__button" id="goHome">Volver al Inicio</button>
            </div>
        `;
    }

    setupEventListeners() {
        const goHomeButton = this.shadowRoot.getElementById('goHome');
        if (goHomeButton) {
            goHomeButton.addEventListener('click', () => {
                window.history.pushState({}, '', '/');
                window.dispatchEvent(new PopStateEvent('popstate'));
            });
        }
    }
}

// Register the custom element
if (!customElements.get('not-found-component')) {
    customElements.define('not-found-component', NotFound);
}

export default NotFound;
