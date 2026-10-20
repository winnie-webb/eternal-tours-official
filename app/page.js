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
        <h2 className="text-4xl tracking-tight sm:text-5xl">Where would you like to go?</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.filter((c) => counts[c.code] > 0).map((c) => (
            <Link
              key={c.code}
              href={`/category/${c.code}`}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-sand-200 bg-white p-5 transition hover:border-jett-600 hover:shadow-ticket"
            >
              <span>
                <span className="block font-semibold text-ink group-hover:text-jett-700">{c.title}</span>
                <span className="mt-1 block text-sm text-ink-muted">{counts[c.code]} trips</span>
              </span>
              <span className="text-xl text-jett-600 transition group-hover:translate-x-1">→</span>
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
