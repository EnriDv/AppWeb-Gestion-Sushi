export class AppNavbar extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    const styles = document.createElement("style");
    this.root.appendChild(styles);
    (async () => {
      const res = await fetch("/frontend/blocks/navbar/navbar.css");
      styles.textContent = await res.text();
    })();
  }

  connectedCallback() {
    const tpl = document.getElementById("app-navbar-template");
    this.root.appendChild(tpl.content.cloneNode(true));

    this.root
      .querySelector(".navbar__menu-button")
      .addEventListener("click", () => window.dispatchEvent(new Event("toggle-menu")));
  }
}

customElements.define("app-navbar", AppNavbar);
