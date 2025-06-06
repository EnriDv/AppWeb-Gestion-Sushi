import { API } from "./API.js";

export async function loadData() {
  app.store.menu = await API.getProducts();
}

export async function getProductById(id) {
  if (app.store.menu == null) {
    await loadData();
  }
  for (let product of app.store.menu) {
    if (product.id == id) {
      return product;
    }
  }
  return null;
}
