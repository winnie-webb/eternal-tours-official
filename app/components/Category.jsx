"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Link from "next/link";

const Category = ({ title, description = "", data, itemsPerPage = 4 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the total number of pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Slice the data array to show only the items for the current page
  const paginatedData = data.sort((a,b)=>a.priceLowest-b.priceLowest).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Change page
  const changePage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <section className="p-4 w-[90%] xl:w-[80%] 2xl:w-[60%]  mx-auto mt-8">
      <h2 className="text-3xl font-bold text-center mb-6">{title}</h2>
      <p className="text-lg text-center mb-8">{description}</p>
      {/* Grid layout for responsive display */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-${itemsPerPage} gap-6`}
      >
        {paginatedData.map((tour, index) => (
          <Link
            href={`/product/${tour.id}`}
            key={index}
            className="relative hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="relative h-64 w-full overflow-hidden ">
              <Image
                className="object-fill object-center"
                src={`/${tour.id.split("-").shift()}/${tour.id}.webp`}
                alt={tour.title}
                fill={true}
              />
            </div>
            <div className="mt-2 p-2 ">
              <h3 className="text-base  font-bold">{tour.title}</h3>
              <p className=" my-1 text-xl text-emerald-600 font-semibold">
                ${tour.priceLowest}
              </p>
              <p className="font-semibold">(Per Person)</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:opacity-50"
        >
          <FaAngleLeft />
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => changePage(index + 1)}
            className={`px-4 py-2 mx-1 rounded-md ${
              currentPage === index + 1
                ? "bg-emerald-600 text-white"
                : "bg-gray-300 text-gray-800 hover:bg-gray-400"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:opacity-50"
        >
          <FaAngleRight />
        </button>
      </div>
    </section>
  );
};

export default Category;
