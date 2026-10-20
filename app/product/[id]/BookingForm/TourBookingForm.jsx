"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import Pickup from "./Pickup";
import NumberofPersons from "./NumberofPersons";
import BookingSuccessMsg from "./BookingSuccessMsg";
import BookingInfo from "./BookingInfo";
import FareSummary from "./FareSummary";
import { ContactFields, PaymentChoice, Step, formatDate, formatTime, generateOrderNumber } from "./FormParts";
import { db } from "@/firebase";
import sendNotificationToAdmin from "@/app/utils/sendNotificationToAdmin";

export const TourBookingForm = ({ tour }) => {
  const form = useRef();
  const [totalPrice, setTotalPrice] = useState(0);
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [isMsgSent, setIsMsgSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPayingOnline, setIsPayingOnline] = useState(false);
  const [pricePerPerson, setPricePerPerson] = useState(0);
  const [orderNumber, setOrderNumber] = useState("");
  const [userFormData, setUserFormData] = useState(null);
  const [picked, setPicked] = useState({ area: "", date: "", time: "" });

  // Private vehicle: 1–4 adults pay for four seats.
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

  const sendEmail = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const orderNum = generateOrderNumber();
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
      pay_online: isPayingOnline ? "Yes" : "No",
      price_per_person: pricePerPerson,
      total_price: totalPrice,
      reply_to: form.current.email.value,
    };
    setUserFormData(formData);
    try {
      await emailjs.send(
        "service_b3u5zxa",
        "template_rrfkk4m",
        { ...formData, order_number: orderNum },
        "nxC4W-fiaC4DvJpPJ"
      );

      setOrderNumber(orderNum);
      await addDoc(collection(db, "bookings"), {
        ...formData,
        orderNumber: orderNum,
        timestamp: serverTimestamp(),
        status: "pending",
      });
      sendNotificationToAdmin();
      setIsMsgSent(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Error sending booking or email. Please try again or contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isMsgSent) {
    return <BookingSuccessMsg formData={userFormData} orderNumber={orderNumber} tour={tour} />;
  }

  return (
    <form
      ref={form}
      id="booking-form"
      onSubmit={(e) => {
        e.preventDefault();
        sendEmail();
      }}
      className="grid items-start gap-6 lg:grid-cols-[1fr_380px]"
    >
      <div className="space-y-6">
        <Step n={1} title="Your trip">
          <Pickup
            tour={tour}
            setPricePerPerson={setPricePerPerson}
            onChange={(key, value) => setPicked((p) => ({ ...p, [key]: value }))}
          />
        </Step>
        <Step n={2} title="Travellers">
          <NumberofPersons adults={adults} kids={kids} onAdultsChange={setAdults} onKidsChange={setKids} />
        </Step>
        <Step n={3} title="Your details">
          <div className="space-y-6">
            <ContactFields />
            <PaymentChoice isPayingOnline={isPayingOnline} setIsPayingOnline={setIsPayingOnline} />
          </div>
        </Step>
        <BookingInfo />
      </div>

      <FareSummary
        tour={tour}
        adults={adults}
        pricePerPerson={pricePerPerson}
        totalPrice={totalPrice}
        submitting={isSubmitting}
        submitLabel="Book this tour"
        rows={[
          { label: "Pick-up area", value: picked.area, wide: true },
          { label: "Date", value: formatDate(picked.date) },
          { label: "Time", value: formatTime(picked.time) },
          { label: "Adults", value: String(adults) },
          { label: "Kids", value: String(kids) },
        ]}
      />
    </form>
  );
};
