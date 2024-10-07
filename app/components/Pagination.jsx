"use client";
import { useState } from "react";

const Pagination = ({ data, itemsPerPage, renderItem }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div>
      {/* Render the current page data */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {currentData.map(renderItem)}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          className="bg-gray-400 text-white py-2 px-4 rounded disabled:opacity-50"
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span className="text-lg">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="bg-gray-400 text-white py-2 px-4 rounded disabled:opacity-50"
          onClick={nextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
