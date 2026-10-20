/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiImage, FiLoader, FiUploadCloud, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { CATEGORIES, priceKeys, productImage } from "@/lib/catalog";
import { uploadImage } from "@/lib/compressImage";

// Readable label for keys like "priceMobay" or "Riu Ocho Rios Price"
function formatPriceFieldName(fieldName) {
  return fieldName
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^price\s*/i, "")
    .replace(/\s*price$/i, "")
    .trim();
}

// Slide-over used for both "new tour" and "edit tour".
// `locationFields` are the price keys this category's products use.
export default function ProductEditor({ product, isNew, locationFields, onClose, onSave }) {
  const [draft, setDraft] = useState(product);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(productImage(product));
  const [showAllLocations, setShowAllLocations] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !saving && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, saving]);

  // Editing shows the fields the product already has; creating offers the
  // fields its category uses (optionally every location we know about).
  const fields = useMemo(() => {
    if (!isNew) return priceKeys(draft).sort();
    const own = locationFields.inCategory;
    return showAllLocations ? locationFields.all : own.length ? own : locationFields.all;
  }, [isNew, draft, locationFields, showAllLocations]);

  const set = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  const handleImage = async (file) => {
    if (!file) return;
    setUploading(true);
    setPreview(URL.createObjectURL(file));
    try {
      const url = await uploadImage(file);
      set("imageUrl", url);
      toast.success("Photo uploaded");
    } catch (error) {
      toast.error(error.message);
      setPreview(productImage(draft));
    } finally {
      setUploading(false);
    }
  };

  const filledPrices = fields.filter((f) => String(draft[f] ?? "").trim() !== "");
  const canSave = draft.title?.trim() && draft.priceLowest !== "" && draft.priceHighest !== "" && !uploading;

  const submit = async (e) => {
    e.preventDefault();
    if (!canSave) return;
    setSaving(true);
    try {
      await onSave(draft, fields);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/50 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && !saving && onClose()}>
      <form onSubmit={submit} className="flex h-full w-full max-w-2xl animate-rise flex-col bg-white shadow-lift">
        <div className="flex items-center justify-between border-b border-sand-200 px-6 py-4">
          <div>
            <p className="eyebrow">{isNew ? "New tour" : "Edit tour"}</p>
            <p className="mt-0.5 flex items-center gap-2 font-mono text-sm">
              <span className="code-chip">{draft.category}</span> {draft.id}
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-xl text-ink-muted hover:bg-sand-100 hover:text-ink" aria-label="Close">
            <FiX />
          </button>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
          {/* Photo */}
          <section>
            <p className="field-label">Photo</p>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleImage(e.dataTransfer.files?.[0]);
              }}
              className="group relative flex cursor-pointer items-center gap-5 rounded-2xl border-2 border-dashed border-sand-300 p-4 transition hover:border-jett-500 hover:bg-jett-50"
            >
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-sand-200">
                {preview ? (
                  <img src={preview} alt="" className="h-full w-full object-cover" onError={() => setPreview(null)} />
                ) : (
                  <span className="grid h-full w-full place-items-center text-3xl text-ink-muted"><FiImage /></span>
                )}
                {uploading && (
                  <span className="absolute inset-0 grid place-items-center bg-ink/50 text-2xl text-white">
                    <FiLoader className="animate-spin" />
                  </span>
                )}
              </div>
              <div className="text-sm">
                <p className="flex items-center gap-2 font-semibold text-ink">
                  <FiUploadCloud /> {uploading ? "Uploading…" : "Drop a photo or click to choose"}
                </p>
                <p className="mt-1 text-ink-muted">
                  Square photos look best. Large images are shrunk automatically.
                </p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImage(e.target.files?.[0])}
              />
            </div>
          </section>

          {/* Basics */}
          <section className="grid gap-5 sm:grid-cols-2">
            {isNew && (
              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="ed-category">Category</label>
                <select id="ed-category" className="field" value={draft.category} disabled>
                  {CATEGORIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.title}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="ed-title">Title</label>
              <input id="ed-title" className="field" value={draft.title || ""} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Dunn's River Falls & Blue Hole" required />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="ed-desc">Description</label>
              <textarea id="ed-desc" rows={4} className="field" value={draft.desc || ""} onChange={(e) => set("desc", e.target.value)} placeholder="What guests will see and do" />
            </div>
            <div>
              <label className="field-label" htmlFor="ed-low">Lowest price (USD / person)</label>
              <input id="ed-low" type="number" step="0.01" min="0" className="field" value={draft.priceLowest ?? ""} onChange={(e) => set("priceLowest", e.target.value)} required />
            </div>
            <div>
              <label className="field-label" htmlFor="ed-high">Highest price (USD / person)</label>
              <input id="ed-high" type="number" step="0.01" min="0" className="field" value={draft.priceHighest ?? ""} onChange={(e) => set("priceHighest", e.target.value)} required />
            </div>
          </section>

          {/* Location prices */}
          <section>
            <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="field-label !mb-0">Prices by pick-up location</p>
                <p className="field-hint">
                  {filledPrices.length} of {fields.length} set · only filled locations are offered to guests
                </p>
              </div>
              {isNew && locationFields.inCategory.length > 0 && (
                <button type="button" onClick={() => setShowAllLocations((v) => !v)} className="text-sm font-semibold text-jett-600 hover:underline">
                  {showAllLocations ? "Only this category's locations" : `Show all ${locationFields.all.length} locations`}
                </button>
              )}
            </div>
            {fields.length === 0 ? (
              <p className="rounded-xl bg-sand-100 p-4 text-sm text-ink-muted">This tour has no location prices.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {fields.map((field) => (
                  <label key={field} className="flex items-center gap-3 rounded-xl border border-sand-200 py-1.5 pl-3 pr-1.5 focus-within:border-jett-500 focus-within:ring-4 focus-within:ring-jett-100">
                    <span className="min-w-0 flex-1 truncate text-sm text-ink-soft" title={formatPriceFieldName(field)}>
                      {formatPriceFieldName(field)}
                    </span>
                    <span className="flex items-center rounded-lg bg-sand-100 pl-2">
                      <span className="text-sm text-ink-muted">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={draft[field] ?? ""}
                        onChange={(e) => set(field, e.target.value)}
                        className="w-20 bg-transparent px-2 py-1.5 font-mono text-sm outline-none"
                        placeholder="—"
                      />
                    </span>
                  </label>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="flex gap-3 border-t border-sand-200 px-6 py-4">
          <button type="submit" disabled={!canSave || saving} className="btn-primary flex-1">
            {saving ? (<><FiLoader className="animate-spin" /> Saving…</>) : isNew ? "Create tour" : "Save changes"}
          </button>
          <button type="button" onClick={onClose} disabled={saving} className="btn-ghost">Cancel</button>
        </div>
      </form>
    </div>
  );
}
