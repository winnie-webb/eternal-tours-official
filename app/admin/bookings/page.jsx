"use client";
import React, { useEffect, useMemo, useState } from "react";
import { collection, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiSearch, FiX } from "react-icons/fi";
import { auth, db, messaging, onMessage } from "@/firebase";
import getPickupTitle from "@/app/utils/getPickupTitle";
import { formatMoney } from "@/lib/catalog";

const STATUSES = ["Pending", "Payment Confirmed", "Completed", "Cancelled"];
const STATUS_STYLE = {
  Pending: "bg-sun-100 text-sunset-600",
  "Payment Confirmed": "bg-jett-50 text-jett-700",
  Completed: "bg-sand-200 text-ink-soft",
  Cancelled: "bg-red-50 text-red-700",
};
const TRANSFER_LABELS = {
  PickUp: "Arriving (airport → stay)",
  DropOff: "Departing (stay → airport)",
  PickUpAndDropOff: "Round trip",
};

// New bookings are saved as "pending"; the admin writes "Pending" etc.
const normalizeStatus = (s) => STATUSES.find((x) => x.toLowerCase() === String(s || "").toLowerCase()) || "Pending";

const toDate = (ts) => (ts?.toDate ? ts.toDate() : null);

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      const { title, body } = payload.notification;
      toast(title + " — " + body);
      if (Notification.permission === "granted") new Notification(title, { body });
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/login");
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "bookings"), (snapshot) => {
      const list = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        // A just-created booking has no server timestamp yet; keep it on top
        .sort((a, b) => (toDate(b.timestamp) || new Date()) - (toDate(a.timestamp) || new Date()));
      setBookings(list);
    });
    return () => unsubscribe();
  }, []);

  const counts = useMemo(() => {
    const c = { all: bookings.length };
    bookings.forEach((b) => {
      const s = normalizeStatus(b.status);
      c[s] = (c[s] || 0) + 1;
    });
    return c;
  }, [bookings]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return bookings.filter((b) => {
      if (statusFilter !== "all" && normalizeStatus(b.status) !== statusFilter) return false;
      if (!term) return true;
      return [b.orderNumber, b.name, b.email, b.phone_number, b.tourName]
        .some((v) => String(v || "").toLowerCase().includes(term));
    });
  }, [bookings, search, statusFilter]);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    await updateDoc(doc(db, "bookings", bookingId), { status: newStatus });
    setSelected((s) => (s && s.id === bookingId ? { ...s, status: newStatus } : s));
    toast.success(`Marked ${newStatus.toLowerCase()}`);
  };

  return (
    <div>
      <p className="eyebrow">Bookings</p>
      <h1 className="mt-1 text-4xl tracking-tight">Reservations</h1>
      <p className="mt-1 text-sm text-ink-muted">Live — new bookings appear here as they come in.</p>

      <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative lg:w-80">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Order #, name, email, phone, tour"
            className="field !rounded-full !py-2.5 !pl-11"
          />
        </div>
        <div className="scroll-row !mx-0 !gap-2 !px-0 !pb-0">
          {["all", ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                statusFilter === s ? "border-ink bg-ink text-white" : "border-sand-300 bg-white hover:border-ink/40"
              }`}
            >
              {s === "all" ? "All" : s}
              <span className={`font-mono text-[11px] ${statusFilter === s ? "text-sun-300" : "text-ink-muted"}`}>
                {counts[s] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl bg-white ring-1 ring-sand-200">
        <div className="hidden grid-cols-[130px_1.2fr_2fr_110px_150px] gap-4 border-b border-sand-200 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted md:grid">
          <span>Order</span><span>Guest</span><span>Trip</span><span className="text-right">Total</span><span>Status</span>
        </div>
        {visible.length === 0 ? (
          <p className="p-10 text-center text-ink-muted">No bookings match.</p>
        ) : (
          <ul className="divide-y divide-sand-200">
            {visible.map((b) => {
              const status = normalizeStatus(b.status);
              const when = toDate(b.timestamp);
              return (
                <li key={b.id}>
                  <button
                    onClick={() => setSelected(b)}
                    className="grid w-full grid-cols-[1fr_auto] gap-x-4 gap-y-1 px-5 py-4 text-left transition hover:bg-sand-50 md:grid-cols-[130px_1.2fr_2fr_110px_150px] md:items-center"
                  >
                    <span className="font-mono text-sm font-semibold">
                      {b.orderNumber || "—"}
                      <span className="block text-[11px] font-normal text-ink-muted">
                        {when ? when.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" }) : "just now"}
                      </span>
                    </span>
                    <span className="order-3 min-w-0 md:order-none">
                      <span className="block truncate font-semibold">{b.name}</span>
                      <span className="block truncate text-xs text-ink-muted">{b.email}</span>
                    </span>
                    <span className="order-4 line-clamp-1 text-sm text-ink-soft md:order-none">{b.tourName}</span>
                    <span className="text-right font-mono text-sm font-semibold">${formatMoney(b.total_price)}</span>
                    <span className="order-2 md:order-none">
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[status]}`}>{status}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {selected && (
        <BookingDrawer booking={selected} onClose={() => setSelected(null)} onStatus={handleStatusUpdate} />
      )}
    </div>
  );
};

function BookingDrawer({ booking: b, onClose, onStatus }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const isTransfer = Boolean(b.transfer_type);
  const status = normalizeStatus(b.status);
  const rows = [
    ["Guest", b.name],
    ["Email", b.email && <a className="text-jett-700 underline" href={`mailto:${b.email}`}>{b.email}</a>],
    ["Phone", b.phone_number && <a className="text-jett-700 underline" href={`tel:${b.phone_number}`}>{b.phone_number}</a>],
    ["Adults / kids", `${b.adults ?? 0} / ${b.kids ?? 0}`],
    ["Price per person", b.price_per_person && `$${formatMoney(b.price_per_person)}`],
    ["Wants to pay online", b.pay_online],
    ...(isTransfer
      ? [
          ["Trip", TRANSFER_LABELS[b.transfer_type] || b.transfer_type],
          ["Staying at", b.place_of_stay?.replace("Price", "").trim()],
          ["Address", b.pickup_dropoff],
          ["Arrival", [b.pickup_date, b.arrival_time, b.airlines_name].filter(Boolean).join(" · ")],
          ["Departure", [b.departure_date, b.departure_time, b.departure_airlines_name].filter(Boolean).join(" · ")],
          ["Pick-up time", b.pickup_time],
        ]
      : [
          ["Pick-up area", b.pickup_dropoff && getPickupTitle(b.pickup_dropoff)],
          ["Pick-up place", b.pickup_location],
          ["Date", b.pickup_date],
          ["Time", b.pickup_time],
        ]),
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/50 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="flex h-full w-full max-w-lg animate-rise flex-col bg-white shadow-lift">
        <div className="flex items-start justify-between bg-ink px-6 py-5 text-white">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-sun-300">Order</p>
            <p className="font-mono text-2xl font-semibold">{b.orderNumber}</p>
            <p className="mt-1 text-sm text-sand-300">{b.tourName}</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-xl text-sand-300 hover:bg-white/10 hover:text-white" aria-label="Close">
            <FiX />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">Total fare</p>
          <p className="font-display text-4xl">${formatMoney(b.total_price)}</p>
          <dl className="mt-6 divide-y divide-sand-200">
            {rows
              .filter(([, v]) => v)
              .map(([label, value]) => (
                <div key={label} className="grid grid-cols-[130px_1fr] gap-3 py-3 text-sm">
                  <dt className="text-ink-muted">{label}</dt>
                  <dd className="break-words font-medium">{value}</dd>
                </div>
              ))}
          </dl>
        </div>
        <div className="border-t border-sand-200 px-6 py-5">
          <p className="field-label">Status</p>
          <div className="grid grid-cols-2 gap-2">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => {
                  if (s === "Cancelled" && !confirm("Cancel this booking?")) return;
                  onStatus(b.id, s);
                }}
                className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                  status === s ? "border-ink bg-ink text-white" : "border-sand-300 hover:border-ink/40"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingsPage;
