import { AppNavbar } from "../navbar/navbar.js";

export class AppLayout extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    const styles = document.createElement("style");
    this.root.appendChild(styles);
    (async () => {
      const res = await fetch("/frontend/blocks/layout/layout.css");
      styles.textContent = await res.text();
    })();
  }

  connectedCallback() {
    const tpl = document.getElementById("app-layout-template");
    this.root.appendChild(tpl.content.cloneNode(true));

    const left = this.root.querySelector(".layout__left");
    const navbar = document.createElement("app-navbar");
    left.appendChild(navbar);

    window.addEventListener("layout-change", e => this.updateLayout(e.detail));
    this.updateLayout(); // inicial
  }

  updateLayout(detail = {}) {
    const image = this.root.querySelector(".layout__image");
    const desc = this.root.querySelector(".layout__description");
    const container = this.root.querySelector(".layout");

    image.src = detail.src || "/frontend/images/frontpage/frontpage.jpg";
    desc.textContent = detail.desc || "SUSHI SENSATION";

    container.style.gridTemplateColumns = detail.frontpage ? "75% 25%" : "50% 50%";
  }
}

customElements.define("app-layout", AppLayout);
