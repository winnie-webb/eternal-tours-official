import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import BookingForm from "./BookingForm/BookingForm";
import TicketCard from "@/app/components/TicketCard";
import { formatMoney, getCategory, productImage, sortByPrice } from "@/lib/catalog";
import { getProduct, getProducts } from "@/lib/products.server";

// Admin saves refresh these instantly (revalidateTag); this is the backstop.
export const revalidate = 300;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }) {
  const tour = await getProduct(params.id);
  if (!tour) return { title: "Tour not found · Jamaica Eternal Tours" };
  return {
    title: `${tour.title} · Jamaica Eternal Tours`,
    description:
      tour.desc ||
      `Private ${getCategory(tour.category).title.toLowerCase()} in Jamaica from $${formatMoney(tour.priceLowest)} per person.`,
  };
}

async function page({ params }) {
  const tour = await getProduct(params.id);
  if (!tour) notFound();

  const category = getCategory(tour.category);
  const related = sortByPrice(
    (await getProducts()).filter((p) => p.category === tour.category && p.id !== tour.id)
  ).slice(0, 3);
  const isTransfer = tour.category === "at";

  return (
    <main>
      <section className="container-x pt-6">
        <Link
          href={`/category/${tour.category}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-ink"
        >
          <FiArrowLeft /> {category.title}
        </Link>

        <div className="mt-6 grid items-center gap-8 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-14">
          <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] bg-sand-200 shadow-ticket ring-1 ring-sand-200">
            <Image
              src={productImage(tour)}
              alt={tour.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 420px"
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <span className="code-chip">{tour.category}</span>
              <span className="eyebrow !text-ink-muted">{category.title}</span>
            </div>
            <h1 className="mt-4 text-balance text-4xl leading-[1.05] tracking-tight sm:text-5xl">
              {tour.title}
            </h1>
            {tour.desc && (
              <p className="mt-5 max-w-2xl whitespace-pre-line text-lg leading-relaxed text-ink-muted">
                {tour.desc}
              </p>
            )}
            <dl className="mt-8 flex flex-wrap gap-3">
              <div className="rounded-2xl bg-white px-5 py-3 ring-1 ring-sand-200">
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">From</dt>
                <dd className="font-display text-3xl">
                  ${formatMoney(tour.priceLowest)}
                  <span className="ml-1 font-sans text-sm text-ink-muted">/ person</span>
                </dd>
              </div>
              <div className="rounded-2xl bg-white px-5 py-3 ring-1 ring-sand-200">
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">Vehicle</dt>
                <dd className="mt-1 font-semibold">Private, just your group</dd>
              </div>
              <div className="rounded-2xl bg-white px-5 py-3 ring-1 ring-sand-200">
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">Pick-up</dt>
                <dd className="mt-1 font-semibold">
                  {isTransfer ? "Arrivals hall or your lobby" : "Your hotel lobby or port"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="container-x mt-14" id="book">
        <p className="eyebrow">Book</p>
        <h2 className="mb-8 mt-2 text-3xl tracking-tight sm:text-4xl">
          {isTransfer ? "Reserve your ride" : "Reserve your day out"}
        </h2>
        <BookingForm tour={tour} />
      </section>

      {related.length > 0 && (
        <section className="container-x mt-24">
          <p className="eyebrow">Also in {category.short.toLowerCase()}</p>
          <h2 className="mb-8 mt-2 text-3xl tracking-tight sm:text-4xl">You might also like</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <TicketCard key={p.id} tour={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default page;
