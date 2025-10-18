import Image from "next/image";
import Link from "next/link";
import React from "react";
import BookingForm from "./BookingForm/BookingForm";

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

// Server-side function to fetch single product
async function getProduct(id) {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXTAUTH_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/products/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    // Fallback to finding in local JSON
    const { products } = await import("@/app/data/products.json");
    return products.find((product) => product.id === id);
  }
}

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((product) => ({
      id: product.id,
    }));
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [];
  }
}

async function page({ params }) {
  const { id } = params;
  const tour = await getProduct(id);

  if (!tour) {
    return (
      <section className="p-4 md:p-10 w-[99%] xl:w-[80%] 2xl:w-[60%] mx-auto">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Tour not found
          </h1>
          <Link href="/" className="text-emerald-600 hover:underline">
            Return to home page
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="p-4 md:p-10 w-[99%] xl:w-[80%] 2xl:w-[60%]  mx-auto">
      <div className="relative flex flex-row md:flex-row cursor-pointer">
        <div className="relative h-48 w-full md:h-60 xl:h-80 flex-1 overflow-hidden">
          <Image
            className="object-fill object-center"
            src={`/${tour.id.split("-").shift()}/${tour.id}.${
              tour.imageExtension || "webp"
            }`}
            alt={tour.title}
            fill={true}
          />
        </div>
        <div className="mt-2 p-2 flex-1">
          <h3 className="text-base  font-bold">{tour.title}</h3>
          <p className="my-1 text-emerald-600 font-semibold">
            Starting at ${tour.priceLowest}
          </p>
          <p className=" font-semibold">(Per Person)</p>
        </div>
      </div>
      <BookingForm tour={tour}></BookingForm>
    </section>
  );
}

export default page;
