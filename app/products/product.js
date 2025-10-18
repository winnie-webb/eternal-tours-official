// Firebase product functions for client-side usage
// Note: For SSR/server components, use the API routes directly

let cachedProducts = null;

// Fetch all products from Firebase API
export async function getAllProducts() {
  try {
    if (cachedProducts) {
      return cachedProducts;
    }

    const response = await fetch("/api/products", {
      cache: "no-store", // Ensure fresh data
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const products = await response.json();
    cachedProducts = products;
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    // Fallback to empty array or you could import the JSON as backup
    return [];
  }
}

// Get products by category
export async function getProductByCategory(category) {
  const products = await getAllProducts();
  return products.filter((product) => product.category === category);
}

// Search products
export async function searchProduct(input) {
  const products = await getAllProducts();
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

// Filter products by category
export async function filterProductByCategory(category) {
  const products = await getAllProducts();
  return products.filter((product) => product.category === category);
}

// Filter product by ID
export async function filterProductById(id) {
  try {
    const response = await fetch(`/api/products/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Product not found");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
}

// Clear cache (useful after product updates)
export function clearProductsCache() {
  cachedProducts = null;
}

// Legacy exports for backwards compatibility (deprecated)
import productsJson from "../data/products.json";
export { productsJson as products };
