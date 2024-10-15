"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import Pickup from "./Pickup";
import NumberofPersons from "./NumberofPersons";
import emailjs from "@emailjs/browser";
import BookingSuccessMsg from "./BookingSuccessMsg";
import { useRouter } from "next/navigation";
import { db } from "@/firebase";
import sendNotificationToAdmin from "@/app/utils/sendNotificationToAdmin";

export const TourBookingForm = ({ tour }) => {
  const form = useRef();
  const [totalPrice, setTotalPrice] = useState(0);
  const [adults, setAdults] = useState(0);
  const [kids, setKids] = useState(0);
  const [isMsgSent, setIsMsgSent] = useState(false);
  const [isPayingOnline, setIsPayingOnline] = useState(false);
  const [pricePerPerson, setPricePerPerson] = useState(0);
  const [orderNumber, setOrderNumber] = useState("");
  const [userFormData, setUserFormData] = useState(null);
  // Function to generate order number
  const generateOrderNumber = () => {
    return `ET-${Math.floor(100000 + Math.random() * 900000)}`; // Generate a random 6-digit order number prefixed with "ET"
  };

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

  const sendEmail = async (e) => {
    const formData = {
      email: form.current.email.value,
      phone_number: form.current.phone_number.value,
      name: form.current.name.value,
      tourName: tour.title,
      pickup_dropoff: form.current["pickup-dropoff"].value,
      pickup_date: form.current["pickup-date"].value,
      pickup_time: form.current["pickup-time"].value,
      pickup_location: form.current["pickup-location"].value,
      adults: adults,
      kids: kids,
      pay_online: isPayingOnline ? "Yes" : "No", // Pay online field
      price_per_person: pricePerPerson,
      total_price: totalPrice,
      reply_to: form.current.email.value,
    };
    setUserFormData(formData);
    try {
      // Send email using EmailJS
      await emailjs.send(
        "service_b3u5zxa",
        "template_rrfkk4m",
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
      console.error("Error creating booking:", error);
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
      onSubmit={(e) => {
        e.preventDefault();
        sendEmail();
      }}
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

      <Pickup tour={tour} setPricePerPerson={setPricePerPerson} />
      <NumberofPersons
        onAdultsChange={handleAdultsChange}
        onKidsChange={handleKidsChange}
      />

      <div className="mb-4">
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
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-300 focus:outline-none"
        />
      </div>
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

      <div className="flex items-center mb-4">
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
      <p className="text-gray-600 text-sm mb-4">
        (If you want to pay when you arrive, please leave the box unchecked)
      </p>

      <div className="text-lg mb-4">
        <p>
          Total Price: $
          <span id="total-price" className="font-semibold">
            {totalPrice}
          </span>
        </p>
      </div>

      <button
        type="submit"
        id="book-button"
        className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition duration-200"
      >
        Book Now
      </button>
    </form>
  ) : (
    <div>
      <BookingSuccessMsg
        formData={userFormData}
        orderNumber={orderNumber}
        tour={tour}
      />
    </div>
  );
};
