"use client";
import React, { useEffect, useState } from "react";
import { collection, doc, updateDoc, onSnapshot } from "firebase/firestore";
import toast from "react-hot-toast";
import { auth, db, messaging, onMessage } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        console.log("Foreground message received: ", payload);
        const { title, body } = payload.notification;

        if (Notification.permission === "granted") {
          new Notification(title, {
            body: body,
          });
        }
      });
    }
  }, []);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login"); // Redirect to login page if not authenticated
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
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
    await updateDoc(bookingDocRef, { status: newStatus });
    toast.success(`Booking status updated to ${newStatus}`);
  };

  const handleCancelBooking = async (bookingId) => {
    const bookingDocRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingDocRef, { status: "Cancelled" });
    toast.error("Booking has been cancelled.");
    setIsModalOpen(false);
  };

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6">Bookings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="p-6 bg-white shadow-lg rounded-lg hover:bg-indigo-50 transition cursor-pointer"
            onClick={() => openModal(booking)}
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Order #{booking.orderNumber}
            </h2>
            <p className="text-gray-600">
              <strong>Name:</strong> {booking.name}
            </p>
            <p className="text-gray-600">
              <strong>Status:</strong> {booking.status}
            </p>
          </div>
        ))}
      </div>

      {/* Modal for Booking Details */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Booking Details
                  </Dialog.Title>

                  {selectedBooking && (
                    <>
                      <div className="mt-4">
                        <p>
                          <strong>Order Number:</strong>{" "}
                          {selectedBooking.orderNumber}
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
                          <strong>Pickup Location:</strong>{" "}
                          {selectedBooking.pickup_location}
                        </p>
                        <p>
                          <strong>Adults:</strong> {selectedBooking.adults}
                        </p>
                        <p>
                          <strong>Kids:</strong> {selectedBooking.kids}
                        </p>
                        <p>
                          <strong>Total Price:</strong> $
                          {selectedBooking.total_price}
                        </p>
                        <p>
                          <strong>Status:</strong> {selectedBooking.status}
                        </p>
                      </div>

                      <div className="mt-6">
                        <label
                          htmlFor="status"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Update Status:
                        </label>
                        <select
                          id="status"
                          className="w-full border border-gray-300 p-2 rounded-md mt-2"
                          value={selectedBooking.status}
                          onChange={(e) =>
                            handleStatusUpdate(
                              selectedBooking.id,
                              e.target.value
                            )
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="Payment Confirmed">
                            Payment Confirmed
                          </option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>

                      <div className="mt-6 flex justify-between">
                        <button
                          className="px-4 py-2 bg-red-500 text-white rounded-md"
                          onClick={() =>
                            handleCancelBooking(selectedBooking.id)
                          }
                        >
                          Cancel Booking
                        </button>
                        <button
                          className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                          onClick={closeModal}
                        >
                          Close
                        </button>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default BookingsPage;
