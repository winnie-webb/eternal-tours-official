"use client";

import React, { useState, useEffect, Suspense } from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PayPalButton from "../components/PaypalBtn";
import "./iframe.css";
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
          ? `The total price of your booking is $${amount} usd`
          : "Make a payment"}
      </h1>
      <input
        type="number"
        placeholder="Payment Amount"
        className="p-2 shadow-md w-[90%] md:w-[30%] mx-auto block mb-10"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <div className="md:w-[30%] mx-auto">
        <PayPalButton amount={parseFloat(amount)} />
      </div>
    </section>
  );
};

const PaymentPage = () => {
  return (
    <PayPalScriptProvider
      options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_API_KEY }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <PaymentComponent />
      </Suspense>
    </PayPalScriptProvider>
  );
};

export default PaymentPage;
