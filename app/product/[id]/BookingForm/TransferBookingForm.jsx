"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import NumberofPersons from "./NumberofPersons";
import BookingSuccessMsg from "./BookingSuccessMsg";
import BookingInfo from "./BookingInfo";
import FareSummary from "./FareSummary";
import { ContactFields, PaymentChoice, Step, formatDate, formatTime, generateOrderNumber } from "./FormParts";
import { db } from "@/firebase";
import sendNotificationToAdmin from "@/app/utils/sendNotificationToAdmin";
import { priceKeys } from "@/lib/catalog";

const TRANSFER_TYPES = [
  { value: "PickUp", title: "Arriving", body: "Airport → your stay" },
  { value: "DropOff", title: "Departing", body: "Your stay → airport" },
  { value: "PickUpAndDropOff", title: "Round trip", body: "Both ways · 2× fare" },
];

export const TransferBookingForm = ({ tour }) => {
  const form = useRef();
  const [totalPrice, setTotalPrice] = useState(0);
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [isMsgSent, setIsMsgSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPayingOnline, setIsPayingOnline] = useState(false);
  const [pricePerPerson, setPricePerPerson] = useState(0);
  const [userFormData, setUserFormData] = useState(null);
  const [orderNumber, setOrderNumber] = useState("");
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
  const tourPlaceKeys = priceKeys(tour);

  const { transferType, placeOfStay } = transferDetails;
  const hasArrival = transferType === "PickUp" || transferType === "PickUpAndDropOff";
  const hasDeparture = transferType === "DropOff" || transferType === "PickUpAndDropOff";

  // Round trips pay the one-way fare twice.
  useEffect(() => {
    const currentPrice = parseInt(tour[placeOfStay], 10);
    if (isNaN(currentPrice)) return;
    setPricePerPerson(transferType === "PickUpAndDropOff" ? currentPrice * 2 : currentPrice);
  }, [tour, placeOfStay, transferType]);

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

  const set = (name, value) => setTransferDetails((prev) => ({ ...prev, [name]: value }));
  const bind = (name) => ({
    name,
    value: transferDetails[name],
    onChange: (e) => set(name, e.target.value),
  });

  const sendEmail = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!transferType) {
      alert("Please choose whether you're arriving, departing or both.");
      return;
    }
    setIsSubmitting(true);
    const orderNum = generateOrderNumber();
    const formData = {
      tourName: tour.title,
      email: form.current.email.value,
      phone_number: form.current.phone_number.value,
      pickup_dropoff: transferDetails.pickupDropoff,
      // One-way departures have no arrival leg, so fall back to the departure
      pickup_date: transferDetails.arrivalDate || transferDetails.departureDate,
      pickup_time: transferDetails.pickupTime || transferDetails.arrivalTime,
      transfer_type: transferType,
      place_of_stay: placeOfStay,
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
      await emailjs.send(
        "service_b3u5zxa",
        "template_7eif1gi",
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
      console.error("Error creating booking:", error.message);
      alert("Error sending booking or email. Please try again or contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isMsgSent) {
    return <BookingSuccessMsg orderNumber={orderNumber} formData={userFormData} tour={tour} />;
  }

  const typeTitle = TRANSFER_TYPES.find((t) => t.value === transferType)?.title;

  return (
    <form ref={form} id="booking-form" onSubmit={sendEmail} className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <Step n={1} title="Your transfer">
          <fieldset>
            <legend className="field-label">Which way?</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {TRANSFER_TYPES.map((t) => (
                <label
                  key={t.value}
                  className={`cursor-pointer rounded-2xl border p-4 transition ${
                    transferType === t.value
                      ? "border-jett-500 bg-jett-50 ring-4 ring-jett-100"
                      : "border-sand-300 bg-white hover:border-ink/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="transferType"
                    value={t.value}
                    checked={transferType === t.value}
                    onChange={() => set("transferType", t.value)}
                    className="sr-only"
                  />
                  <span className="block font-semibold text-ink">{t.title}</span>
                  <span className="block font-mono text-xs text-ink-muted">{t.body}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="placeOfStay" className="field-label">Where are you staying?</label>
              <select id="placeOfStay" required className="field cursor-pointer" {...bind("placeOfStay")}>
                <option value="" disabled>Choose your resort or area</option>
                {tourPlaceKeys.map((option) => (
                  <option key={option} value={option}>
                    {option.replace("Price", "").trim()} — ${parseInt(tour[option], 10)} pp
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="pickup-dropoff" className="field-label">Hotel name or address</label>
              <input
                type="text"
                id="pickup-dropoff"
                required
                placeholder="e.g. Hyatt Ziva, or the villa's street address"
                className="field"
                {...bind("pickupDropoff")}
              />
            </div>
          </div>
        </Step>

        {transferType && (
          <Step n={2} title="Flights">
            <div className="grid gap-5 sm:grid-cols-2">
              {hasArrival && (
                <>
                  <p className="eyebrow sm:col-span-2">Arrival · Sangster International</p>
                  <div>
                    <label htmlFor="arrival-date" className="field-label">Arrival date</label>
                    <input type="date" id="arrival-date" required className="field" {...bind("arrivalDate")} />
                  </div>
                  <div>
                    <label htmlFor="arrival-time" className="field-label">Landing time</label>
                    <input type="time" id="arrival-time" required className="field" {...bind("arrivalTime")} />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="airlines-name" className="field-label">Airline &amp; flight number</label>
                    <input type="text" id="airlines-name" required placeholder="e.g. JetBlue B6 1234" className="field" {...bind("airlinesName")} />
                  </div>
                </>
              )}
              {hasArrival && hasDeparture && <div className="border-t border-dashed border-sand-300 sm:col-span-2" />}
              {hasDeparture && (
                <>
                  <p className="eyebrow sm:col-span-2">Departure · Sangster International</p>
                  <div>
                    <label htmlFor="departure-date" className="field-label">Departure date</label>
                    <input type="date" id="departure-date" required className="field" {...bind("departureDate")} />
                  </div>
                  <div>
                    <label htmlFor="departure-time" className="field-label">Flight time</label>
                    <input type="time" id="departure-time" required className="field" {...bind("departureTime")} />
                  </div>
                  <div>
                    <label htmlFor="departure-airlines" className="field-label">Airline &amp; flight number</label>
                    <input type="text" id="departure-airlines" required placeholder="e.g. American AA 912" className="field" {...bind("departureAirlines")} />
                  </div>
                  <div>
                    <label htmlFor="pickup-time" className="field-label">Pick-up time from your stay</label>
                    <input type="time" id="pickup-time" required className="field" {...bind("pickupTime")} />
                    <p className="field-hint">Most guests leave 3 hours before an international flight.</p>
                  </div>
                </>
              )}
            </div>
          </Step>
        )}

        <Step n={transferType ? 3 : 2} title="Travellers">
          <NumberofPersons adults={adults} kids={kids} onAdultsChange={setAdults} onKidsChange={setKids} />
        </Step>
        <Step n={transferType ? 4 : 3} title="Your details">
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
        submitLabel="Book this transfer"
        rows={[
          { label: "Trip", value: typeTitle },
          { label: "Travellers", value: `${adults} adult${adults === 1 ? "" : "s"}${kids ? ` · ${kids} kid${kids === 1 ? "" : "s"}` : ""}` },
          { label: "Staying at", value: placeOfStay.replace("Price", "").trim(), wide: true },
          ...(hasArrival
            ? [{ label: "Lands", value: [formatDate(transferDetails.arrivalDate), formatTime(transferDetails.arrivalTime)].filter(Boolean).join(" · ") }]
            : []),
          ...(hasDeparture
            ? [{ label: "Pick-up", value: [formatDate(transferDetails.departureDate), formatTime(transferDetails.pickupTime)].filter(Boolean).join(" · ") }]
            : []),
        ]}
      />
    </form>
  );
};
