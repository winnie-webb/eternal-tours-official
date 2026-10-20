/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiEdit2, FiPlus, FiSearch, FiTrash2, FiX } from "react-icons/fi";
import ProductEditor from "./ProductEditor";
import { CATEGORIES, formatMoney, getCategory, nextProductId, priceKeys, productImage } from "@/lib/catalog";

const AdminPanel = () => {
  const [productList, setProductList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newCategory, setNewCategory] = useState("mpt");
  const [editor, setEditor] = useState(null); // { product, isNew }
  const [loading, setLoading] = useState(true);
  const [migrationStatus, setMigrationStatus] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get("/api/products");
      setProductList(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Couldn't load tours — check your connection");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    axios
      .get("/api/migrate")
      .then((res) => setMigrationStatus(res.data))
      .catch(() => {});
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return productList
      .filter((p) => selectedCategory === "all" || p.category === selectedCategory)
      .filter(
        (p) =>
          !term ||
          p.title?.toLowerCase().includes(term) ||
          p.id?.toLowerCase().includes(term) ||
          p.desc?.toLowerCase().includes(term)
      )
      // Natural order: mpt-2 before mpt-10
      .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
  }, [productList, searchTerm, selectedCategory]);

  // Which location price fields to offer a new product in this category
  const locationFields = useMemo(() => {
    const collect = (list) => [...new Set(list.flatMap(priceKeys))].sort();
    const category = editor?.product.category;
    return {
      inCategory: collect(productList.filter((p) => p.category === category)),
      all: collect(productList),
    };
  }, [productList, editor]);

  const counts = useMemo(() => {
    const c = {};
    productList.forEach((p) => (c[p.category] = (c[p.category] || 0) + 1));
    return c;
  }, [productList]);

  const openNew = () => {
    setEditor({
      isNew: true,
      product: {
        id: nextProductId(productList, newCategory),
        title: "",
        desc: "",
        priceLowest: "",
        priceHighest: "",
        category: newCategory,
        imageExtension: "webp",
      },
    });
  };

  const handleSave = async (draft, fields) => {
    try {
      if (editor.isNew) {
        // Only keep the location prices that were filled in
        const clean = { ...draft };
        fields.forEach((f) => {
          if (String(clean[f] ?? "").trim() === "") delete clean[f];
        });
        // Re-check against the latest list in case another admin added one
        clean.id = nextProductId(productList, clean.category);
        await axios.post("/api/products", clean);
        toast.success(`Created ${clean.id}`);
      } else {
        await axios.put(`/api/products/${draft.id}`, draft);
        toast.success("Saved");
      }
      setEditor(null);
      await fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(error.response?.data?.error || error.message);
      await fetchProducts();
    }
  };

  const handleDelete = async (product) => {
    if (!confirm(`Delete "${product.title}"? Guests will no longer be able to book it.`)) return;
    try {
      await axios.delete(`/api/products/${product.id}`);
      toast.success("Tour deleted");
      await fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error.response?.data?.error || error.message);
    }
  };

  const handleMigration = async () => {
    try {
      const response = await axios.post("/api/migrate");
      toast.success(`Migrated ${response.data.migratedCount} products`);
      await fetchProducts();
      setMigrationStatus((await axios.get("/api/migrate")).data);
    } catch (error) {
      toast.error(`Migration failed: ${error.response?.data?.error || error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-sand-200 border-t-jett-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Catalogue</p>
          <h1 className="mt-1 text-4xl tracking-tight">Tours &amp; transfers</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {productList.length} live · {Object.keys(counts).length} categories
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white p-1.5 shadow-ticket ring-1 ring-sand-200">
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="cursor-pointer rounded-full bg-transparent py-2 pl-4 pr-2 text-sm font-semibold outline-none"
            aria-label="Category for the new tour"
          >
            {CATEGORIES.map((c) => (
              <option key={c.code} value={c.code}>{c.title}</option>
            ))}
          </select>
          <button onClick={openNew} className="btn-primary !py-2.5">
            <FiPlus /> New tour
          </button>
        </div>
      </div>

      {migrationStatus?.migrationNeeded && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-sun-100 p-5">
          <p className="text-sm">
            <strong>{migrationStatus.jsonProductsCount}</strong> products in the bundled file,{" "}
            <strong>{migrationStatus.firestoreProductsCount}</strong> in the database.
          </p>
          <button onClick={handleMigration} className="btn-primary !py-2.5">Migrate to database</button>
        </div>
      )}

      {/* Filters */}
      <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative lg:w-80">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search title, id or description"
            className="field !rounded-full !py-2.5 !pl-11 !pr-10"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-muted hover:text-ink" aria-label="Clear search">
              <FiX />
            </button>
          )}
        </div>
        <div className="scroll-row !mx-0 !gap-2 !px-0 !pb-0">
          {[{ code: "all", short: "All" }, ...CATEGORIES].map((c) => {
            const n = c.code === "all" ? productList.length : counts[c.code] || 0;
            if (c.code !== "all" && !n) return null;
            const active = selectedCategory === c.code;
            return (
              <button
                key={c.code}
                onClick={() => setSelectedCategory(c.code)}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  active ? "border-ink bg-ink text-white" : "border-sand-300 bg-white hover:border-ink/40"
                }`}
              >
                {c.short}
                <span className={`font-mono text-[11px] ${active ? "text-sun-300" : "text-ink-muted"}`}>{n}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      {filteredProducts.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-sand-300 p-12 text-center">
          <p className="font-display text-2xl">No tours match.</p>
          <p className="mt-1 text-ink-muted">Try a different search or category.</p>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-sand-200 overflow-hidden rounded-3xl bg-white ring-1 ring-sand-200">
          {filteredProducts.map((product) => (
            <li key={product.id} className="group flex items-center gap-4 p-3 pr-4 transition hover:bg-sand-50 sm:gap-5">
              <img
                src={productImage(product)}
                alt=""
                loading="lazy"
                className="h-16 w-16 shrink-0 rounded-xl bg-sand-200 object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-xs text-ink-muted">
                  <span className="code-chip">{product.category}</span>
                  <span className="font-mono">{product.id}</span>
                  <span className="hidden sm:inline">· {getCategory(product.category).short}</span>
                </p>
                <p className="mt-1 line-clamp-1 font-semibold text-ink">{product.title}</p>
              </div>
              <p className="hidden text-right font-mono text-sm sm:block">
                ${formatMoney(product.priceLowest)}
                {product.priceHighest !== product.priceLowest && (
                  <span className="text-ink-muted">–{formatMoney(product.priceHighest)}</span>
                )}
                <span className="block text-[11px] text-ink-muted">{priceKeys(product).length} locations</span>
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => setEditor({ isNew: false, product })}
                  className="grid h-10 w-10 place-items-center rounded-full text-ink-muted transition hover:bg-jett-50 hover:text-jett-700"
                  aria-label={`Edit ${product.title}`}
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={() => handleDelete(product)}
                  className="grid h-10 w-10 place-items-center rounded-full text-ink-muted transition hover:bg-red-50 hover:text-red-600"
                  aria-label={`Delete ${product.title}`}
                >
                  <FiTrash2 />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editor && (
        <ProductEditor
          key={editor.product.id}
          product={editor.product}
          isNew={editor.isNew}
          locationFields={locationFields}
          onClose={() => setEditor(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default AdminPanel;
