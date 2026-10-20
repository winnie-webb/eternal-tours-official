"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiArrowUpRight, FiMail, FiPhone } from "react-icons/fi";
import { CATEGORIES } from "@/lib/catalog";
import { CONTACT, SocialLinks } from "./SocialLinks";

function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") || pathname === "/login") return null;

  return (
    <footer className="relative mt-24 overflow-hidden bg-ink text-sand-100">
      {/* Sun arc, echoing the logo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-sun-400 to-sunset-500 opacity-90 blur-[2px]"
      />
      <div aria-hidden className="grain pointer-events-none absolute inset-0" />

      <div className="container-x relative py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow !text-sun-300">Jamaica Eternal Tours</p>
            <h2 className="mt-4 max-w-md text-4xl leading-[1.05] tracking-tight sm:text-5xl">
              Wherever you&apos;re staying, we&apos;ll come get you.
            </h2>
            <div className="mt-8 flex flex-col gap-3 text-sm">
              <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 hover:text-sun-300">
                <FiMail /> {CONTACT.email}
              </a>
              <a href={CONTACT.phoneHref} className="flex items-center gap-3 hover:text-sun-300">
                <FiPhone /> {CONTACT.phone}
              </a>
            </div>
            <SocialLinks tone="dark" className="mt-8" />
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            <div className="col-span-2">
              <p className="eyebrow !text-sand-300/70">Tours</p>
              <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2.5 text-sm sm:grid-cols-2">
                {CATEGORIES.map((c) => (
                  <li key={c.code}>
                    <Link href={`/category/${c.code}`} className="hover:text-sun-300">
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow !text-sand-300/70">Company</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li><Link href="/about-us" className="hover:text-sun-300">About us</Link></li>
                <li><Link href="/contact-us" className="hover:text-sun-300">Contact</Link></li>
                <li><Link href="/pay" className="hover:text-sun-300">Payments</Link></li>
                <li>
                  <a href={CONTACT.tripadvisor} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-sun-300">
                    Reviews <FiArrowUpRight />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-xs text-sand-300/70 sm:flex-row">
          <p>© {new Date().getFullYear()} Jamaica Eternal Tours &amp; Transportation</p>
          <p>Montego Bay, Jamaica</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
