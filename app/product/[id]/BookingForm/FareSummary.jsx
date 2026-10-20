import { FiLoader } from "react-icons/fi";
import { formatMoney } from "@/lib/catalog";

// The sticky "boarding pass" beside the booking form: what you've picked so
// far and the live fare.
export default function FareSummary({
  tour,
  rows,
  adults,
  pricePerPerson,
  totalPrice,
  submitting,
  submitLabel = "Confirm booking",
}) {
  const fare = parseFloat(pricePerPerson) || 0;
  const minimumApplies = fare > 0 && adults > 0 && adults < 4;

  return (
    <aside className="lg:sticky lg:top-24">
      <div className="overflow-hidden rounded-3xl bg-ink text-sand-100 shadow-lift">
        <div className="flex items-center justify-between px-6 pt-5 font-mono text-[10px] uppercase tracking-[0.25em] text-sun-300">
          <span>Boarding pass</span>
          <span>
            {tour.category} · {tour.id?.split("-")[1]?.padStart(2, "0")}
          </span>
        </div>
        <div className="px-6 pb-6 pt-3">
          <p className="font-display text-2xl leading-snug">{tour.title}</p>
          <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4">
            {rows.map((row) => (
              <div key={row.label} className={row.wide ? "col-span-2" : ""}>
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-sand-300/60">
                  {row.label}
                </dt>
                <dd className={`mt-0.5 text-sm font-semibold ${row.value ? "" : "text-sand-300/40"}`}>
                  {row.value || "—"}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="perforation !border-white/20" style={{ "--notch": "#fff" }} />

        <div className="px-6 pb-6 pt-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sand-300/60">Total fare</p>
              <p className="font-display text-5xl font-semibold leading-none tracking-tight text-sun-300">
                <span className="align-top text-2xl">$</span>
                {formatMoney(totalPrice)}
              </p>
            </div>
            <p className="text-right font-mono text-xs text-sand-300/70">
              {fare > 0 ? `$${formatMoney(fare)} / person` : "Pick your area"}
              <br />
              USD
            </p>
          </div>
          {minimumApplies && (
            <p className="mt-3 rounded-xl bg-white/5 px-3 py-2 text-xs leading-relaxed text-sand-300">
              Private vehicle: groups of 1–4 pay a minimum of four fares.
            </p>
          )}
          <button type="submit" disabled={submitting} className="btn-sun mt-5 w-full !py-4 text-base">
            {submitting ? (
              <>
                <FiLoader className="animate-spin" /> Sending…
              </>
            ) : (
              submitLabel
            )}
          </button>
          <p className="mt-3 text-center text-xs text-sand-300/60">
            No payment taken now — pay on arrival or by Zelle.
          </p>
        </div>
      </div>
    </aside>
  );
}
