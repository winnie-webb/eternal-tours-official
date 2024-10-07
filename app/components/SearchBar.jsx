"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { searchProduct } from "../products/product";

function SearchBar() {
  const [isSearching, setIsSearching] = useState(false);
  const [products, setProducts] = useState([]);

  // Handle onBlur with a slight delay
  const handleBlur = () => {
    setTimeout(() => {
      setIsSearching(false);
    }, 200); // Small delay to allow time for clicks
  };

  return (
    <div className="flex-1 relative w-full">
      <input
        id="search-input"
        onFocus={() => setIsSearching(true)}
        onBlur={handleBlur} // Handle blur with delay
        onChange={(e) => setProducts(searchProduct(e.target.value))}
        className="shadow-md w-full border-white rounded-full outline-none p-3 border-[3px] focus:border-[3px] focus:border-orange-300 transition-all duration-200"
        placeholder="Search tours..."
      />

      {/* Search Results Dropdown */}
      <div
        className={`${
          isSearching ? "flex" : "hidden"
        } w-full p-4 absolute shadow-md gap-y-4 flex-col z-10 bg-white font-bold`}
        onMouseDown={(e) => e.preventDefault()} // Prevents hiding when interacting with results
      >
        {products.length === 0
          ? "Search for any tour available in Jamaica"
          : products.map((product) => {
              return (
                <Link
                  href={`/product/${product.id}`}
                  key={` ${Math.random().toString(36).substr(2, 9)}`}
                >
                  <div className="flex items-center gap-x-3">
                    <Image
                      alt={`Image of ${product.title}`}
                      width={50}
                      height={50}
                      src={`/${product.id.split("-").shift()}/${
                        product.id
                      }.webp`}
                    />
                    <p>{product.title}</p>
                    <p>{`$${product.priceLowest}`}</p>
                  </div>
                </Link>
              );
            })}
      </div>

      <FaSearch className="absolute right-4 top-4 text-primary text-xl cursor-pointer" />
    </div>
  );
}

export default SearchBar;
