"use client";
import { useEffect } from "react";

const ElfSightWidget = () => {
  useEffect(() => {
    // Add the script to the document
    const script = document.createElement("script");
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.setAttribute("data-use-service-core", "");
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // Clean up the script when component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      className="elfsight-app-c9122de4-5952-4800-a0f3-8f813025565f"
      data-elfsight-app-lazy
    ></div>
  );
};

export default ElfSightWidget;
