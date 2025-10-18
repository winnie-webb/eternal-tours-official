"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaAngleLeft, FaAngleRight, FaHeart } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import Link from "next/link";

const Category = ({
  title,
  description = "",
  data,
  itemsPerPage = 4,
  categoryFilter = null,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from Firebase API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // If data prop is provided (from static data), use it
        if (data && Array.isArray(data)) {
          setProducts(data);
          setLoading(false);
          return;
        }

        // Otherwise fetch from Firebase API
        const response = await fetch("/api/products", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        let fetchedProducts = await response.json();

        // Filter by category if categoryFilter is provided
        if (categoryFilter) {
          fetchedProducts = fetchedProducts.filter(
            (product) => product.category === categoryFilter
          );
        }

        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        // Fallback to provided data or empty array
        setProducts(data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [data, categoryFilter]);

  // Calculate the total number of pages
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Slice the data array to show only the items for the current page
  const paginatedData = products
    .sort((a, b) => parseFloat(a.priceLowest) - parseFloat(b.priceLowest))
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Change page with animation
  const changePage = (pageNumber) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= totalPages &&
      pageNumber !== currentPage
    ) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentPage(pageNumber);
        setIsAnimating(false);
      }, 300);
    }
  };

  if (loading) {
    return (
      <section className="relative p-6 w-[90%] xl:w-[85%] 2xl:w-[70%] mx-auto mt-12 mb-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent mb-4">
            {title}
          </h2>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading products...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative p-6 w-[90%] xl:w-[85%] 2xl:w-[70%] mx-auto mt-12 mb-12">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-4">
          <HiSparkles className="text-2xl text-yellow-500 animate-pulse" />
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
            {title}
          </h2>
          <HiSparkles className="text-2xl text-yellow-500 animate-pulse" />
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl text-gray-300 mb-4">🏝️</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No Tours Available
          </h3>
          <p className="text-gray-500">
            Check back soon for exciting new adventures!
          </p>
        </div>
      ) : (
        <>
          {/* Carousel Container */}
          <div className="relative">
            {/* Navigation Arrows */}
            {totalPages > 1 && (
              <>
                {/* Left Arrow */}
                <button
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-20 w-14 h-14 flex items-center justify-center rounded-full bg-white shadow-xl hover:shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-600 hover:text-white hover:scale-110 group"
                  aria-label="Previous tours"
                >
                  <FaAngleLeft className="text-xl transition-transform duration-300 group-hover:-translate-x-1" />
                </button>

                {/* Right Arrow */}
                <button
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-20 w-14 h-14 flex items-center justify-center rounded-full bg-white shadow-xl hover:shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-600 hover:text-white hover:scale-110 group"
                  aria-label="Next tours"
                >
                  <FaAngleRight className="text-xl transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </>
            )}

            {/* Cards Grid */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-${itemsPerPage} gap-8 transition-all duration-500 ${
                isAnimating
                  ? "opacity-0 transform scale-95"
                  : "opacity-100 transform scale-100"
              }`}
            >
              {paginatedData.map((tour, index) => {
                return (
                  <Link
                    href={`/product/${tour.id}`}
                    key={tour.id}
                    className="group relative block"
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform transition-all duration-500 hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-emerald-500">
                      {/* Badge */}
                      {index === 0 && currentPage === 1 && (
                        <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                          BEST VALUE
                        </div>
                      )}

                      {/* Favorite Button */}
                      <button className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 group/btn">
                        <FaHeart className="text-gray-400 group-hover/btn:text-red-500 transition-colors duration-300" />
                      </button>

                      {/* Image Container */}
                      <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-[1]"></div>
                        <Image
                          className="object-cover object-center transform transition-transform duration-700 group-hover:scale-110"
                          src={`/${tour.id.split("-").shift()}/${tour.id}.${
                            tour.imageExtension
                          }`}
                          alt={tour.title}
                          fill={true}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />

                        {/* Overlay gradient on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[2]"></div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        {/* Title */}
                        <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors duration-300">
                          {tour.title}
                        </h3>

                        {/* Price Section */}
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-2xl font-bold text-emerald-600">
                              ${tour.priceLowest}
                            </p>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">
                              Per Person
                            </p>
                          </div>

                          {/* CTA Arrow */}
                          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                            <FaAngleRight className="text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Dot Indicators */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-12 gap-3">
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNum = index + 1;
                const isActive = currentPage === pageNum;

                return (
                  <button
                    key={index}
                    onClick={() => changePage(pageNum)}
                    className={`transition-all duration-300 rounded-full ${
                      isActive
                        ? "w-12 h-3 bg-gradient-to-r from-emerald-500 to-teal-600"
                        : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to page ${pageNum}`}
                  >
                    <span className="sr-only">Page {pageNum}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Page Counter */}
          {totalPages > 1 && (
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
                {Math.min(currentPage * itemsPerPage, products.length)} of{" "}
                {products.length} tours
              </p>
            </div>
          )}
        </>
      )}

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default Category;
