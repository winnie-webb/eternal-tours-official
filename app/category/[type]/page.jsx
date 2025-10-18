import Category from "@/app/components/Category";
import React from "react";
import getTitleFromType from "../getTitleFromType";

// Server-side function to fetch products
async function getProducts() {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXTAUTH_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/products`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    // Fallback to JSON import for development/build time
    const { products } = await import("@/app/data/products.json");
    return products;
  }
}

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    const uniqueCategories = [
      ...new Set(products.map((product) => product.category)),
    ];
    return uniqueCategories.map((category) => ({
      type: category,
    }));
  } catch (error) {
    // Fallback to static categories
    return [
      { type: "mpt" },
      { type: "at" },
      { type: "cse" },
      { type: "ctp" },
      { type: "egt" },
      { type: "st" },
      { type: "abc" },
      { type: "edt" },
    ];
  }
}

async function page({ params }) {
  const { type } = params;
  const products = await getProducts();
  const filteredProducts = products.filter(
    (product) => product.category === type
  );

  return (
    <Category
      title={getTitleFromType(type)}
      data={filteredProducts}
      itemsPerPage={3}
    />
  );
}

export default page;
