import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

function AboutUs({ full = false }) {
  return (
    <section className="container-x mt-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative">
          <div className="relative aspect-[4/5] max-h-[560px] w-full overflow-hidden rounded-[2rem] bg-sand-200">
            <Image
              alt="The Jamaica Eternal Tours founder with a group of guests"
              src="/local/hero-1.jpg"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        <div>
          <h2 className="text-4xl tracking-tight sm:text-5xl">Get to know us</h2>
          <p className="mt-6 text-lg leading-relaxed text-ink-muted">
            At Jamaica Eternal Tours, we specialize in uncovering the hidden gems of Jamaica,
            offering tailored experiences that showcase the island&apos;s beauty, culture, and
            heritage. From airport transfers to beach escapes and cultural explorations, we
            provide personalized, expert-guided tours that suit every traveler. Let us take you on
            an unforgettable journey through Jamaica&apos;s stunning landscapes and iconic
            attractions, ensuring your comfort and convenience every step of the way.
          </p>

          {full ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="card p-6">
                <h3 className="font-sans text-lg font-bold">Our mission</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">
                  To empower travelers to explore Jamaica&apos;s finest tours, creating meaningful
                  connections and unforgettable experiences while promoting responsible and
                  sustainable tourism practices.
                </p>
              </div>
              <div className="card p-6">
                <h3 className="font-sans text-lg font-bold">Our vision</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">
                  To inspire transformative adventures in Jamaica, fostering appreciation for
                  diverse cultures and contributing to a sustainable, interconnected planet
                  through travel joy.
                </p>
              </div>
            </div>
          ) : (
            <Link href="/about-us" className="btn-ghost mt-8">
              Our story <FiArrowRight />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
