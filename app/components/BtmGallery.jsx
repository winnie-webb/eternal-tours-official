/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const BtmGallery = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    axios.get("/api/gallery").then((res) => {
      setImages(res.data);
    });
  }, []);

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image, index) => (
          <div
            key={index}
            className="border rounded-lg overflow-hidden shadow-md bg-white"
          >
            <img
              src={`/gallery/${image}`}
              alt={`Image ${index + 1}`}
              className="w-full h-60 object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BtmGallery;
