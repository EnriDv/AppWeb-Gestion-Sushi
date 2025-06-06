import { addToCart } from "../../services/Order.js";

export default class ProductItem extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const template = document.getElementById("product-card-template");
    const content = template.content.cloneNode(true);

    this.appendChild(content);

    const product = JSON.parse(this.dataset.product);
    this.querySelector("h3").textContent = product.name;
    this.querySelector("img").src = `${product.imageUrl}`;
    this.querySelector("p.product-card__description").textContent = `${product.description}`;
    this.querySelector("p.product-card__price").textContent = `${product.price}`;

    this.querySelector(".product-card").addEventListener("click", (event) => {
      if (event.target.tagName.toLowerCase() == "button") {
        addToCart(product.id);
      } else {
        app.router.go(`/products/${product.id}`);
      }
      event.preventDefault();
    });
  }
}

customElements.define("product-item", ProductItem);
