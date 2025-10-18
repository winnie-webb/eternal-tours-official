"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useCallback, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { searchProduct } from "../products/product";

function SearchBar() {
  const [isSearching, setIsSearching] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search function
  const performSearch = useCallback(async (term) => {
    if (!term.trim()) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchProduct(term);
      setProducts(results);
    } catch (error) {
      console.error("Search error:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, performSearch]);

  // Handle onBlur with a slight delay
  const handleBlur = () => {
    setTimeout(() => {
      setIsSearching(false);
    }, 200); // Small delay to allow time for clicks
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setProducts([]);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 relative w-full">
      <input
        id="search-input"
        onFocus={() => setIsSearching(true)}
        onBlur={handleBlur}
        onChange={handleInputChange}
        value={searchTerm}
        className="shadow-md w-full border-white rounded-full outline-none p-3 border-[3px] focus:border-[3px] focus:border-orange-300 transition-all duration-200"
        placeholder="Search tours..."
      />

      {/* Search Results Dropdown */}
      <div
        className={`${
          isSearching ? "flex" : "hidden"
        } w-full p-4 absolute shadow-md gap-y-4 flex-col z-10 bg-white font-bold max-h-96 overflow-y-auto`}
        onMouseDown={(e) => e.preventDefault()} // Prevents hiding when interacting with results
      >
        {isLoading ? (
          <div className="text-center text-gray-500">Searching...</div>
        ) : products.length === 0 ? (
          searchTerm.trim() === "" ? (
            "Search for any tour available in Jamaica"
          ) : (
            "No tours found for your search"
          )
        ) : (
          products.map((product) => {
            return (
              <Link
                href={`/product/${product.id}`}
                key={product.id}
                onClick={() => {
                  setIsSearching(false);
                  setSearchTerm("");
                  setProducts([]);
                }}
              >
                <div className="flex items-center gap-x-3 hover:bg-gray-50 p-2 rounded transition-colors">
                  <Image
                    alt={`Image of ${product.title}`}
                    width={50}
                    height={50}
                    src={`/${product.id.split("-").shift()}/${product.id}.${
                      product.imageExtension || "webp"
                    }`}
                    className="rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm">{product.title}</p>
                    <p className="text-emerald-600 font-bold">{`$${product.priceLowest}`}</p>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      <FaSearch className="absolute right-4 top-4 text-primary text-xl cursor-pointer" />
    </div>
  );
}

export default SearchBar;
