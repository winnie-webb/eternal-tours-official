import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import TicketCard from "./TicketCard";
import { getCategory, sortByPrice } from "@/lib/catalog";

// A horizontal, swipeable row of tickets for the home page.
export function CategoryRow({ code, products, limit = 8, eyebrow }) {
  const category = getCategory(code);
  const sorted = sortByPrice(products);
  if (sorted.length === 0) return null;

  return (
    <section className="container-x mt-24">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{eyebrow || `${sorted.length} options`}</p>
          <h2 className="mt-2 text-4xl tracking-tight sm:text-5xl">{category.title}</h2>
        </div>
        <Link href={`/category/${code}`} className="btn-ghost">
          See all {sorted.length} <FiArrowRight />
        </Link>
      </div>
      <div className="scroll-row">
        {sorted.slice(0, limit).map((tour, i) => (
          <TicketCard
            key={tour.id}
            tour={tour}
            badge={i === 0 ? "Best value" : undefined}
            className="w-[80vw] shrink-0 snap-start sm:w-[340px]"
          />
        ))}
        <Link
          href={`/category/${code}`}
          className="flex w-[60vw] shrink-0 snap-start flex-col justify-between rounded-3xl bg-ink p-6 text-sand-100 transition hover:bg-jett-700 sm:w-[260px]"
        >
          <span />
          <span>
            <span className="block font-display text-3xl leading-tight">
              All {category.short.toLowerCase()}
            </span>
            <span className="mt-3 inline-flex items-center gap-2 text-sm text-sun-300">
              Browse {sorted.length} <FiArrowRight />
            </span>
          </span>
        </Link>
      </div>
    </section>
  );
}

// The full listing used by /category/[code].
export function CategoryGrid({ products }) {
  const sorted = sortByPrice(products);

  if (sorted.length === 0) {
    return (
      <div className="card mx-auto max-w-lg p-10 text-center">
        <p className="font-display text-2xl">No Tours Available</p>
        <p className="mt-2 text-ink-muted">Check back soon for exciting new adventures!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {sorted.map((tour, i) => (
        <TicketCard
          key={tour.id}
          tour={tour}
          priority={i < 3}
          badge={i === 0 ? "Best value" : undefined}
        />
      ))}
    </div>
  );
}
