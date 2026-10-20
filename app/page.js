import Link from "next/link";
import Hero from "./components/Hero";
import Gallery from "./components/Gallery";
import ElfSightWidget from "./components/Elfsight";
import { CategoryRow } from "./components/Category";
import AboutUs from "./components/AboutUs";
import HowItWorks from "./components/HowItWorks";
import { TripAdvisor } from "./components/TripAdvisor";
import { CATEGORIES } from "@/lib/catalog";
import { getProducts } from "@/lib/products.server";

// Admin saves refresh these instantly (revalidateTag); this is the backstop.
export const revalidate = 300;

export default async function Home() {
  const products = await getProducts();
  const inCategory = (code) => products.filter((p) => p.category === code);
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c.code, inCategory(c.code).length]));

  return (
    <main>
      <Hero />
      <TripAdvisor />

      <CategoryRow code="mpt" products={inCategory("mpt")} eyebrow="Guest favourites" />
      <CategoryRow code="at" products={inCategory("at")} eyebrow="Land & go" />

      <HowItWorks />

      {/* Every category, as a departures board */}
      <section className="container-x mt-24">
        <p className="eyebrow">Departures</p>
        <h2 className="mt-2 text-4xl tracking-tight sm:text-5xl">Where would you like to go?</h2>
        <div className="mt-8 overflow-hidden rounded-3xl bg-ink text-sand-100 shadow-lift">
          <div className="hidden grid-cols-[90px_1fr_120px_40px] gap-4 border-b border-white/10 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-sand-300/60 sm:grid">
            <span>Code</span>
            <span>Destination</span>
            <span className="text-right">Trips</span>
            <span />
          </div>
          {CATEGORIES.filter((c) => counts[c.code] > 0).map((c) => (
            <Link
              key={c.code}
              href={`/category/${c.code}`}
              className="group grid grid-cols-[70px_1fr_auto] items-center gap-4 border-b border-white/5 px-6 py-4 transition last:border-0 hover:bg-white/5 sm:grid-cols-[90px_1fr_120px_40px]"
            >
              <span className="font-mono text-lg font-semibold uppercase text-sun-300">{c.code}</span>
              <span>
                <span className="block font-semibold">{c.title}</span>
                <span className="hidden text-sm text-sand-300/70 sm:block">{c.blurb}</span>
              </span>
              <span className="text-right font-mono text-sm text-sand-300/80">
                {String(counts[c.code]).padStart(2, "0")}
              </span>
              <span className="hidden text-right text-sun-300 transition group-hover:translate-x-1 sm:block">→</span>
            </Link>
          ))}
        </div>
      </section>

      <CategoryRow code="ctp" products={inCategory("ctp")} eyebrow="More in one day" />
      <Gallery />
      <ElfSightWidget />
      <AboutUs />
    </main>
  );
}
