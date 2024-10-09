import products from "../data/products.json";
export { products };
export function getAllProducts() {
  return products;
}
export function getProductByCategory(category) {
  products.filter((product) => {
    return product.category === category;
  });
}
export function searchProduct(input) {
  const uniqueProducts = new Set();

  return products.filter((product) => {
    const titleLowerCase = product.title.toLowerCase();

    if (
      titleLowerCase.includes(input.toLowerCase()) &&
      !uniqueProducts.has(titleLowerCase)
    ) {
      uniqueProducts.add(titleLowerCase);
      return true;
    }

    return false;
  });
}
export function filterProductByCategory(category) {
  return products.filter((product) => product.category === category);
}
export function filterProductById(id) {
  return products.find((product) => product.id === id);
}
