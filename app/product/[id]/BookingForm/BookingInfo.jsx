import React from "react";

const POINTS = [
  ["Private vehicle", "Groups of 1–4 pay a minimum of four times the per-person rate."],
  ["One trip per booking", "Each tour or transfer has its own date and time, so book them separately."],
  ["Hotel pickups", "If you're at a hotel or resort, we meet you in the main lobby."],
  ["Under 5s", "Children under five ride free with an adult."],
  ["Transport only", "Prices cover transportation — excursion and entrance fees are extra."],
];

const BookingInfo = () => {
  return (
    <details className="group rounded-2xl border border-sand-300 bg-sand-50 open:bg-white">
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-semibold text-ink">
        <span>Good to know before you book</span>
        <span className="text-ink-muted transition group-open:rotate-45">+</span>
      </summary>
      <ul className="grid gap-3 px-5 pb-5 text-sm sm:grid-cols-2">
        {POINTS.map(([title, body]) => (
          <li key={title} className="rounded-xl bg-sand-100 p-3">
            <p className="font-semibold text-ink">{title}</p>
            <p className="mt-1 leading-relaxed text-ink-muted">{body}</p>
          </li>
        ))}
      </ul>
    </details>
  );
};

export default BookingInfo;
