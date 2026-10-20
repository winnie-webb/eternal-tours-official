/* eslint-disable @next/next/no-img-element */
"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FiLoader, FiTrash2, FiUploadCloud } from "react-icons/fi";
import { uploadImage } from "@/lib/compressImage";

export default function GalleryAdmin() {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(0);
  const fileRef = useRef(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/gallery", { cache: "no-store" });
    if (res.ok) setImages(await res.json());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleFiles = async (files) => {
    const list = [...(files || [])].filter((f) => f.type.startsWith("image/"));
    if (!list.length) return;
    setUploading(list.length);
    for (const file of list) {
      try {
        const url = await uploadImage(file);
        const res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        if (!res.ok) throw new Error((await res.json()).error || "Upload failed");
      } catch (error) {
        toast.error(`${file.name}: ${error.message}`);
      }
      setUploading((n) => n - 1);
    }
    toast.success("Gallery updated");
    load();
  };

  const remove = async (image) => {
    if (!confirm("Remove this photo from the site?")) return;
    const res = await fetch(`/api/gallery?id=${image.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Photo removed");
      load();
    } else {
      toast.error("Couldn't remove that photo");
    }
  };

  return (
    <div>
      <p className="eyebrow">Gallery</p>
      <h1 className="mt-1 text-4xl tracking-tight">Guest photos</h1>
      <p className="mt-1 max-w-xl text-sm text-ink-muted">
        Photos here scroll across the home and About pages, alongside the eight that ship with the site.
      </p>

      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className="mt-8 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-sand-300 bg-white p-10 text-center transition hover:border-jett-500 hover:bg-jett-50"
      >
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-ink text-2xl text-sun-300">
          {uploading ? <FiLoader className="animate-spin" /> : <FiUploadCloud />}
        </span>
        <p className="mt-2 font-semibold">
          {uploading ? `Uploading ${uploading} photo${uploading === 1 ? "" : "s"}…` : "Drop photos here or click to choose"}
        </p>
        <p className="text-sm text-ink-muted">You can pick several at once. They&apos;re resized automatically.</p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {images.length === 0 && (
        <p className="mt-8 text-sm text-ink-muted">No uploaded photos yet — the site is showing its eight built-in ones.</p>
      )}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {images.map((image) => (
          <figure key={image.url} className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand-200">
            <img src={image.url} alt="" loading="lazy" className="h-full w-full object-cover" />
            <button
              onClick={() => remove(image)}
              className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-red-600 opacity-0 shadow transition hover:bg-white group-hover:opacity-100 focus:opacity-100"
              aria-label="Remove photo"
            >
              <FiTrash2 />
            </button>
          </figure>
        ))}
      </div>
    </div>
  );
}
