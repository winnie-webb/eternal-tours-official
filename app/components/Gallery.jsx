import Image from "next/image";
import React from "react";

function Gallery() {
  // array of images

  const images = [
    "hero-1.jpg",
    "hero-2.jpg",
    "hero-3.jpg",
    "hero-4.jpg",
    "hero-5.jpg",
    "hero-6.jpg",
    "hero-7.jpg",
    "hero-8.jpg",
  ];

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-4 xl:p-10">
      {images.map((image, index) => (
        <div key={index} className="relative w-full h-48 lg:h-72">
          <Image
            className="object-cover"
            fill={true}
            src={`/local/${image}`}
            alt={image}
          />
        </div>
      ))}
    </section>
  );
}

export default Gallery;
