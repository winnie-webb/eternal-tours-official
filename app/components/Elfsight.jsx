"use client";
import { useEffect } from "react";

// Guest reviews, rendered by the Elfsight widget.
const ElfSightWidget = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.setAttribute("data-use-service-core", "");
    script.defer = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section className="container-x mt-24">
      <p className="eyebrow">Reviews</p>
      <h2 className="mb-8 mt-2 text-4xl tracking-tight sm:text-5xl">What our guests say.</h2>
      <div
        className="elfsight-app-c9122de4-5952-4800-a0f3-8f813025565f"
        data-elfsight-app-lazy
      />
    </section>
  );
};

export default ElfSightWidget;
