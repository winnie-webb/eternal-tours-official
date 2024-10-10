/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getAllProducts } from "../products/product";
import GalleryUpload from "./UploadGallery";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";

const AdminPanel = () => {
  const products = getAllProducts();
  const [productList, setProductList] = useState(products);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState(null);
  const [category, setCategory] = useState("mpt");
  const [modalOpen, setModalOpen] = useState(false); // State for modal visibility

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login"); // Redirect to login page if not authenticated
      }
    });

    // Cleanup the subscription
    return () => unsubscribe();
  }, [router]);

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setModalOpen(true); // Open modal on edit
  };

  const handleCreateProduct = () => {
    const categoryProducts = productList.filter((p) => p.category === category);
    const lastProduct = categoryProducts[categoryProducts.length - 1];
    const newId = `${category}-${
      parseInt(lastProduct?.id.split("-")[1] || 0) + 1
    }`;

    const newProductObject = {
      id: newId,
      title: "",
      desc: "",
      priceLowest: "",
      priceHighest: "",
      priceFalmouth: "",
      priceLucea: "",
      priceMobay: "",
      priceNegril: "",
      priceOchi: "",
      priceRunaway: "",
      category,
      imageExtension: "", // No image field, but an image extension field
    };

    setNewProduct(newProductObject);
  };

  const handleSaveProduct = () => {
    if (editingProduct) {
      axios
        .put(`/api/products/${editingProduct.id}`, editingProduct)
        .then(() => {
          const updatedProducts = productList.map((p) =>
            p.id === editingProduct.id ? editingProduct : p
          );
          setProductList(updatedProducts);
          setEditingProduct(null);
          setModalOpen(false); // Close modal on save
        });
    }
  };

  const handleSaveNewProduct = () => {
    axios.post("/api/products", newProduct).then((res) => {
      setProductList([...productList, res.data]);
      setNewProduct(null);
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const fileExtension = file?.name.split(".").pop(); // Get the file extension

    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        imageExtension: fileExtension, // Update the image extension field
      });
    } else if (newProduct) {
      setNewProduct({
        ...newProduct,
        imageExtension: fileExtension, // Update the image extension field
      });
    }
  };

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      {/* Products Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productList.map((product, index) => (
          <div
            key={product.id + product.category + index}
            className="border rounded-lg overflow-hidden shadow-md bg-white"
          >
            <img
              src={`/${product.id.split("-").shift()}/${product.id}.${
                product.imageExtension
              }`} // Using the imageExtension field and category
              alt={product.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold">{product.title}</h3>
              <p className="text-sm text-gray-600 my-2">
                ${product.priceLowest} - ${product.priceHighest}
              </p>
              <button
                onClick={() => handleEditProduct(product)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white py-1 px-3 rounded-md"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Editing Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md w-3/4 md:w-1/2">
            <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>
            <pre className="bg-gray-200 p-4 rounded-md">
              {JSON.stringify(editingProduct, null, 2)}
            </pre>
            <textarea
              className="border p-2 rounded-md w-full h-40"
              value={JSON.stringify(editingProduct, null, 2)}
              onChange={(e) => setEditingProduct(JSON.parse(e.target.value))}
            />
            <input type="file" onChange={handleFileUpload} />
            <button
              onClick={handleSaveProduct}
              className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 mt-4 rounded-md"
            >
              Save Product
            </button>
            <button
              onClick={() => setModalOpen(false)}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 mt-4 rounded-md ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* New Product Creation */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">Create New Product</h2>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded-md mb-4"
        >
          <option value="mpt">Most Popular Tours</option>
          <option value="at">Airport Transfers</option>
          <option value="cse">Cruise Shore Excursions</option>
          <option value="ctp">Combo Tour Packages</option>
          <option value="egt">Exclusive Golf Tours</option>
          <option value="st">Shopping Tours</option>
          <option value="abc">Attractions / Beach / City Tours</option>
          <option value="edt">Eating / Dining Tours</option>
        </select>
        <button
          onClick={handleCreateProduct}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mb-4 rounded-md"
        >
          Create New Product
        </button>

        {newProduct && (
          <>
            <pre className="bg-gray-200 p-4 rounded-md">
              {JSON.stringify(newProduct, null, 2)}
            </pre>
            <textarea
              className="border p-2 rounded-md w-full h-40"
              value={JSON.stringify(newProduct, null, 2)}
              onChange={(e) => setNewProduct(JSON.parse(e.target.value))}
            />
            <input type="file" onChange={handleFileUpload} />
            <button
              onClick={handleSaveNewProduct}
              className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 mt-4 rounded-md"
            >
              Save New Product
            </button>
          </>
        )}
      </div>

      <GalleryUpload></GalleryUpload>
    </div>
  );
};

export default AdminPanel;
