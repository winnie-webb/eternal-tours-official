"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { FiSearch, FiX, FiArrowUpRight } from "react-icons/fi";
import { searchProduct } from "../products/product";
import { formatMoney, getCategory, productImage } from "@/lib/catalog";

// Full-screen search, opened from the header button, "/" or Ctrl/Cmd+K.
// Other components open it by dispatching a "jett:search" window event.
function SearchBar({ open, onClose }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  const performSearch = useCallback(async (term) => {
    if (!term.trim()) {
      setProducts([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      setProducts(await searchProduct(term));
    } catch (error) {
      console.error("Search error:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => performSearch(searchTerm), 250);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, performSearch]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const close = () => {
    setSearchTerm("");
    setProducts([]);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-ink/60 px-4 pt-[10vh] backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
      role="dialog"
      aria-modal="true"
      aria-label="Search tours"
    >
      <div className="w-full max-w-2xl animate-rise overflow-hidden rounded-3xl bg-sand-50 shadow-lift">
        <div className="flex items-center gap-3 border-b border-sand-200 px-5">
          <FiSearch className="shrink-0 text-xl text-ink-muted" />
          <input
            ref={inputRef}
            id="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent py-5 text-lg text-ink outline-none placeholder:text-ink-muted/60"
            placeholder="Dunn's River, Negril, airport transfer…"
            autoComplete="off"
          />
          <button
            onClick={close}
            className="rounded-full p-2 text-ink-muted hover:bg-sand-200 hover:text-ink"
            aria-label="Close search"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {isLoading ? (
            <p className="px-4 py-8 text-center text-sm text-ink-muted">
              Searching…
            </p>
          ) : products.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-ink-muted">
              {searchTerm.trim()
                ? "No tours match that — try a town or an attraction."
                : "Search every tour and transfer we run across Jamaica."}
            </p>
          ) : (
            products.map((product) => (
              <Link
                href={`/product/${product.id}`}
                key={product.id}
                onClick={close}
                className="group flex items-center gap-4 rounded-2xl p-3 transition hover:bg-white"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-sand-200">
                  <Image
                    alt=""
                    fill
                    sizes="56px"
                    src={productImage(product)}
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-[15px] font-semibold text-ink">
                    {product.title}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {getCategory(product.category).title}
                  </p>
                </div>
                <p className="font-mono text-sm font-semibold text-ink">
                  ${formatMoney(product.priceLowest)}
                </p>
                <FiArrowUpRight className="text-ink-muted transition group-hover:text-jett-600" />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
