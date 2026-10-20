"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiChevronDown, FiMenu, FiSearch, FiX } from "react-icons/fi";
import logo from "../../public/logo.webp";
import SearchBar from "./SearchBar";
import { CATEGORIES } from "@/lib/catalog";
import { SocialLinks } from "./SocialLinks";

const NAV = [
  { href: "/pay", label: "Payments" },
  { href: "/about-us", label: "About" },
  { href: "/contact-us", label: "Contact" },
];

function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToursOpen, setIsToursOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsToursOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const onKey = (e) => {
      const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(
        document.activeElement?.tagName
      );
      if ((e.key === "/" && !typing) || (e.key === "k" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    const onOpen = () => setIsSearchOpen(true);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("jett:search", onOpen);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("jett:search", onOpen);
    };
  }, []);

  // The admin console and login have their own chrome
  if (pathname?.startsWith("/admin") || pathname === "/login") return null;

  const isActive = (href) => pathname === href;

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled || isMenuOpen
            ? "border-b border-sand-200 bg-white/90 backdrop-blur-md"
            : "bg-white"
        }`}
      >
        <div className="container-x flex h-[72px] items-center gap-6">
          <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Jamaica Eternal Tours home">
            <Image
              src={logo}
              alt="Jamaica Eternal Tours logo"
              width={52}
              height={44}
              className="h-11 w-auto rounded-lg"
              priority
            />
            <span className="hidden leading-none sm:block">
              <span className="block font-display text-lg font-semibold tracking-tight">
                Jamaica Eternal
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
                Tours &amp; Transportation
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="ml-auto hidden items-center gap-1 lg:flex">
            <div
              className="relative"
              onMouseEnter={() => setIsToursOpen(true)}
              onMouseLeave={() => setIsToursOpen(false)}
            >
              <button
                onClick={() => setIsToursOpen((v) => !v)}
                className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-sand-200 ${
                  pathname?.startsWith("/category") ? "text-jett-600" : ""
                }`}
                aria-expanded={isToursOpen}
              >
                Tours
                <FiChevronDown
                  className={`transition ${isToursOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isToursOpen && (
                <div className="absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-3">
                  <div className="grid animate-rise grid-cols-2 gap-1 rounded-3xl border border-sand-200 bg-white p-3 shadow-lift">
                    {CATEGORIES.map((c) => (
                      <Link
                        key={c.code}
                        href={`/category/${c.code}`}
                        className="group flex gap-3 rounded-2xl p-3 transition hover:bg-sand-100"
                      >
                        <span className="code-chip mt-0.5 h-fit min-w-[44px] justify-center">
                          {c.code}
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-ink group-hover:text-jett-600">
                            {c.title}
                          </span>
                          <span className="mt-0.5 block text-xs leading-snug text-ink-muted">
                            {c.blurb}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-sand-200 ${
                  isActive(item.href) ? "text-jett-600" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 rounded-full border border-ink/10 bg-white px-3 py-2 text-sm text-ink-muted transition hover:border-ink/30 hover:text-ink sm:px-4"
              aria-label="Search tours"
            >
              <FiSearch />
              <span className="hidden xl:inline">Search tours</span>
              <kbd className="hidden rounded border border-sand-300 px-1.5 font-mono text-[10px] xl:inline">
                /
              </kbd>
            </button>
            <Link href="/category/at" className="btn-primary hidden !py-2.5 sm:inline-flex">
              Book a transfer
            </Link>
            <button
              className="rounded-full p-2.5 text-2xl hover:bg-sand-200 lg:hidden"
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="max-h-[calc(100vh-72px)] overflow-y-auto border-t border-sand-200 bg-white lg:hidden">
            <div className="container-x py-6">
              <p className="eyebrow mb-3">Tours</p>
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.code}
                    href={`/category/${c.code}`}
                    className="flex items-center gap-3 rounded-2xl px-3 py-3 hover:bg-white"
                  >
                    <span className="code-chip min-w-[44px] justify-center">{c.code}</span>
                    <span className="text-[15px] font-semibold">{c.title}</span>
                  </Link>
                ))}
              </div>
              <div className="my-5 border-t border-sand-200" />
              <div className="flex flex-col gap-1">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-2xl px-3 py-3 font-display text-2xl hover:bg-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <Link href="/category/at" className="btn-primary mt-5 w-full">
                Book a transfer
              </Link>
              <SocialLinks className="mt-6 justify-center" />
            </div>
          </div>
        )}
      </header>
      <SearchBar open={isSearchOpen} onClose={closeSearch} />
    </>
  );
}

export default Header;
