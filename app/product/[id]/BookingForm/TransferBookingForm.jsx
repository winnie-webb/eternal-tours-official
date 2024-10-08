"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import Pickup from "./Pickup";
import NumberofPersons from "./NumberofPersons";
import emailjs from "@emailjs/browser";
import BookingSuccessMsg from "./BookingSuccessMsg";
import { useRouter } from "next/navigation";

export const TransferBookingForm = ({ tour }) => {
  const form = useRef();
  const placeOfStay = useRef();
  const [totalPrice, setTotalPrice] = useState(0);
  const [adults, setAdults] = useState(0);
  const [kids, setKids] = useState(0);
  const [isMsgSent, setIsMsgSent] = useState(false);
  const [isPayingOnline, setIsPayingOnline] = useState(false);
  const [pricePerPerson, setPricePerPerson] = useState(0);
  const [transferDetails, setTransferDetails] = useState({
    transferType: "",
    placeOfStay: "",
    arrivalDate: "",
    arrivalTime: "",
    airlinesName: "",
    departureDate: "",
    departureTime: "",
    pickupTime: "",
    departureAirlines: "",
    pickupDropoff: "",
  });
  const tourKeys = Object.keys(tour);
  const tourPlaceKeys = tourKeys.filter(
    (key) =>
      key.toLowerCase().includes("price") &&
      key !== "priceLowest" &&
      key !== "priceHighest"
  );
  const router = useRouter();

  const calculateTotalPrice = useCallback(() => {
    const total = adults * pricePerPerson;
    if (adults <= 4 && adults !== 0) {
      setTotalPrice(pricePerPerson * 4);
    } else {
      setTotalPrice(total.toFixed(2));
    }
  }, [adults, pricePerPerson]);

  useEffect(() => {
    calculateTotalPrice();
  }, [adults, calculateTotalPrice, pricePerPerson]);

  const handleAdultsChange = (value) => {
    setAdults(value);
  };

  const handleKidsChange = (value) => {
    setKids(value);
  };

  const handleTransferDetailsChange = (name, value) => {
    setTransferDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendEmail = (e) => {
    e.preventDefault();
    const formData = {
      tourName: tour.title,
      email: form.current.email.value,
      phone_number: form.current.phone_number.value,
      pickup_dropoff: transferDetails.pickupDropoff,
      pickup_date: transferDetails.arrivalDate,
      pickup_time: transferDetails.pickupTime,
      transfer_type: transferDetails.transferType,
      place_of_stay: transferDetails.placeOfStay,
      arrival_time: transferDetails.arrivalTime,
      airlines_name: transferDetails.airlinesName,
      departure_date: transferDetails.departureDate,
      departure_time: transferDetails.departureTime,
      departure_airlines_name: transferDetails.departureAirlines,
      adults: adults,
      kids: kids,
      pay_online: isPayingOnline ? "Yes" : "No", // Pay online field
      price_per_person: pricePerPerson,
      total_price: totalPrice,
    };

    emailjs
      .send(
        "service_b3u5zxa",
        "template_7eif1gi",
        formData,
        "nxC4W-fiaC4DvJpPJ"
      )
      .then(
        () => {
          setIsMsgSent(true);
        },
        (error) => {
          console.log("FAILED...", error.text);
          alert(
            "Error sending email. Please try to dm us on Facebook messenger, Instagram, or Whatsapp"
          );
        }
      );

    if (isPayingOnline) {
      return router.push(`/pay?payment=${totalPrice}`);
    }
  };

  return !isMsgSent ? (
    <form
      ref={form}
      id="booking-form"
      className="max-w-3xl mx-auto bg-white p-6 shadow-lg rounded-lg mt-8"
      onSubmit={sendEmail}
    >
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
      </div>
      <h2 className="text-3xl font-bold text-center mb-6 text-emerald-600">
        Booking Form
      </h2>

      {/* Transfer Type */}
      <div className="mb-2">
        <label className="block text-gray-700 font-semibold mb-2">
          Transfer Type:
        </label>
        <select
          name="transferType"
          onChange={(e) => {
            handleTransferDetailsChange(e.target.name, e.target.value);
            const placeOfStayValue = placeOfStay.current.value;
            const currentPrice = parseInt(tour[placeOfStayValue], 10);
            if (!isNaN(currentPrice)) {
              if (e.target.value === "PickUpAndDropOff") {
                setPricePerPerson(currentPrice * 2);
              } else {
                setPricePerPerson(currentPrice);
              }
            }
          }}
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-300 focus:outline-none"
        >
          <option value="">Choose Transfer Type</option>
          <option value="DropOff">
            Drop off {"( Place of Stay to Airport)"}
          </option>
          <option value="PickUp">Pick Up {"(Airport to Place of Stay)"}</option>
          <option value="PickUpAndDropOff">
            Pickup & Drop off {"(Round Trip)"}
          </option>
        </select>
      </div>

      {/* Place Of Stay */}
      <div className="mb-2">
        <label className="block text-gray-700 font-semibold mb-2">
          Pick Place Of Stay:
        </label>
        <select
          name="placeOfStay"
          ref={placeOfStay}
          onChange={(e) => {
            handleTransferDetailsChange(e.target.name, e.target.value);
            const currentPrice = parseInt(tour[e.target.value], 10);
            if (!isNaN(currentPrice)) {
              setPricePerPerson(currentPrice.toFixed(2));
            }
          }}
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-300 focus:outline-none"
        >
          <option value="">Choose Place of Stay</option>
          {tourPlaceKeys.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Arrival Date */}
      <div className="mb-2">
        <label
          htmlFor="arrival-date"
          className="block text-gray-700 font-semibold mb-2"
        >
          Date of Arrival:
        </label>
        <input
          type="date"
          id="arrival-date"
          name="arrivalDate"
          onChange={(e) =>
            handleTransferDetailsChange(e.target.name, e.target.value)
          }
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-300 focus:outline-none"
          required
        />
      </div>

      {/* Airlines Arrival Time */}
      <div className="mb-2">
        <label
          htmlFor="arrival-time"
          className="block text-gray-700 font-semibold mb-2"
        >
          Airlines Arrival Time:
        </label>
        <input
          type="time"
          id="arrival-time"
          name="arrivalTime"
          placeholder="hh:mm AM/PM format"
          onChange={(e) =>
            handleTransferDetailsChange(e.target.name, e.target.value)
          }
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-300 focus:outline-none"
        />
      </div>

      {/* Arrival Airlines Name & Number */}
      <div className="mb-2">
        <label
          htmlFor="airlines-name"
          className="block text-gray-700 font-semibold mb-2"
        >
          Arrival Airlines Name & Number:
        </label>
        <input
          type="text"
          id="airlines-name"
          name="airlinesName"
          placeholder="NAME & XYZ1234"
          onChange={(e) =>
            handleTransferDetailsChange(e.target.name, e.target.value)
          }
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-300 focus:outline-none"
        />
      </div>

      {/* Departure Date */}
      <div className="mb-2">
        <label
          htmlFor="departure-date"
          className="block text-gray-700 font-semibold mb-2"
        >
          Date Of Departure:
        </label>
        <input
          type="date"
          id="departure-date"
          name="departureDate"
          onChange={(e) =>
            handleTransferDetailsChange(e.target.name, e.target.value)
          }
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-300 focus:outline-none"
          required
        />
      </div>

      {/* Departure Airlines Time */}
      <div className="mb-2">
        <label
          htmlFor="departure-time"
          className="block text-gray-700 font-semibold mb-2"
        >
          Departure Airlines Time:
        </label>
        <input
          type="time"
          id="departure-time"
          name="departureTime"
          placeholder="hh:mm AM/PM format"
          onChange={(e) =>
            handleTransferDetailsChange(e.target.name, e.target.value)
          }
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-300 focus:outline-none"
        />
      </div>

      {/* Pickup Time */}
      <div className="mb-2">
        <label
          htmlFor="pickup-time"
          className="block text-gray-700 font-semibold mb-2"
        >
          Pickup Time from Resort/Villa/AirBnB/Home:
        </label>
        <input
          type="time"
          id="pickup-time"
          name="pickupTime"
          onChange={(e) =>
            handleTransferDetailsChange(e.target.name, e.target.value)
          }
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-300 focus:outline-none"
        />
      </div>

      {/* Departure Airlines Name & Number */}
      <div className="mb-2">
        <label
          htmlFor="departure-airlines"
          className="block text-gray-700 font-semibold mb-2"
        >
          Departure Airlines Name & Number:
        </label>
        <input
          type="text"
          id="departure-airlines"
          name="departureAirlines"
          placeholder="NAME & XYZ1234"
          onChange={(e) =>
            handleTransferDetailsChange(e.target.name, e.target.value)
          }
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-300 focus:outline-none"
        />
      </div>

      {/* Pickup/Drop-off Location */}
      <div className="mb-2">
        <label
          htmlFor="pickup-dropoff"
          className="block text-gray-700 font-semibold mb-2"
        >
          Pickup / Drop-off Location:
        </label>
        <input
          type="text"
          id="pickup-dropoff"
          name="pickupDropoff"
          onChange={(e) =>
            handleTransferDetailsChange(e.target.name, e.target.value)
          }
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-300 focus:outline-none"
        />
      </div>
      <NumberofPersons
        onAdultsChange={handleAdultsChange}
        onKidsChange={handleKidsChange}
      ></NumberofPersons>
      <div className="mb-2">
        <label
          htmlFor="email"
          className="block text-gray-700 font-semibold mb-2"
        >
          Email Address:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-300 focus:outline-none"
        />
      </div>
      <div className="mb-2">
        <label
          htmlFor="phone_number"
          className="block text-gray-700 font-semibold mb-2"
        >
          Phone Number:
        </label>
        <input
          type="text"
          id="phone_number"
          name="phone_number"
          required
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-300 focus:outline-none"
        />
      </div>
      <div className="flex items-center mb-2">
        <input
          type="checkbox"
          id="pay-online"
          name="pay-online"
          className="mr-2"
          onChange={(e) => {
            setIsPayingOnline(e.target.checked);
          }}
        />

        <label htmlFor="pay-online" className="text-gray-700 font-semibold">
          Do you want to pay online?
        </label>
      </div>
      <p className="text-gray-600 text-sm mb-2">
        (If you want to pay when you arrive, please leave the box unchecked)
      </p>
      <div className="text-lg mb-2">
        <p>
          Price Per Person: $
          <span id="price-per-person" className="font-semibold">
            {pricePerPerson}
          </span>
        </p>
        <p>
          Total Price: $
          <span id="total-price" className="font-semibold">
            {totalPrice}{" "}
          </span>
        </p>
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="bg-emerald-600 text-white font-semibold py-2 px-4 rounded hover:bg-emerald-500"
        >
          Confirm Booking
        </button>
      </div>
    </form>
  ) : (
    <BookingSuccessMsg />
  );
};
