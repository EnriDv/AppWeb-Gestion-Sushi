export class AppModal extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    const styles = document.createElement("style");
    this.root.appendChild(styles);
    (async () => {
      const res = await fetch("/blocks/Modal/Modal.css");
      styles.textContent = await res.text();
    })();
  }
  connectedCallback() {
    const tpl = document.getElementById("app-modal-template");
    this.root.appendChild(tpl.content.cloneNode(true));
    document.addEventListener("toggle-menu", () => this.toggle());
  }
  toggle() {
    this.root.querySelector(".modal").classList.toggle("modal--open");
  }
}
customElements.define("app-modal", AppModal);
