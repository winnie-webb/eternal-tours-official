import Category from "@/app/components/Category";
import { filterProductByCategory, products } from "@/app/products/product";
import React from "react";
import getTitleFromType from "../getTitleFromType";
export function generateStaticParams() {
  return products.products.map((product) => ({
    type: product.category, // Correctly returning the id in an object
  }));
}
function page({ params }) {
  const { type } = params;
  return (
    <Category
      title={getTitleFromType(type)}
      data={filterProductByCategory(type)}
      itemsPerPage={3}
    ></Category>
  );
}

export default page;
