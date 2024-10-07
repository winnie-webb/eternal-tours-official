"use client";
import React from "react"
import { TourBookingForm } from "./TourBookingForm";
import { TransferBookingForm } from "./TransferBookingForm";

function BookingForm({ tour }) {
  const isTransfer = tour.category !== "at" 
 return isTransfer ? (
  
    <TourBookingForm tour={tour} />
 ): <TransferBookingForm/>
}

export default BookingForm;
