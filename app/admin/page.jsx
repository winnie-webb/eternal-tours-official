/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import GalleryUpload from "./UploadGallery";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";

const AdminPanel = () => {
  const [productList, setProductList] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState(null);
  const [category, setCategory] = useState("mpt");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [migrationStatus, setMigrationStatus] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch products from Firebase
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/products");
      setProductList(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to fetch products. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Check migration status
  const checkMigrationStatus = async () => {
    try {
      const response = await axios.get("/api/migrate");
      setMigrationStatus(response.data);
    } catch (error) {
      console.error("Error checking migration status:", error);
    }
  };

  // Migrate products from JSON to Firebase
  const handleMigration = async () => {
    try {
      const response = await axios.post("/api/migrate");
      alert(
        `Migration successful! ${response.data.migratedCount} products migrated.`
      );
      await fetchProducts();
      await checkMigrationStatus();
    } catch (error) {
      console.error("Migration error:", error);
      alert(
        `Migration failed: ${error.response?.data?.error || error.message}`
      );
    }
  };

  useEffect(() => {
    fetchProducts();
    checkMigrationStatus();
  }, []);

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
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
      imageExtension: "webp",
    };

    setNewProduct(newProductObject);
  };

  const handleSaveProduct = async () => {
    try {
      await axios.put(`/api/products/${editingProduct.id}`, editingProduct);
      await fetchProducts(); // Refresh the list
      setEditingProduct(null);
      setModalOpen(false);
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      alert(
        `Failed to update product: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };

  const handleSaveNewProduct = async () => {
    try {
      await axios.post("/api/products", newProduct);
      await fetchProducts(); // Refresh the list
      setNewProduct(null);
      alert("Product created successfully!");
    } catch (error) {
      console.error("Error creating product:", error);
      alert(
        `Failed to create product: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`/api/products/${productId}`);
        await fetchProducts(); // Refresh the list
        alert("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert(
          `Failed to delete product: ${
            error.response?.data?.error || error.message
          }`
        );
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const fileExtension = file?.name.split(".").pop();

    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        imageExtension: fileExtension,
      });
    } else if (newProduct) {
      setNewProduct({
        ...newProduct,
        imageExtension: fileExtension,
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      {/* Migration Status Section */}
      {migrationStatus && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Migration Status</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>JSON Products: {migrationStatus.jsonProductsCount}</div>
            <div>
              Firebase Products: {migrationStatus.firestoreProductsCount}
            </div>
          </div>
          {migrationStatus.migrationNeeded && (
            <button
              onClick={handleMigration}
              className="mt-3 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              Migrate Products to Firebase
            </button>
          )}
          {migrationStatus.allMigrated && (
            <div className="mt-2 text-green-600 font-semibold">
              ✅ All products are migrated to Firebase
            </div>
          )}
        </div>
      )}

      {/* Products Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {productList.map((product, index) => (
          <div
            key={product.id + product.category + index}
            className="border rounded-lg overflow-hidden shadow-md bg-white"
          >
            <img
              src={`/${product.id.split("-").shift()}/${product.id}.${
                product.imageExtension
              }`}
              alt={product.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold">{product.title}</h3>
              <p className="text-sm text-gray-600 my-2">
                ${product.priceLowest} - ${product.priceHighest}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white py-1 px-3 rounded-md text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Editing Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md w-3/4 md:w-1/2 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={editingProduct?.title || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      title: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={editingProduct?.desc || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      desc: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded-md h-20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Lowest Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct?.priceLowest || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        priceLowest: e.target.value,
                      })
                    }
                    className="w-full border p-2 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Highest Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct?.priceHighest || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        priceHighest: e.target.value,
                      })
                    }
                    className="w-full border p-2 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Image Extension
                </label>
                <input
                  type="text"
                  value={editingProduct?.imageExtension || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      imageExtension: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Upload New Image
                </label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept="image/*"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleSaveProduct}
                className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-md"
              >
                Save Product
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Product Creation */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Create New Product</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded-md"
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
        </div>
        <button
          onClick={handleCreateProduct}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mb-4 rounded-md"
        >
          Create New Product
        </button>

        {newProduct && (
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">New Product Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newProduct.title}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, title: e.target.value })
                  }
                  className="w-full border p-2 rounded-md"
                  placeholder="Enter product title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={newProduct.desc}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, desc: e.target.value })
                  }
                  className="w-full border p-2 rounded-md h-20"
                  placeholder="Enter product description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Lowest Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.priceLowest}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        priceLowest: e.target.value,
                      })
                    }
                    className="w-full border p-2 rounded-md"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Highest Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.priceHighest}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        priceHighest: e.target.value,
                      })
                    }
                    className="w-full border p-2 rounded-md"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Upload Image
                </label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept="image/*"
                />
              </div>
            </div>
            <button
              onClick={handleSaveNewProduct}
              className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 mt-4 rounded-md"
            >
              Save New Product
            </button>
            <button
              onClick={() => setNewProduct(null)}
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 mt-4 ml-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <GalleryUpload />
    </div>
  );
};

export default AdminPanel;
