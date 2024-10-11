"use client";
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { auth, db } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Notifications from "./Notifications";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login"); // Redirect to login page if not authenticated
      }
    });

    // Cleanup the subscription
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    // Listen for real-time updates
    const bookingsCollection = collection(db, "bookings");
    const unsubscribe = onSnapshot(bookingsCollection, (snapshot) => {
      const bookingsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(bookingsList);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    const bookingDocRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingDocRef, {
      status: newStatus,
    });
    toast.success(`Booking status updated to ${newStatus}`);
  };

  return (
    <div className="container mx-auto p-4">
      <Notifications></Notifications>
      <h1 className="text-2xl font-bold mb-4">Bookings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="p-4 bg-white shadow-md rounded-md border cursor-pointer"
            onClick={() => setSelectedBooking(booking)}
          >
            <h2 className="text-lg font-semibold">
              Order #{booking.orderNumber}
            </h2>
            <p>
              <strong>Name:</strong> {booking.name}
            </p>
            <p>
              <strong>Status:</strong> {booking.status}
            </p>
          </div>
        ))}
      </div>

      {selectedBooking && (
        <div className="mt-6 p-4 bg-white shadow-lg rounded-md">
          <h2 className="text-xl font-bold">Booking Details</h2>
          <p>
            <strong>Order Number:</strong> {selectedBooking.orderNumber}
          </p>
          <p>
            <strong>Name:</strong> {selectedBooking.name}
          </p>
          <p>
            <strong>Email:</strong> {selectedBooking.email}
          </p>
          <p>
            <strong>Phone:</strong> {selectedBooking.phone_number}
          </p>
          <p>
            <strong>Tour:</strong> {selectedBooking.tourName}
          </p>
          <p>
            <strong>Pickup Location:</strong> {selectedBooking.pickup_location}
          </p>
          <p>
            <strong>Adults:</strong> {selectedBooking.adults}
          </p>
          <p>
            <strong>Kids:</strong> {selectedBooking.kids}
          </p>
          <p>
            <strong>Total Price:</strong> ${selectedBooking.total_price}
          </p>
          <p>
            <strong>Status:</strong> {selectedBooking.status}
          </p>

          <div className="mt-4">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Update Status:
            </label>
            <select
              id="status"
              className="w-full border border-gray-300 p-2 rounded-md mt-1"
              value={selectedBooking.status}
              onChange={(e) =>
                handleStatusUpdate(selectedBooking.id, e.target.value)
              }
            >
              <option value="Pending">Pending</option>
              <option value="Payment Confirmed">Payment Confirmed</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
