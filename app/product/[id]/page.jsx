import { filterProductById, products } from "@/app/products/product";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import BookingForm from "./BookingForm/BookingForm";
export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id, // Correctly returning the id in an object
  }));
}
function page({ params }) {
  const { id } = params;
  const tour = filterProductById(id);
  return (
    <section className="p-4 md:p-10 w-[99%] xl:w-[80%] 2xl:w-[60%]  mx-auto">
      <div className="relative flex flex-row md:flex-row cursor-pointer">
        <div className="relative h-48 w-full md:h-60 xl:h-80 flex-1 overflow-hidden">
          <Image
            className="object-fill object-center"
            src={`/${tour.id.split("-").shift()}/${tour.id}.webp`}
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
