import React from "react";

function NumberofPersons({ onAdultsChange, onKidsChange }) {
  const handleAdultsChange = (e) => {
    onAdultsChange(parseInt(e.target.value) || 0);
  };

  const handleKidsChange = (e) => {
    onKidsChange(parseInt(e.target.value) || 0);
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-semibold mb-2">
        Number of Persons:
      </label>

      <div className="flex justify-between mb-4">
        <div className="w-1/2 pr-2">
          <label htmlFor="persons-over-5" className="block text-gray-700">
            Adults (5 years+):
          </label>
          <input
            type="number"
            id="persons-over-5"
            name="persons-over-5"
            min="1"
            onChange={handleAdultsChange} // Trigger on change
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-300 focus:outline-none"
          />
        </div>

        <div className="w-1/2 pl-2">
          <label htmlFor="kids-under-5" className="block text-gray-700">
            Kids (under 5 years):
          </label>
          <input
            type="number"
            id="kids-under-5"
            name="kids-under-5"
            min="0"
            onChange={handleKidsChange} // Trigger on change
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-300 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

export default NumberofPersons;
