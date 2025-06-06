export const API = {
  url: "./data/products.json",
  getProducts: async () => {
    const response = await fetch(API.url);
    return await response.json();
  },
};
