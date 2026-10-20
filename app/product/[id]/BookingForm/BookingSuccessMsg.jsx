import Link from "next/link";
import getPickupTitle from "@/app/utils/getPickupTitle";
import PaymentOptions from "@/app/components/PaymentOptions";
import { formatMoney } from "@/lib/catalog";
import { formatDate, formatTime } from "./FormParts";

const TRANSFER_LABELS = {
  PickUp: "Arriving · airport → stay",
  DropOff: "Departing · stay → airport",
  PickUpAndDropOff: "Round trip",
};

function BookingSuccessMsg({ orderNumber, formData }) {
  const isTransfer = Boolean(formData.transfer_type);

  const rows = [
    ["Passenger", formData.name],
    ["Travellers", `${formData.adults} adult${formData.adults === 1 ? "" : "s"}${formData.kids ? `, ${formData.kids} kid${formData.kids === 1 ? "" : "s"}` : ""}`],
    ...(isTransfer
      ? [
          ["Trip", TRANSFER_LABELS[formData.transfer_type]],
          ["Staying at", formData.place_of_stay?.replace("Price", "").trim()],
          ["Address", formData.pickup_dropoff],
          ...(formData.airlines_name
            ? [["Arrival", `${formatDate(formData.pickup_date)} · ${formatTime(formData.arrival_time)} · ${formData.airlines_name}`]]
            : []),
          ...(formData.departure_date
            ? [["Departure", `${formatDate(formData.departure_date)} · ${formatTime(formData.departure_time)} · ${formData.departure_airlines_name}`]]
            : []),
        ]
      : [
          ["Pick-up area", getPickupTitle(formData.pickup_dropoff)],
          ["Where", formData.pickup_location],
          ["Date", formatDate(formData.pickup_date)],
          ["Time", formatTime(formData.pickup_time)],
        ]),
    ["Email", formData.email],
    ["Phone", formData.phone_number],
  ];

  return (
    <div className="mx-auto max-w-3xl animate-rise">
      <div className="text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-palm-500 text-2xl text-white">✓</span>
        <h1 className="mt-5 text-4xl tracking-tight sm:text-5xl">You&apos;re booked in.</h1>
        <p className="mx-auto mt-3 max-w-md text-ink-muted">
          We&apos;ve received your booking and will be in touch to confirm. Keep your order number
          handy — you&apos;ll need it if you pay by Zelle.
        </p>
      </div>

      {/* The issued ticket */}
      <div className="mt-10 overflow-hidden rounded-3xl bg-white shadow-lift ring-1 ring-sand-200">
        <div className="flex flex-col gap-4 bg-ink px-6 py-6 text-sand-100 sm:flex-row sm:items-end sm:justify-between sm:px-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-sun-300">Order number</p>
            <p className="mt-1 font-mono text-4xl font-semibold tracking-wider">{orderNumber}</p>
          </div>
          <div className="sm:text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-sun-300">Total fare</p>
            <p className="font-display text-4xl">${formatMoney(formData.total_price)}</p>
          </div>
        </div>
        <div className="px-6 py-6 sm:px-8">
          <p className="eyebrow">{isTransfer ? "Airport transfer" : "Tour"}</p>
          <p className="mt-1 font-display text-2xl leading-snug">{formData.tourName}</p>
        </div>
        <div className="perforation" style={{ "--notch": "#fff" }} />
        <dl className="grid gap-x-8 gap-y-4 px-6 py-6 sm:grid-cols-2 sm:px-8">
          {rows
            .filter(([, value]) => value)
            .map(([label, value]) => (
              <div key={label}>
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">{label}</dt>
                <dd className="mt-0.5 break-words text-[15px] font-semibold text-ink">{value}</dd>
              </div>
            ))}
        </dl>
      </div>

      <h2 className="mt-14 text-3xl tracking-tight">How to pay</h2>
      <div className="mt-5">
        <PaymentOptions orderNumber={orderNumber} />
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">Back to home</Link>
        <Link href="/category/mpt" className="btn-ghost">Book another trip</Link>
      </div>
    </div>
  );
}

export default BookingSuccessMsg;
