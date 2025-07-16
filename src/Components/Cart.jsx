import React, { useEffect, useState } from "react";
import { Plus, Minus, ShoppingCart, Trash2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BASE_API_URL from "./Baseurl";
import axios from "axios";

const Cart = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  // Get user ID from localStorage (original functionality)
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // Fetch cart items from API (original functionality restored)
  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    axios
      .get(`https://mahi-jewel-backend.onrender.com/api/cart`, {
        params: { userId },
      })
      .then((res) => {
        setItems(res.data);
        setLoading(false);
        // Debug log: print all cart item IDs after fetch
        console.log(
          "Fetched cart items:",
          res.data.map((item) => item._id)
        );
      })
      .catch((error) => {
        console.error("Error fetching cart:", error);
        setItems([]);
        setLoading(false);
      });
  }, [userId]);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );

    // Update quantity in backend
    axios
      .put(`https://mahi-jewel-backend.onrender.com/api/cart/${itemId}`, {
        quantity: newQuantity,
      })
      .catch((error) => {
        console.error("Error updating quantity:", error);
        // Revert on error
        setItems((prevItems) =>
          prevItems.map((item) =>
            item._id === itemId ? { ...item, quantity: item.quantity } : item
          )
        );
      });
  };

  const fetchCart = () => {
    setLoading(true);
    axios
      .get(`${BASE_API_URL}/api/cart`, { params: { userId } })
      .then((res) => {
        setItems(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cart:", error);
        setItems([]);
        setLoading(false);
      });
  };

  const removeItem = (itemId) => {
    setDeletingId(itemId);
    setDeleteError("");
    axios
      .delete(`https://mahi-jewel-backend.onrender.com/api/cart/${itemId}`)
      .then((res) => {
        if (res.status !== 200 && res.status !== 204) {
          throw new Error("Failed to delete item from backend");
        }
        fetchCart();
      })
      .catch((error) => {
        setDeleteError("Failed to remove item. Please try again.");
        console.error("Error removing item:", error);
      })
      .finally(() => {
        setDeletingId(null);
      });
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateGST = (subtotal) => {
    return subtotal * 0.18; // 18% GST
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const gst = calculateGST(subtotal);
    return subtotal + gst;
  };

  const handleBuyNow = () => {
    alert(`Proceeding to checkout with total: ₹${calculateTotal().toFixed(2)}`);
    navigate("/order"); // Navigate to checkout page
    // In real implementation, redirect to checkout page
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-lg">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Access Required
          </h3>
          <p className="text-gray-500">Please login to view your cart.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Mahi Jewels Logo and Brand */}
        <div className="flex flex-col items-center mb-8 animate-fade-in-down">
          <img
            src="/mahi.logo.jpg"
            alt="MahiJewels Logo"
            className="h-16 w-16 mb-2 rounded-full shadow-lg animate-bounce-slow"
          />
          <h1 className="text-4xl font-extrabold text-amber-400 tracking-wide mb-1 animate-fade-in">
            Mahi <span className="text-gray-900">Jewels</span>
          </h1>
        </div>
        {/* Header */}
        <div className="mb-6 sm:mb-8 animate-fade-in-up">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2 sm:gap-3">
            <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
            Shopping Cart
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Review your items and proceed to checkout
          </p>
        </div>

        {deleteError && (
          <div className="mb-6 bg-red-100 border border-red-300 rounded-lg p-4 text-red-700 text-center">
            {deleteError}
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-center py-12 sm:py-16 animate-fade-in">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 max-w-md mx-auto shadow-lg">
              <ShoppingBag className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4 sm:mb-6" />
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 sm:mb-3">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
                Looks like you haven't added any items yet.
              </p>
              <button
                onClick={() => navigate("/product")}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-fade-in-up">
            {/* Cart Items */}
            <div className="xl:col-span-2 space-y-4">
              {items.map((item, idx) => (
                <div
                  key={item._id}
                  className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:bg-gray-50 transition-all duration-300 animate-fade-in-up shadow"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {/* Desktop Layout */}
                  <div className="hidden sm:flex items-center gap-6">
                    {/* Product Image */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={item.image || "/api/placeholder/80/80"}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg shadow-lg"
                        onError={(e) => {
                          e.target.src = "/api/placeholder/80/80";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-lg"></div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-xl text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-gray-700 text-lg">₹{item.price}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity - 1)
                        }
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4 text-gray-700" />
                      </button>
                      <span className="mx-3 min-w-8 text-center text-gray-900 font-semibold text-lg">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                      >
                        <Plus className="w-4 h-4 text-gray-700" />
                      </button>
                    </div>

                    {/* Item Total & Remove */}
                    <div className="text-right">
                      <div className="font-bold text-xl text-gray-900 mb-2">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors duration-200 disabled:opacity-50"
                        disabled={deletingId === item._id}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm">
                          {deletingId === item._id ? "Removing..." : "Remove"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="sm:hidden">
                    <div className="flex gap-4 mb-4">
                      {/* Product Image */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={item.image || "/api/placeholder/80/80"}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg shadow-lg"
                          onError={(e) => {
                            e.target.src = "/api/placeholder/80/80";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-lg"></div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-gray-700 text-base">₹{item.price}</p>
                        <div className="mt-2 font-bold text-lg text-gray-900">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Mobile Controls */}
                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4 text-gray-700" />
                        </button>
                        <span className="mx-3 min-w-8 text-center text-gray-900 font-semibold text-lg">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                        >
                          <Plus className="w-4 h-4 text-gray-700" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item._id)}
                        className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors duration-200 disabled:opacity-50 px-3 py-1 rounded-lg bg-red-100"
                        disabled={deletingId === item._id}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm">
                          {deletingId === item._id ? "Removing..." : "Remove"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="xl:col-span-1">
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 xl:sticky xl:top-8 shadow">
                <h3 className="font-bold text-xl sm:text-2xl text-gray-900 mb-4 sm:mb-6">
                  Order Summary
                </h3>

                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                    <span>
                      Subtotal (
                      {items.reduce((total, item) => total + item.quantity, 0)}{" "}
                      items)
                    </span>
                    <span>₹{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                    <span>GST (18%)</span>
                    <span>₹{calculateGST(calculateSubtotal()).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 sm:pt-4">
                    <div className="flex justify-between font-bold text-lg sm:text-2xl text-gray-900">
                      <span>Total</span>
                      <span>₹{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Proceed to Checkout
                </button>

                <div className="mt-3 sm:mt-4 text-center">
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Free shipping on orders over ₹500
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
