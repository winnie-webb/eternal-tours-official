// Booking explained as a route: three stops on one line.
const STOPS = [
  {
    code: "1",
    title: "Pick your trip",
    body: "Choose a tour or transfer and the area you're staying in — the fare updates as you go.",
  },
  {
    code: "2",
    title: "We confirm",
    body: "You get an order number straight away, and we get in touch to confirm your pickup.",
  },
  {
    code: "3",
    title: "Ride & pay",
    body: "Your driver meets you at the lobby, port or arrivals hall. Pay on arrival or by Zelle.",
  },
];

export default function HowItWorks() {
  return (
    <section className="container-x mt-24">
      <div className="relative overflow-hidden rounded-[2rem] bg-jett-600 px-6 py-14 text-sand-50 sm:px-12">
        <div aria-hidden className="grain pointer-events-none absolute inset-0" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sun-400/90" />
        <div className="relative">
          <p className="eyebrow !text-sun-300">How it works</p>
          <h2 className="mt-2 max-w-xl text-4xl tracking-tight sm:text-5xl">
            Three stops between you and the beach.
          </h2>

          <ol className="relative mt-12 grid gap-10 md:grid-cols-3 md:gap-6">
            {/* the route line */}
            <div aria-hidden className="absolute left-[22px] top-2 h-[calc(100%-1rem)] border-l-2 border-dashed border-white/30 md:left-0 md:top-[22px] md:h-0 md:w-full md:border-l-0 md:border-t-2" />
            {STOPS.map((stop) => (
              <li key={stop.code} className="relative flex gap-5 md:flex-col">
                <span className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sand-50 font-mono text-sm font-semibold text-jett-700 ring-4 ring-jett-600">
                  {stop.code}
                </span>
                <div>
                  <h3 className="font-sans text-xl font-bold">{stop.title}</h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-jett-100">{stop.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
