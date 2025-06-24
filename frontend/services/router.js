// services/Router.js
const Router = {
  init: () => {
    // 1) Click en cualquier elemento con data-route
    document.querySelectorAll('[data-route]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        const route = e.currentTarget.dataset.route;
        // dispatch navigate para que index.js actualice layout y luego Router.go
        window.dispatchEvent(new CustomEvent('navigate', { detail: { route } }));
      });
    });

    // 2) Evento popstate (Back/Forward)
    window.addEventListener('popstate', e => {
      const route = e.state?.route || location.pathname;
      window.dispatchEvent(new CustomEvent('navigate', { detail: { route } }));
    });

    // 3) Cuando alguien dispara “navigate”, ejecutamos go()
    window.addEventListener('navigate', e => {
      Router.go(e.detail.route);
    });

    // 4) Al cargar la página, disparar la primera navegación
    window.dispatchEvent(new CustomEvent('navigate', { detail: { route: location.pathname } }));
  },

  go: (route, addToHistory = true) => {
    // Empuja al historial (salvo que venga de popstate)
    if (addToHistory) {
      history.pushState({ route }, '', route);
    }

    // Elige el componente según la ruta
    let pageElement;
    switch (route) {
      case '/':
        pageElement = document.createElement('front-page');
        break;
      case '/menu':
        pageElement = document.createElement('menu-page');
        break;
      case '/about':
        pageElement = document.createElement('about-page');
        break;
      case '/book':
        pageElement = document.createElement('book-page');
        break;
      default:
        // ruta desconocida → frontpage o podrías crear un 404-page
        pageElement = document.createElement('front-page');
    }

    // Monta el componente dentro del <main id="page-content">
    const outlet = document.getElementById('page-content');
    outlet.innerHTML = '';
    outlet.appendChild(pageElement);

    // Scroll al top
    window.scrollTo(0, 0);
  },
};

export default Router;
