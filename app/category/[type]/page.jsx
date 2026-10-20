import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { CategoryGrid } from "@/app/components/Category";
import { CATEGORIES, getCategory } from "@/lib/catalog";
import { getProducts } from "@/lib/products.server";

// Admin saves refresh these instantly (revalidateTag); this is the backstop.
export const revalidate = 300;

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ type: c.code }));
}

export async function generateMetadata({ params }) {
  const category = getCategory(params.type);
  return {
    title: `${category.title} · Jamaica Eternal Tours`,
    description: `${category.title} with Jamaica Eternal Tours and Transportation.`,
  };
}

async function page({ params }) {
  const { type } = params;
  const category = getCategory(type);
  const products = (await getProducts()).filter((p) => p.category === type);
  const from = products.length
    ? Math.min(...products.map((p) => parseFloat(p.priceLowest) || Infinity))
    : null;

  return (
    <main>
      <section className="container-x pb-12 pt-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-ink">
          <FiArrowLeft /> All destinations
        </Link>
        <div className="mt-8 grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <h1 className="text-balance text-4xl tracking-tight sm:text-6xl">{category.title}</h1>
          </div>
          {products.length > 0 && (
            <dl className="flex gap-8 rounded-3xl bg-white px-6 py-4 shadow-ticket ring-1 ring-sand-200">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">Trips</dt>
                <dd className="font-display text-3xl">{products.length}</dd>
              </div>
              {isFinite(from) && (
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">From</dt>
                  <dd className="font-display text-3xl">${from}</dd>
                </div>
              )}
            </dl>
          )}
        </div>

        {/* Hop between categories */}
        <nav className="scroll-row mt-10 !gap-2 !pb-0" aria-label="Categories">
          {CATEGORIES.map((c) => (
            <Link
              key={c.code}
              href={`/category/${c.code}`}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                c.code === type
                  ? "border-ink bg-ink text-sand-50"
                  : "border-ink/10 bg-white hover:border-ink/40"
              }`}
            >
              {c.short}
            </Link>
          ))}
        </nav>
      </section>

      <section className="container-x">
        <CategoryGrid products={products} />
      </section>
    </main>
  );
}

export default page;
