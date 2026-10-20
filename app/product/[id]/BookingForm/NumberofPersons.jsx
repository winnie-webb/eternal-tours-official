import React from "react";
import { FiMinus, FiPlus } from "react-icons/fi";

function Stepper({ id, label, hint, value, min, onChange }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-sand-300 bg-white px-4 py-3">
      <div>
        <p id={id} className="text-[15px] font-semibold text-ink">{label}</p>
        <p className="text-xs text-ink-muted">{hint}</p>
      </div>
      <div className="flex items-center gap-3" role="group" aria-labelledby={id}>
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 text-ink transition hover:bg-sand-100 disabled:opacity-30"
          aria-label={`Fewer ${label.toLowerCase()}`}
        >
          <FiMinus />
        </button>
        <span className="w-6 text-center font-mono text-lg font-semibold" aria-live="polite">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(60, value + 1))}
          className="grid h-9 w-9 place-items-center rounded-full bg-ink text-sun-300 transition hover:bg-jett-600"
          aria-label={`More ${label.toLowerCase()}`}
        >
          <FiPlus />
        </button>
      </div>
    </div>
  );
}

function NumberofPersons({ adults, kids, onAdultsChange, onKidsChange }) {
  return (
    <fieldset>
      <legend className="field-label">Who&apos;s travelling?</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        <Stepper id="adults-label" label="Adults" hint="5 years and up" value={adults} min={1} onChange={onAdultsChange} />
        <Stepper id="kids-label" label="Kids" hint="Under 5 — ride free" value={kids} min={0} onChange={onKidsChange} />
      </div>
    </fieldset>
  );
}

export default NumberofPersons;
