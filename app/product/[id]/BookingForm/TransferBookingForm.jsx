"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import Pickup from "./Pickup";
import NumberofPersons from "./NumberofPersons";
import emailjs from "@emailjs/browser";
import BookingSuccessMsg from "./BookingSuccessMsg";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";
import sendNotificationToAdmin from "@/app/utils/sendNotificationToAdmin";
import BookingInfo from "./BookingInfo";

export const TransferBookingForm = ({ tour }) => {
  const form = useRef();
  const placeOfStay = useRef();
  const [totalPrice, setTotalPrice] = useState(0);
  const [adults, setAdults] = useState(0);
  const [kids, setKids] = useState(0);
  const [isMsgSent, setIsMsgSent] = useState(false);
  const [isPayingOnline, setIsPayingOnline] = useState(false);
  const [pricePerPerson, setPricePerPerson] = useState(0);
  const [userFormData, setUserFormData] = useState(null);
  const [orderNumber, setOrderNumber] = useState("");

  const transferTypeRef = useRef();
  const generateOrderNumber = () => {
    return `ET-${Math.floor(100000 + Math.random() * 900000)}`; // Generate a random 6-digit order number prefixed with "ET"
  };
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

  const sendEmail = async (e) => {
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
      pay_online: isPayingOnline ? "Yes" : "No",
      price_per_person: pricePerPerson,
      total_price: totalPrice,
      name: form.current.name.value,
    };
    setUserFormData(formData);
    try {
      // Send email using EmailJS
      await emailjs.send(
        "service_b3u5zxa",
        "template_7eif1gi",
        formData,
        "nxC4W-fiaC4DvJpPJ"
      );

      // Create booking in Firebase
      const orderNum = generateOrderNumber();
      setOrderNumber(orderNum);

      // Save the booking details to Firebase
      await addDoc(collection(db, "bookings"), {
        ...formData,
        orderNumber: orderNum,
        timestamp: serverTimestamp(), // Add timestamp for when the booking was made
        status: "pending", // Initial booking status
      });
      sendNotificationToAdmin();
      setIsMsgSent(true);
    } catch (error) {
      console.error("Error creating booking:", error.message);
      alert(
        "Error sending booking or email. Please try again or contact support."
      );
    }
  };

  return !isMsgSent ? (
    <form
      ref={form}
      id="booking-form"
      className="max-w-3xl mx-auto bg-white p-6 shadow-lg rounded-lg mt-8"
      onSubmit={sendEmail}
    >
      <BookingInfo></BookingInfo>
      <h2 className="text-3xl font-bold text-center mb-6 text-emerald-600">
        Booking Form
      </h2>

      {/* Transfer Type */}
      <div className="mb-2">
        <div className="mb-2">
          <label
            htmlFor="name"
            className="block text-gray-700 font-semibold mb-2"
          >
            Your Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-300 focus:outline-none"
          />
        </div>
        <label className="block text-gray-700 font-semibold mb-2">
          Transfer Type:
        </label>
        <select
          name="transferType"
          ref={transferTypeRef}
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
              if (transferTypeRef.current.value === "PickUpAndDropOff") {
                setPricePerPerson(currentPrice * 2);
              } else {
                setPricePerPerson(currentPrice);
              }
            }
          }}
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-300 focus:outline-none"
        >
          <option value="">Choose Place of Stay</option>
          {tourPlaceKeys.map((option) => (
            <option key={option} value={option}>
              {option.replace("Price", "")}
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
          required
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
          required
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
          required
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
          required
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
          required
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
          required
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
    <BookingSuccessMsg
      orderNumber={orderNumber}
      formData={userFormData}
      tour={tour}
    />
  );
};
