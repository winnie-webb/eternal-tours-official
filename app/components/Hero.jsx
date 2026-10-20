"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiArrowRight, FiSearch } from "react-icons/fi";
import { CATEGORIES } from "@/lib/catalog";

const STACK = [
  { src: "/local/hero-4.jpg", alt: "Guests bamboo rafting on the river", tilt: "-rotate-6", pos: "left-0 top-4" },
  { src: "/local/hero-8.jpg", alt: "A tour group at YS Falls", tilt: "rotate-3", pos: "right-0 top-0" },
  { src: "/local/hero-5.jpg", alt: "Guests welcomed at the airport with a Jamaica sign", tilt: "-rotate-1", pos: "left-[24%] bottom-0" },
];

function Hero() {
  const router = useRouter();
  const [destination, setDestination] = useState("at");

  return (
    <section className="relative overflow-hidden">

      <div className="container-x relative grid items-center gap-12 pb-16 pt-10 lg:grid-cols-[1.1fr_1fr] lg:pb-24 lg:pt-16">
        <div className="animate-rise">
          <p className="eyebrow flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-sunset-500" />
            Private tours &amp; airport transfers · Jamaica
          </p>
          <h1 className="mt-5 text-balance text-[3.25rem] font-medium leading-[0.95] tracking-tight sm:text-7xl xl:text-[5.5rem]">
            Jamaica,{" "}
            <em className="font-normal italic text-jett-600">door to door.</em>
          </h1>
          <p className="mt-6 max-w-lg text-pretty text-lg leading-relaxed text-ink-muted">
            From the moment you land at Sangster to your last sunset in Negril —
            a private driver, a fixed price, and a local who knows the way.
          </p>

          {/* Boarding-pass quick finder */}
          <div className="mt-9 max-w-xl overflow-hidden rounded-3xl bg-white shadow-lift ring-1 ring-sand-200">
            <div className="flex items-center justify-between bg-ink px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-sun-300">
              <span>Boarding pass</span>
              <span>JETT · JA</span>
            </div>
            <div className="flex flex-col sm:flex-row">
              <div className="flex-1 p-5">
                <label htmlFor="hero-destination" className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                  Where to?
                </label>
                <select
                  id="hero-destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="mt-1 w-full cursor-pointer bg-transparent font-display text-2xl font-medium text-ink outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="perforation sm:hidden" style={{ "--notch": "#fff" }} />
              <div className="perforation-y hidden sm:block" style={{ "--notch": "#fff" }} />
              <div className="flex items-center gap-2 p-4 sm:p-5">
                <button
                  onClick={() => router.push(`/category/${destination}`)}
                  className="btn-sun flex-1 !px-6 !py-3.5 sm:flex-none"
                >
                  Find rides <FiArrowRight />
                </button>
                <button
                  onClick={() => window.dispatchEvent(new Event("jett:search"))}
                  className="grid h-12 w-12 place-items-center rounded-full border border-ink/10 text-lg hover:bg-sand-100"
                  aria-label="Search all tours"
                >
                  <FiSearch />
                </button>
              </div>
            </div>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-ink-soft">
            <li className="flex items-center gap-2"><Tick /> Private — never shared</li>
            <li className="flex items-center gap-2"><Tick /> Kids under 5 ride free</li>
            <li className="flex items-center gap-2"><Tick /> Pay on arrival, cash or card</li>
          </ul>
        </div>

        {/* Fanned photo stack */}
        <div className="relative mx-auto h-[420px] w-full max-w-[460px] sm:h-[540px]">
          {STACK.map((photo, i) => (
            <figure
              key={photo.src}
              className={`absolute ${photo.pos} ${photo.tilt} w-[52%] rounded-[28px] bg-white p-2.5 pb-10 shadow-lift ring-1 ring-sand-200 transition duration-500 hover:z-20 hover:rotate-0 hover:scale-[1.03]`}
              style={{ zIndex: i + 1, animation: `rise 0.7s ${0.15 * i + 0.2}s both cubic-bezier(0.2,0.7,0.2,1)` }}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-sand-200">
                <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 640px) 60vw, 270px" className="object-cover" priority={i === 2} />
              </div>
              <figcaption className="absolute bottom-3 left-4 right-4 flex justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                <span>JETT</span>
                <span>{["River", "Falls", "Arrivals"][i]}</span>
              </figcaption>
            </figure>
          ))}
          <div className="absolute -bottom-2 right-2 z-10 rotate-6 rounded-2xl bg-sun-400 px-4 py-3 font-display text-lg leading-tight text-ink shadow-ticket sm:right-0">
            Real guests,
            <br />
            real days out.
          </div>
        </div>
      </div>
    </section>
  );
}

function Tick() {
  return (
    <span className="grid h-5 w-5 place-items-center rounded-full bg-palm-500 text-[11px] text-white">✓</span>
  );
}

export default Hero;
