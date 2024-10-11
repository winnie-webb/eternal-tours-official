import getPickupTitle from "@/app/utils/getPickupTitle";
import React from "react";

function Pickup({ tour, setPricePerPerson }) {
  const tourKeys = Object.keys(tour);
  const tourPickupKeys = tourKeys.filter(
    (key) =>
      key.includes("price") && key !== "priceLowest" && key !== "priceHighest"
  );

  return (
    <>
      <div className="mb-4">
        <label
          htmlFor="pickup-dropoff"
          className="block text-gray-700 font-semibold mb-2"
        >
          Pick Up &amp; Drop Off Area/City:
        </label>
        <select
          id="pickup-dropoff"
          name="pickup-dropoff"
          required
          onChange={(e) => {
            const currentPrice = parseInt(tour[e.target.value], 10);
            if (!isNaN(currentPrice)) {
              setPricePerPerson(currentPrice.toFixed(2));
            }
          }}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-300 focus:outline-none"
        >
          <option value="0">Choose pick up &amp; drop off</option>
          {tourPickupKeys.map((pickup, index) => {
            const pickupName = getPickupTitle(pickup);
            return (
              <option key={index} value={pickup}>
                {pickupName}
              </option>
            );
          })}
        </select>
      </div>

      <div className="mb-4">
        <label
          htmlFor="pickup-date"
          className="block text-gray-700 font-semibold mb-2"
        >
          Pickup Date of Tour:
        </label>
        <input
          type="date"
          id="pickup-date"
          name="pickup-date"
          required
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-300 focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="pickup-time"
          className="block text-gray-700 font-semibold mb-2"
        >
          Pickup Time of Tour:
        </label>
        <input
          type="time"
          id="pickup-time"
          name="pickup-time"
          required
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-300 focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="pickup-location"
          className="block text-gray-700 font-semibold mb-2"
        >
          Pickup &amp; Drop Off Resort Name OR AirBnb/Villa/Home Address OR
          Cruise Ship Port Name:
        </label>
        <input
          type="text"
          id="pickup-location"
          name="pickup-location"
          required
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-300 focus:outline-none"
        />
      </div>
    </>
  );
}

export default Pickup;
