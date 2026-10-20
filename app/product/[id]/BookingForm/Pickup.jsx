import getPickupTitle from "@/app/utils/getPickupTitle";
import React from "react";
import { priceKeys } from "@/lib/catalog";

// Field names are read by TourBookingForm via form.current[...] — keep them.
function Pickup({ tour, setPricePerPerson, onChange }) {
  const tourPickupKeys = priceKeys(tour);
  const report = (key, value) => onChange?.(key, value);
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label htmlFor="pickup-dropoff" className="field-label">
          Pick-up &amp; drop-off area
        </label>
        <select
          id="pickup-dropoff"
          name="pickup-dropoff"
          required
          defaultValue=""
          onChange={(e) => {
            const currentPrice = parseInt(tour[e.target.value], 10);
            if (!isNaN(currentPrice)) {
              setPricePerPerson(currentPrice.toFixed(2));
            }
            report("area", getPickupTitle(e.target.value));
          }}
          className="field cursor-pointer"
        >
          <option value="" disabled>
            Choose where we&apos;ll collect you
          </option>
          {tourPickupKeys.map((pickup) => (
            <option key={pickup} value={pickup}>
              {getPickupTitle(pickup)} — ${parseInt(tour[pickup], 10)} pp
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="pickup-date" className="field-label">
          Tour date
        </label>
        <input
          type="date"
          id="pickup-date"
          name="pickup-date"
          min={today}
          required
          onChange={(e) => report("date", e.target.value)}
          className="field"
        />
      </div>

      <div>
        <label htmlFor="pickup-time" className="field-label">
          Pick-up time
        </label>
        <input
          type="time"
          id="pickup-time"
          name="pickup-time"
          required
          onChange={(e) => report("time", e.target.value)}
          className="field"
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="pickup-location" className="field-label">
          Where exactly?
        </label>
        <input
          type="text"
          id="pickup-location"
          name="pickup-location"
          required
          placeholder="Resort name, Airbnb / villa address, or cruise port"
          className="field"
        />
      </div>
    </div>
  );
}

export default Pickup;
