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
        <p className="eyebrow">Payments</p>
        {queryAmount ? (
          <h1 className="mt-3 text-4xl tracking-tight sm:text-6xl">
            Your booking total is{" "}
            <span className="italic text-jett-600">${formatMoney(queryAmount)}</span> USD
          </h1>
        ) : (
          <h1 className="mt-3 text-4xl tracking-tight sm:text-6xl">
            Pay the way that <span className="italic text-jett-600">suits you.</span>
          </h1>
        )}
        <p className="mt-4 text-lg text-ink-muted">
          Nothing is charged when you book. Settle up by Zelle before your trip, or pay your
          driver on the day.
        </p>
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
