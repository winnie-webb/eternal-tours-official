/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";

const BUNDLED = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `/local/hero-${n}.jpg`);

// A slow, endless strip of guest photos: the bundled set plus anything the
// admin has uploaded to the gallery.
function Gallery() {
  const [photos, setPhotos] = useState(BUNDLED);

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => (res.ok ? res.json() : []))
      .then((images) => {
        const extra = images.map((img) => img.url).filter((url) => !BUNDLED.includes(url));
        if (extra.length) setPhotos([...extra, ...BUNDLED]);
      })
      .catch(() => {});
  }, []);

  // Rendered twice so the -50% translate loops seamlessly
  const strip = [...photos, ...photos];

  return (
    <section className="mt-24 overflow-hidden" aria-label="Photos from our tours">
      <div className="container-x mb-8 flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-4xl tracking-tight sm:text-5xl">Gallery</h2>
      </div>
      <div className="group relative">
        <div className="flex w-max animate-drift gap-4 group-hover:[animation-play-state:paused]">
          {strip.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className={`relative h-72 w-56 shrink-0 overflow-hidden rounded-3xl bg-sand-200 sm:h-96 sm:w-72 ${
                i % 2 ? "mt-8" : ""
              }`}
            >
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Gallery;
