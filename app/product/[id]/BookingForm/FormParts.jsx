// Building blocks shared by the tour and transfer booking forms.

export function Step({ n, title, children }) {
  return (
    <section className="card p-5 sm:p-7">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-ink font-mono text-xs font-semibold text-sun-300">
          {String(n).padStart(2, "0")}
        </span>
        <h2 className="font-sans text-lg font-bold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

// Field names are read via form.current[...] by both forms — keep them.
export function ContactFields() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label htmlFor="name" className="field-label">Full name</label>
        <input type="text" id="name" name="name" required autoComplete="name" className="field" />
      </div>
      <div>
        <label htmlFor="email" className="field-label">Email</label>
        <input type="email" id="email" name="email" required autoComplete="email" className="field" />
      </div>
      <div>
        <label htmlFor="phone_number" className="field-label">Phone / WhatsApp</label>
        <input
          type="tel"
          id="phone_number"
          name="phone_number"
          required
          autoComplete="tel"
          placeholder="+1 555 123 4567"
          className="field"
        />
      </div>
    </div>
  );
}

export function PaymentChoice({ isPayingOnline, setIsPayingOnline }) {
  const options = [
    { value: false, title: "Pay on arrival", body: "Cash, or card with a 4% fee" },
    { value: true, title: "Pay online", body: "Zelle transfer before your trip" },
  ];
  return (
    <fieldset>
      <legend className="field-label">How would you like to pay?</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((o) => (
          <label
            key={o.title}
            className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
              isPayingOnline === o.value
                ? "border-jett-500 bg-jett-50 ring-4 ring-jett-100"
                : "border-sand-300 bg-white hover:border-ink/30"
            }`}
          >
            <input
              type="radio"
              name="pay-online"
              checked={isPayingOnline === o.value}
              onChange={() => setIsPayingOnline(o.value)}
              className="mt-1 accent-jett-600"
            />
            <span>
              <span className="block font-semibold text-ink">{o.title}</span>
              <span className="block text-sm text-ink-muted">{o.body}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function generateOrderNumber() {
  // Random 6-digit order number prefixed with "ET"
  return `ET-${Math.floor(100000 + Math.random() * 900000)}`;
}

export function formatTime(value) {
  if (!value) return "";
  const [h, m] = value.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function formatDate(value) {
  if (!value) return "";
  const d = new Date(`${value}T12:00:00`);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
