/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import GalleryUpload from "./UploadGallery";
import {
  FaSearch,
  FaTimes,
  FaFilter,
  FaPlus,
  FaEdit,
  FaTrash,
  FaBox,
  FaDollarSign,
  FaChartLine,
  FaSignOutAlt,
  FaTags,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

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

  const filterProducts = () => {
    let filtered = [...productList];
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.desc.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }
    setFilteredProducts(filtered);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/login");
    }
  };

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, productList]);

  // Get all possible price fields from ALL products (for new product creation)
  const getAllPossiblePriceFields = () => {
    const priceFields = new Set();

    productList.forEach((product) => {
      Object.keys(product).forEach((key) => {
        if (
          key.toLowerCase().includes("price") &&
          key !== "priceLowest" &&
          key !== "priceHighest"
        ) {
          priceFields.add(key);
        }
      });
    });

    return Array.from(priceFields).sort();
  };

  // Get price fields for a specific product (for editing)
  const getProductPriceFields = (product) => {
    if (!product) return [];

    return Object.keys(product)
      .filter(
        (key) =>
          key.toLowerCase().includes("price") &&
          key !== "priceLowest" &&
          key !== "priceHighest"
      )
      .sort();
  };

  // Initialize empty object for price fields (they'll be added as user fills them)
  const initializeEmptyPriceFields = () => {
    return {}; // Start with no price fields - they'll be added when user enters values
  };

  // Format price field names for display
  const formatPriceFieldName = (fieldName) => {
    return fieldName
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/price/gi, "Price")
      .trim();
  };

  const checkMigrationStatus = async () => {
    try {
      const response = await axios.get("/api/migrate");
      setMigrationStatus(response.data);
    } catch (error) {
      console.error("Error checking migration status:", error);
    }
  };

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

    const dynamicPrices = initializeEmptyPriceFields();

    const newProductObject = {
      id: newId,
      title: "",
      desc: "",
      priceLowest: "",
      priceHighest: "",
      ...dynamicPrices,
      category,
      imageExtension: "webp",
    };
    setNewProduct(newProductObject);
  };

  const handleSaveProduct = async () => {
    try {
      await axios.put(`/api/products/${editingProduct.id}`, editingProduct);
      await fetchProducts();
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
      // Filter out empty price fields to keep database clean
      const cleanProduct = { ...newProduct };

      // Remove price fields that are empty or just whitespace
      getAllPossiblePriceFields().forEach((field) => {
        if (
          !cleanProduct[field] ||
          cleanProduct[field].toString().trim() === ""
        ) {
          delete cleanProduct[field];
        }
      });

      console.log("Creating product with clean data:", cleanProduct);

      await axios.post("/api/products", cleanProduct);
      await fetchProducts();
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
        await fetchProducts();
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
      setEditingProduct({ ...editingProduct, imageExtension: fileExtension });
    } else if (newProduct) {
      setNewProduct({ ...newProduct, imageExtension: fileExtension });
    }
  };

  // Calculate stats
  const totalProducts = productList.length;
  const averagePrice =
    productList.length > 0
      ? (
          productList.reduce(
            (sum, p) => sum + parseFloat(p.priceLowest || 0),
            0
          ) / productList.length
        ).toFixed(2)
      : 0;
  const categoryCount = [...new Set(productList.map((p) => p.category))].length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-600 mb-4"></div>
          <p className="text-xl text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <HiSparkles className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Tour Admin
                </h1>
                <p className="text-sm text-gray-500">
                  Manage your tours & products
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg transition-all duration-200 border border-red-200"
            >
              <FaSignOutAlt />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">
                  {totalProducts}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <FaBox className="text-emerald-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg. Price</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${averagePrice}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FaDollarSign className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Categories</p>
                <p className="text-3xl font-bold text-gray-900">
                  {categoryCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FaTags className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Migration Status */}
        {migrationStatus && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-blue-200 p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <FaChartLine className="text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Migration Status
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-xl p-4 border border-blue-100">
                <p className="text-sm text-gray-600">JSON Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {migrationStatus.jsonProductsCount}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-blue-100">
                <p className="text-sm text-gray-600">Firebase Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {migrationStatus.firestoreProductsCount}
                </p>
              </div>
            </div>
            {migrationStatus.migrationNeeded && (
              <button
                onClick={handleMigration}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors font-medium"
              >
                Migrate Products to Firebase
              </button>
            )}
            {migrationStatus.allMigrated && (
              <div className="flex items-center gap-2 text-green-600 font-semibold">
                <span className="text-2xl">✅</span>
                All products migrated successfully
              </div>
            )}
          </div>
        )}

        {/* Search & Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <FaSearch className="text-emerald-600 text-xl" />
            <h2 className="text-xl font-bold text-gray-900">Search & Filter</h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tours by title, ID, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-12 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:w-72">
              <div className="relative">
                <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors appearance-none bg-white"
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
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredProducts.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {productList.length}
              </span>{" "}
              products
            </p>

            {(searchTerm || selectedCategory !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 px-4 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors"
              >
                <FaTimes />
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Create New Product Section */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl shadow-sm border border-emerald-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FaPlus className="text-emerald-600" />
            Create New Tour
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
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
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-xl transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <FaPlus />
              Create Product
            </button>
          </div>

          {/* New Product Form */}
          {newProduct && (
            <div className="mt-6 bg-white rounded-xl p-6 border-2 border-emerald-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                New Product Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newProduct.title}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, title: e.target.value })
                    }
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="Enter tour title"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newProduct.desc}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, desc: e.target.value })
                    }
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                    rows="3"
                    placeholder="Enter tour description"
                  />
                </div>

                {/* Basic Price Fields Section */}
                <div className="md:col-span-2 mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                    <FaDollarSign className="mr-2 text-emerald-600" />
                    Basic Pricing
                  </h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="0.00"
                  />
                </div>

                {/* Location-Specific Pricing Section */}
                <div className="md:col-span-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                    <FaTags className="mr-2 text-emerald-600" />
                    Location-Specific Pricing
                    <span className="ml-2 text-sm text-gray-500 font-normal">
                      ({getAllPossiblePriceFields().length} locations available
                      - only filled fields will be saved)
                    </span>
                  </h3>
                </div>

                {/* Dynamic Price Fields for New Product - ALL possible locations */}
                {getAllPossiblePriceFields().map((priceField) => (
                  <div key={priceField}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {formatPriceFieldName(priceField)}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct[priceField] || ""}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          [priceField]: e.target.value,
                        })
                      }
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="0.00"
                    />
                  </div>
                ))}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                </div>
              </div>

              {/* Debug Preview - Only fields that will be saved */}
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Fields that will be saved:
                </h4>
                <div className="text-xs text-gray-600">
                  {getAllPossiblePriceFields().filter(
                    (field) =>
                      newProduct[field] &&
                      newProduct[field].toString().trim() !== ""
                  ).length > 0 ? (
                    <div className="grid grid-cols-2 gap-1">
                      {getAllPossiblePriceFields()
                        .filter(
                          (field) =>
                            newProduct[field] &&
                            newProduct[field].toString().trim() !== ""
                        )
                        .map((field) => (
                          <div key={field} className="flex justify-between">
                            <span>{formatPriceFieldName(field)}:</span>
                            <span className="text-emerald-600">
                              ${newProduct[field]}
                            </span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      No location prices set yet
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveNewProduct}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl transition-all font-medium"
                >
                  Save Product
                </button>
                <button
                  onClick={() => setNewProduct(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl transition-all font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            All Tours ({filteredProducts.length})
          </h2>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No tours found
              </h3>
              <p className="text-gray-500">
                {searchTerm || selectedCategory !== "all"
                  ? "Try adjusting your filters"
                  : "Start by creating your first tour"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id + product.category + index}
                  className="group bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-emerald-500 hover:shadow-xl transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={`/${product.id.split("-").shift()}/${product.id}.${
                        product.imageExtension
                      }`}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase">
                      {product.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {product.id}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {product.title}
                    </h3>
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-emerald-600">
                        ${product.priceLowest}
                      </span>
                      {product.priceHighest !== product.priceLowest && (
                        <span className="text-sm text-gray-500 ml-1">
                          - ${product.priceHighest}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-3 rounded-xl transition-colors font-medium flex items-center justify-center gap-1"
                      >
                        <FaEdit />
                        <span className="text-sm">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-xl transition-colors font-medium flex items-center justify-center gap-1"
                      >
                        <FaTrash />
                        <span className="text-sm">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Gallery Upload Section */}
        <div className="mt-8">
          <GalleryUpload />
        </div>
      </div>

      {/* Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold">Edit Tour</h2>
              <p className="text-emerald-100 text-sm mt-1">
                Update tour information and details
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={editingProduct?.title || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      title: e.target.value,
                    })
                  }
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                  rows="4"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* Dynamic Price Fields */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaDollarSign className="mr-2 text-emerald-600" />
                  Location-Specific Pricing
                  <span className="ml-2 text-sm text-gray-500 font-normal">
                    ({getProductPriceFields(editingProduct).length} locations)
                  </span>
                </h3>
                {getProductPriceFields(editingProduct).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getProductPriceFields(editingProduct).map((priceField) => (
                      <div key={priceField}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {formatPriceFieldName(priceField)}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={editingProduct?.[priceField] || ""}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              [priceField]: e.target.value,
                            })
                          }
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                          placeholder="0.00"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    This product has no location-specific pricing fields.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload New Image
                </label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 bg-gray-50 rounded-b-2xl">
              <button
                onClick={handleSaveProduct}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 px-6 rounded-xl transition-all font-medium"
              >
                Save Changes
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-xl transition-all font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
