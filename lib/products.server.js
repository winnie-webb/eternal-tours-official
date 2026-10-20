import { unstable_cache } from "next/cache";
import fallbackProducts from "@/app/data/products.json";

export const PRODUCTS_TAG = "products";

// Reads straight from Firestore (no HTTP round trip to our own domain) and
// caches the result; the product API routes call revalidateTag(PRODUCTS_TAG)
// after every write so admin edits show up immediately.
export const getProducts = unstable_cache(
  async () => {
    try {
      const { adminDb } = await import("@/firebaseAdmin");
      const snapshot = await adminDb.collection("products").get();
      return snapshot.docs.map((doc) => {
        // Timestamps aren't serialisable into client components
        const { createdAt, updatedAt, ...data } = doc.data();
        return { id: doc.id, ...data };
      });
    } catch (error) {
      console.error("Falling back to bundled products:", error.message);
      return fallbackProducts;
    }
  },
  ["products"],
  { tags: [PRODUCTS_TAG], revalidate: 300 }
);

export async function getProduct(id) {
  const products = await getProducts();
  return products.find((p) => p.id === id) || null;
}

export async function getProductsByCategory(category) {
  const products = await getProducts();
  return products.filter((p) => p.category === category);
}
