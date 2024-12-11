"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FaCcDiscover, FaCcMastercard, FaCcVisa } from "react-icons/fa";
import { SiAmericanexpress } from "react-icons/si";

const PaymentComponent = () => {
  const [amount, setAmount] = useState("");
  const paymentParams = useSearchParams();
  const queryAmount = paymentParams.get("payment");

  useEffect(() => {
    if (queryAmount) {
      setAmount(queryAmount);
    }
  }, [queryAmount]);

  return (
    <section className="min-h-[100vh] p-4 md:p-10 bg-gray-50">
      <h1 className="text-3xl mb-10 text-center">
        {queryAmount
          ? `The total price of your booking is $${amount} USD`
          : "Make a Payment"}
      </h1>
      <div className="space-y-8 text-lg">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-emerald-600">
            Zelle Direct Transfer
          </h2>
          <p>
            Make your payment directly to our Zelle account:{" "}
            <strong>eternaltours876@gmail.com</strong>. Please include your
            order number in the transaction notes for reference.
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-emerald-600">
            Pay by Cash on Arrival
          </h2>
          <p>
            Prefer to pay later? No problem! You can choose to pay in cash when
            you arrive for your service.
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-emerald-600">
            Card Payment on Arrival
          </h2>
          <div>
            Prefer to pay with card on arrival? We got you! We accept the
            following cards:
            <div className="my-2">
              <div className="flex items-center gap-1">
                <FaCcVisa size={30} /> Visa
              </div>
              <div className="flex items-center  gap-1">
                <FaCcMastercard size={30} />
                Mastercard{" "}
              </div>
              <div className="flex items-center  gap-1">
                <FaCcDiscover size={30} />
                Discover Card{" "}
              </div>
              <div className="flex items-center  gap-1">
                <SiAmericanexpress size={30} />
                American Express{" "}
              </div>
            </div>
            <span className="text-red-400">
              Please note that there is a 4% processing fee.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

const PaymentPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentComponent />
    </Suspense>
  );
};

export default PaymentPage;
