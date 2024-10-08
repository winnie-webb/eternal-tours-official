"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

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
            Card Payment on Arrival (Coming Soon)
          </h2>
          <p>
            We are working on enabling card payments upon arrival. This feature
            will be available soon, so stay tuned!
          </p>
        </div>
      </div>
    </section>
  );
};

const PaymentPage = () => {
  return <PaymentComponent />;
};

export default PaymentPage;
