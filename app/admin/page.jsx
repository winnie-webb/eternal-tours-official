/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import GalleryUpload from "./UploadGallery";

import { FaSearch, FaTimes, FaFilter } from "react-icons/fa";

const AdminPanel = () => {
  const [productList, setProductList] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState(null);
  const [category, setCategory] = useState("mpt");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [migrationStatus, setMigrationStatus] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify");
        if (!response.ok) {
          router.push("/login");
          return;
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  // Fetch products from Firebase
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/products");
      setProductList(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to fetch products. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search term and category
  const filterProducts = () => {
    let filtered = [...productList];

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.desc.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    setFilteredProducts(filtered);
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Force redirect even if logout fails
      router.push("/login");
    }
  };

  // Effect to filter products when search term or category changes
  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, productList]);

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
        >
          Logout
        </button>
      </div>

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

      {/* Search and Filter Section */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <FaSearch className="text-emerald-600" />
          <h2 className="text-xl font-semibold">Search & Filter Products</h2>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              Search Products
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, ID, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-md pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="md:w-64">
            <label className="block text-sm font-medium mb-1">
              <FaFilter className="inline mr-1" />
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Categories</option>
              <option value="mpt">Most Popular Tours</option>
              <option value="at">Airport Transfers</option>
              <option value="cse">Cruise Shore Excursions</option>
              <option value="ctp">Combo Tour Packages</option>
              <option value="egt">Exclusive Golf Tours</option>
              <option value="st">Shopping Tours</option>
              <option value="abc">Attractions / Beach / City Tours</option>
              <option value="edt">Eating / Dining Tours</option>
              <option value="ncb">Night Club / Bar</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-3 text-sm text-gray-600">
          Showing {filteredProducts.length} of {productList.length} products
          {searchTerm && ` for "${searchTerm}"`}
          {selectedCategory !== "all" && ` in category "${selectedCategory}"`}
        </div>

        {/* Quick Actions and Clear Filters */}
        <div className="flex flex-wrap items-center justify-between mt-4 gap-2">
          <div className="flex flex-wrap gap-2">
            {/* Quick Category Filters */}
            <span className="text-sm text-gray-600">Quick filters:</span>
            {["mpt", "at", "ctp", "abc"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                  selectedCategory === cat
                    ? "bg-emerald-100 border-emerald-300 text-emerald-700"
                    : "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Clear Filters */}
          {(searchTerm || selectedCategory !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-800 px-2 py-1 rounded border border-emerald-200 hover:bg-emerald-50 transition-colors"
            >
              <FaTimes className="text-xs" />
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Products Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Products ({filteredProducts.length})
        </h2>
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No products found
            </h3>
            <p className="text-gray-500">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search terms or filters"
                : "No products available"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id + product.category + index}
                className={`border rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow ${
                  searchTerm &&
                  (product.title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                    product.id.toLowerCase().includes(searchTerm.toLowerCase()))
                    ? "ring-2 ring-emerald-200"
                    : ""
                }`}
              >
                <div className="relative">
                  <img
                    src={`/${product.id.split("-").shift()}/${product.id}.${
                      product.imageExtension
                    }`}
                    alt={product.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                    {product.category.toUpperCase()}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      ID: {product.id}
                    </span>
                  </div>
                  <h3
                    className="text-lg font-bold mb-2 line-clamp-2"
                    title={product.title}
                  >
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-semibold text-emerald-600">
                      ${product.priceLowest}
                    </span>
                    {product.priceHighest !== product.priceLowest && (
                      <span> - ${product.priceHighest}</span>
                    )}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-1 px-3 rounded-md text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
