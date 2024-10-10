import React, { useState } from "react";
import axios from "axios";

const GalleryUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null); // State to store the selected file

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file); // Store the selected file
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile); // Use the same field name as defined in multer

    try {
      const res = await axios.post("/api/gallery/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res.data); // Log the server response
      setSelectedFile(null); // Clear the selected file after upload
    } catch (err) {
      console.error("Error uploading image:", err.message);
      console.log(selectedFile);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold">Gallery Upload</h2>
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mt-4 rounded-md"
      >
        Upload Image
      </button>
    </div>
  );
};

export default GalleryUpload;
