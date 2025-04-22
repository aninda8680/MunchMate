import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShoppingCart,
  FiSearch,
  FiXCircle,
  FiMinus,
  FiPlus,
  FiShoppingBag,
} from "react-icons/fi";
import { db } from "../config"; // Firebase config file
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Import for navigation
import { useCart } from "../context/CartContext"; // Add this import
import Squares from "./Squares"; // Import the Squares component

const Menu = () => {
  const { cart, addToCart, removeFromCart, decreaseQuantity } = useCart(); // Add decreaseQuantity
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const navigate = useNavigate?.() || { push: () => {} }; // Fallback if useNavigate not available

  // Optimize fetching by using useCallback
  const fetchMenuItems = useCallback(async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "menu"));
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Extract unique categories
      const uniqueCategories = [...new Set(items.map((item) => item.category))];
      setCategories(["All", ...uniqueCategories]);
      setMenuItems(items);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  // Memoize filtered items to prevent unnecessary recalculations
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [menuItems, searchTerm, activeCategory]);

  // Get item quantity in cart - updated to count identical items
  const getItemQuantity = useCallback(
    (itemId) => {
      return cart.filter((item) => item.id === itemId).length;
    },
    [cart]
  );

  // Calculate total cart quantity
  const getTotalCartQuantity = useCallback(() => {
    return cart.length;
  }, [cart]);

  // Check if cart has any items
  const hasItemsInCart = useMemo(() => {
    return cart.length > 0;
  }, [cart]);

  // Navigate to cart
  const handleGoToCart = useCallback(() => {
    navigate("/cart");
  }, [navigate]);

  // Safe check for window object
  const isBrowser = typeof window !== "undefined";

  return (
    <div className="relative min-h-screen pt-30 pb-24 px-4 md:px-8 lg:px-16">
      {/* Fixed background */}
      <div className="fixed inset-0 -z-10 bg-black">
        <div className="absolute inset-0 w-full h-full opacity-20">
          {isBrowser && window.innerWidth > 768 && (
            <Squares
              direction="diagonal"
              speed={0.5}
              borderColor="#ff4800"
              squareSize={50}
              hoverFillColor="#ff480033"
            />
          )}
        </div>
        <div className="absolute inset-0 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#ff4800_100%)] opacity-60"></div>
      </div>

      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent">
          Our Menu
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-base">
          Explore our delicious offerings crafted with care.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        {/* Search bar */}
        <div className="relative w-full">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500" />
          <input
            type="text"
            placeholder="Search menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 rounded-full border border-orange-600 focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50 transition-all duration-300 bg-black bg-opacity-70 text-white text-base"
          />
        </div>

        {/* Category filter */}
        <div className="overflow-x-auto pb-2 -mx-4 px-4">
          <div className="flex space-x-2 min-w-max">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  activeCategory === category
                    ? "bg-gradient-to-r from-orange-600 to-red-600 text-white"
                    : "bg-black bg-opacity-70 text-gray-300 border border-orange-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="w-12 h-12 border-4 border-orange-800 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-400">
            No items found. Try another search term or category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredItems.map((item) => {
            const isUnavailable = item.isAvailable === false;
            const itemQuantity = getItemQuantity(item.id);

            return (
              <div
                key={item.id}
                className={`bg-black bg-opacity-70 rounded-xl overflow-hidden border border-orange-900 ${
                  isUnavailable ? "opacity-75" : "shadow-md"
                } transition-all duration-300`}
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={
                      item.image ||
                      "https://via.placeholder.com/400x300?text=Food+Image"
                    }
                    alt={item.name}
                    className={`w-full h-full object-cover ${
                      isUnavailable ? "grayscale" : ""
                    }`}
                    loading="lazy"
                  />
                  {item.isNew && !isUnavailable && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      NEW
                    </div>
                  )}
                  {item.isPopular && !isUnavailable && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      POPULAR
                    </div>
                  )}
                  {isUnavailable && (
                    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
                      <FiXCircle className="text-orange-500 text-3xl mb-1" />
                      <span className="text-orange-500 text-base font-bold px-3 py-1 bg-black bg-opacity-70 rounded-lg">
                        NOT AVAILABLE
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3
                      className={`text-lg font-bold ${
                        isUnavailable ? "text-gray-500" : "text-gray-200"
                      }`}
                    >
                      {item.name}
                    </h3>
                    <div
                      className={`text-lg font-bold ${
                        isUnavailable
                          ? "text-gray-500"
                          : "bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent"
                      }`}
                    >
                      Rs {item.price?.toFixed(2) || "9.99"}
                    </div>
                  </div>
                  {!isUnavailable && (
                    <>
                      {itemQuantity > 0 ? (
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            className="flex items-center justify-center bg-gradient-to-r from-orange-800 to-red-800 text-white h-10 w-10 rounded-full active:scale-95 transition-transform"
                          >
                            <FiMinus />
                          </button>

                          <div className="text-gray-200 font-semibold">
                            {itemQuantity} in cart
                          </div>

                          <button
                            onClick={() => addToCart(item)}
                            className="flex items-center justify-center bg-gradient-to-r from-orange-600 to-red-600 text-white h-10 w-10 rounded-full active:scale-95 transition-transform"
                          >
                            <FiPlus />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 rounded-full w-full active:scale-95 transition-transform"
                        >
                          <FiShoppingCart />
                          <span>Add to Cart</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Go to Cart button - fixed at bottom */}
      {hasItemsInCart && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <button
            onClick={handleGoToCart}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-full shadow-lg active:scale-95 transition-transform"
          >
            <FiShoppingBag className="text-xl" />
            <span className="font-semibold">
              Go to Cart ({getTotalCartQuantity()})
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Menu;
