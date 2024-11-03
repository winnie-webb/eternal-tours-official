import React from 'react'

const BookingInfo = () => {
  return (
<div className="bg-gray-100 p-4 rounded-md mb-6 text-sm text-gray-800">
        <p className="font-semibold text-gray-900">
          Important Booking Information:
        </p>
        <ul className="list-disc ml-5 mt-3 space-y-2">
          <li>
            <strong>Chartered/Private Taxi:</strong> Minimum booking cost for
            1-4 persons is four times the per-person rate.
          </li>
          <li>
            <strong>One Tour/Transfer Per Booking:</strong> Please book one tour
            or transfer at a time as each has a unique start time and date.
          </li>
          <li>
            <strong>Hotel Pickup/Drop-off:</strong> For guests staying at a
            hotel or resort, the pickup and drop-off point is the main lobby.
          </li>
          <li>
            <strong>Children Under 5:</strong> Travel free with an accompanying
            adult.
          </li>
        </ul>
      </div>  )
}

export default BookingInfo