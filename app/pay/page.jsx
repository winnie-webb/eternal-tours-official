"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PaymentOptions from "../components/PaymentOptions";
import { formatMoney } from "@/lib/catalog";

const PaymentComponent = () => {
  const queryAmount = useSearchParams().get("payment");

  return (
    <main className="container-x pb-8 pt-10">
      <div className="max-w-2xl">
        <h1 className="text-4xl tracking-tight sm:text-6xl">
          {queryAmount
            ? `The total price of your booking is $${formatMoney(queryAmount)} USD`
            : "Make a Payment"}
        </h1>
      </div>
      <div className="mt-10">
        <PaymentOptions />
      </div>
    </main>
  );
};

const PaymentPage = () => {
  return (
    <Suspense fallback={<div className="container-x py-20 text-ink-muted">Loading…</div>}>
      <PaymentComponent />
    </Suspense>
  );
};

export default PaymentPage;
