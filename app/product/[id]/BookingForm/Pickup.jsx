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
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-300 focus:outline-none"
        >
          <option value="0">Choose pick up &amp; drop off</option>
          {tourPickupKeys.map((pickup, index) => {
            let pickupName = "";
            if (pickup.toLowerCase().includes("falmouth")) {
              pickupName = "Falmouth & Duncans (Trelawny)";
            } else if (pickup.toLowerCase().includes("lucea")) {
              pickupName = "Lucea (Grand Palladium, Hanover)";
            } else if (pickup.toLowerCase().includes("mobay")) {
              pickupName = "Montego Bay (St. James)";
            } else if (pickup.toLowerCase().includes("negril")) {
              pickupName = "Negril (Westmoreland)";
            } else if (pickup.toLowerCase().includes("ochi")) {
              pickupName = "Ocho Rios (St. Ann)";
            } else if (pickup.toLowerCase().includes("runaway")) {
              pickupName = "Runaway Bay (St. Ann)";
            } else if (pickup.toLowerCase().includes("ksp")) {
              pickupName = "Kingston, Spanish Town & Portmore";
            } else if (pickup.toLowerCase().includes("mandeville")) {
              pickupName = "Mandeville (Manchester)";
            } else if (pickup.toLowerCase().includes("portantonio")) {
              pickupName = "Port Antonio (Portland)";
            } else if (pickup.toLowerCase().includes("treasurebeach")) {
              pickupName = "Treasure Beach (St.Elizabeth)";
            } else if (pickup.toLowerCase().includes("breathless")) {
              pickupName = "Breathless, Montego Bay";
            } else if (pickup.toLowerCase().includes("sunset")) {
              pickupName = "Sunset Beach Resort";
            } else if (pickup.toLowerCase().includes("secrets")) {
              pickupName = "Secrets St.James & Wild Orchid, Montego Bay";
            } else {
              pickupName = "Dm us for more locations.";
            }
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
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-300 focus:outline-none"
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
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-300 focus:outline-none"
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
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-300 focus:outline-none"
        />
      </div>
    </>
  );
}

export default Pickup;
