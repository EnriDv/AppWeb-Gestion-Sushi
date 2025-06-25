// services/Router.js (Versión con las nuevas rutas añadidas)

export const Router = {
    init() {
        document.body.addEventListener("click", e => {
            const link = e.target.closest('a[href^="/"]');
            if (link && !link.hasAttribute('target')) {
                e.preventDefault();
                Router.go(link.getAttribute("href"));
            }
        });

        window.addEventListener("popstate", e => {
            Router.go(e.state?.route || '/', false);
        });

        Router.go(location.pathname, false);
    },

    go(route, addToHistory = true) {
        if (addToHistory) {
            history.pushState({ route }, "", route);
        }

        let pageElement = null;
        let pageTagName = null;

        switch (route) {
            case "/":
            case "/home":
                pageTagName = "frontpage-component";
                break;
            case "/menu":
                pageTagName = "menu-component";
                break;
            case "/blog":
                pageTagName = "blog-component";
                break;
            case "/about":
                pageTagName = "about-component";
                break;
            
            case "/registration": 
                pageTagName = "registration-component";
                break;
            case "/cart": 
                pageTagName = "cart-component";
                break;
            case "/reservation":
                pageTagName = "reservation-component";
                break;
            case "/contact":
                pageTagName = "contact-component";
                break;
            case "/blog-post":
                pageTagName = "blog-post-component";
                break;
            default:
                if (route.startsWith("/blog-post")) {
                    pageTagName = "blog-post-component";
                } else {
                    pageTagName = "h1"; 
                }
                break;
        }

        if (pageTagName) {
            if (pageTagName.includes('-')) {
                if (customElements.get(pageTagName)) {
                    pageElement = document.createElement(pageTagName);
                } else {
                    console.error(`Error de Router: El componente <${pageTagName}> no está definido. Revisa index.html o el script del componente.`);
                    pageElement = document.createElement("h1");
                    pageElement.textContent = "Error: No se pudo cargar el componente de la página.";
                }
            } else {
                pageElement = document.createElement(pageTagName);
            }
        }

        if (pageElement) {
            if (pageElement.tagName === 'H1' && !pageElement.textContent) {
                pageElement.textContent = "404 - Página no encontrada";
            }
            
            const main = document.querySelector("main");
            if (main) {
                main.innerHTML = "";
                main.appendChild(pageElement);
                window.scrollTo(0, 0);
            } else {
                console.error("Error crítico: No se encontró el elemento <main> en el DOM.");
            }
        }
    }
};