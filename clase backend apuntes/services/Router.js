const Router = {
  init: () => {
    document.querySelectorAll("a.nav__link").forEach((a) => {
      a.addEventListener("click", (event) => {
        event.preventDefault();
        const href = event.target.getAttribute("href");
        Router.go(href);
      });
    });
    window.addEventListener("popstate", (event) => {
      Router.go(event.state.route, false);
    });
    Router.go(location.pathname);
  },

  go: (route, addToHistory = true) => {
    if (addToHistory) {
      history.pushState({ route }, "", route);
    }
    let pageElement = null;
    switch (route) {
      case "/":
        pageElement = document.createElement("menu-page");
        break;
      case "/products":
        pageElement = document.createElement("menu-page");
        break;
      case "/restaurants":
        pageElement = document.createElement("h1");
        pageElement.textContent = "Restaurants Page";
        break;
      case "/order":
        pageElement = document.createElement("h1");
        pageElement.textContent = "Order Page";
        break;
      default:
        if (route.startsWith("/products/")) {
          pageElement = document.createElement("h2");

          const paramId = route.substring(route.lastIndexOf("/") + 1);
          pageElement.textContent = "Product detail page: " + String(paramId);

          pageElement.dataset.productId = paramId;
        }
        break;
    }
    if (pageElement) {
      function changePage() {
        let currentPage = document.querySelector("main").firstElementChild;
        if (currentPage) {
          currentPage.remove();
          document.querySelector("main").appendChild(pageElement);
        } else {
          document.querySelector("main").appendChild(pageElement);
        }
      }
      if (document.startViewTransition) {
        document.startViewTransition(() => changePage());
      } else {
        changePage();
      }
    }

    window.scrollY = 0;
    window.scrollX = 0;
  },
};

export default Router;
