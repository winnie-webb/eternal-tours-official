import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { formatMoney, getCategory, productImage } from "@/lib/catalog";

// A tour as a ticket: photo, a perforated tear line, then the stub with the
// route code and fare.
export default function TicketCard({ tour, className = "", priority = false, badge }) {
  const category = getCategory(tour.category);

  return (
    <Link
      href={`/product/${tour.id}`}
      className={`group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-ticket ring-1 ring-sand-200 transition duration-300 hover:-translate-y-1 hover:shadow-lift ${className}`}
    >
      {/* Catalogue images are square, and transfer images carry text — don't crop */}
      <div className="relative aspect-square overflow-hidden bg-sand-200">
        <Image
          src={productImage(tour)}
          alt={tour.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 30vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <span />
          {badge && (
            <span className="rounded-full bg-sun-400 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-ink">
              {badge}
            </span>
          )}
        </div>
      </div>

      <div className="perforation" style={{ "--notch": "var(--ticket-notch, #fff)" }} />

      <div className="flex flex-1 flex-col p-5 pt-4">
        <p className="eyebrow !text-ink-muted">{category.short}</p>
        <h3 className="mt-1.5 line-clamp-2 font-sans text-[17px] font-bold leading-snug text-ink group-hover:text-jett-600">
          {tour.title}
        </h3>
        <div className="mt-auto flex items-end justify-between pt-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
              From / person
            </p>
            <p className="font-display text-3xl font-semibold leading-none tracking-tight">
              <span className="align-top text-base">$</span>
              {formatMoney(tour.priceLowest)}
            </p>
          </div>
          <span className="grid h-11 w-11 place-items-center rounded-full bg-sand-100 text-lg text-ink transition group-hover:bg-ink group-hover:text-sun-300">
            <FiArrowUpRight />
          </span>
        </div>
      </div>
    </Link>
  );
}
