export class FrontPage extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    const styles = document.createElement("style");
    this.root.appendChild(styles);
    (async () => {
      const res = await fetch("/frontend/blocks/frontpage/frontpage.css");
      styles.textContent = await res.text();
    })();
  }

  connectedCallback() {
    const tpl = document.getElementById("front-page-template");
    this.root.appendChild(tpl.content.cloneNode(true));

    // Actualizar layout con imagen y texto oculto (título va en la imagen)
    window.dispatchEvent(new CustomEvent("layout-change", {
      detail: {
        src: "/frontend/images/frontpage/frontpage.jpg",
        desc: "",
        frontpage: true
      }
    }));
  }
}

customElements.define("front-page", FrontPage);
