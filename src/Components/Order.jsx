import React, { useEffect, useState } from "react";
import BASE_API_URL from "./Baseurl";
import axios from "axios";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState("");
  const [checkoutMsg, setCheckoutMsg] = useState("");

  // Get userId from localStorage (support both user object and userId string)
  let user = null;
  let userId = null;
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      user = JSON.parse(userStr);
      if (user && user._id) {
        userId = user._id;
      }
    }
    if (!userId) {
      // fallback: check for userId key directly
      userId = localStorage.getItem("userId");
    }
  } catch (e) {
    user = null;
    userId = localStorage.getItem("userId");
  }
  console.log("User ID:", userId);

  // Fetch user's cart
  useEffect(() => {
    if (!userId) return;
    const fetchCart = async () => {
      setCartLoading(true);
      setCartError("");
      try {
        const res = await axios.get(`${BASE_API_URL}/api/cart`, {
          params: { userId },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        });
        const data = res.data;
        setCart(Array.isArray(data) ? data : []);
      } catch (err) {
        setCartError("Could not load cart.");
      }
      setCartLoading(false);
    };
    fetchCart();
  }, [userId]);

  // Fetch user's orders
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError("Please log in to view your orders.");
      return;
    }
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${BASE_API_URL}/api/orders/${userId}`);
        const data = res.data;
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Could not load orders.");
      }
      setLoading(false);
    };
    fetchOrders();
  }, [userId]);

  const filteredOrders =
    filter === "All"
      ? orders
      : filter === "In Progress"
      ? orders.filter(
          (order) =>
            order.status &&
            ["in progress", "pending"].includes(order.status.toLowerCase())
        )
      : orders.filter(
          (order) =>
            order.status && order.status.toLowerCase() === filter.toLowerCase()
        );

  // Calculate cart totals
  const subtotal = cart.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0);
  const gstRate = 0.18;
  const gstAmount = subtotal * gstRate;
  const total = subtotal + gstAmount;

  // Handle checkout
  const handleCheckout = async () => {
    setCheckoutMsg("");
    if (!cart.length) return setCheckoutMsg("Your cart is empty.");
    try {
      const res = await axios.post(
        `${BASE_API_URL}/api/orders`,
        {
          userId,
          products: cart,
          total,
          address: user && user.address ? user.address : "",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      const data = res.data;
      if (res.status === 200 || res.status === 201) {
        setCheckoutMsg("Order placed successfully!");
        setCart([]);
        localStorage.removeItem("cart");
        try {
          await axios.delete(`${BASE_API_URL}/api/cart/clear`, {
            params: { userId },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          });
        } catch (e) {}
        setOrders((prev) => [data.order, ...prev]);
      } else {
        setCheckoutMsg(data.message || "Failed to place order.");
      }
    } catch (err) {
      setCheckoutMsg(err.response?.data?.message || "Failed to place order.");
    }
  };

  // Show login prompt if no user
  if (!userId) {
    return (
      <div className="min-h-screen bg-white py-8 px-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center border border-gray-100 max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Please Log In
          </h2>
          <p className="text-gray-600 text-lg">
            You need to be logged in to view your orders.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center sm:justify-start mb-8">
          <img
            className="h-16 w-16 rounded-full shadow-lg border-4 border-amber-100"
            src="/mahi.logo.jpg"
            alt="Mahi Jewels"
          />
          <h1 className="ml-4 text-3xl sm:text-4xl font-bold text-gray-900">
            <span className="text-amber-500">Mahi</span> Jewels
          </h1>
        </div>

        {/* Cart/Checkout Section */}
        <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-xl p-6 mb-8 border border-amber-100">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H21M7 13v6a2 2 0 002 2h10a2 2 0 002-2v-6"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
          </div>

          {cartLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
              <span className="ml-3 text-gray-600">Loading cart...</span>
            </div>
          ) : cartError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {cartError}
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H21M7 13v6a2 2 0 002 2h10a2 2 0 002-2v-6"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {cart.map((product, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-square mb-3 overflow-hidden rounded-lg">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-amber-600 font-bold">₹{product.price}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>GST (18%):</span>
                    <span>₹{gstAmount.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total:</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  className="w-full mt-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:from-amber-600 hover:to-amber-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleCheckout}
                  disabled={cartLoading}
                >
                  Place Order
                </button>

                {checkoutMsg && (
                  <div
                    className={`mt-4 p-4 rounded-lg text-center font-medium ${
                      checkoutMsg.includes("success")
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {checkoutMsg}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {["In Progress", "Ordered", "Arriving", "All"].map((filterOption) => (
            <button
              key={filterOption}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                filter === filterOption
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-amber-300 shadow-md"
              }`}
              onClick={() => setFilter(filterOption)}
            >
              {filterOption}
            </button>
          ))}
        </div>

        {/* Orders Display */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            <span className="ml-4 text-gray-600 text-lg">
              Loading orders...
            </span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-red-700 text-lg font-medium">{error}</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No orders found
            </h3>
            {filter !== "All" && (
              <p className="text-gray-500">
                Try changing the filter or place your first order!
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01]"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    {/* Order Header */}
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium mr-2">
                          Order ID:
                        </span>
                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-lg text-sm font-mono">
                          {order.orderId || order._id}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium mr-2">
                          Status:
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            order.status?.toLowerCase() === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : order.status?.toLowerCase() === "delivered"
                              ? "bg-green-100 text-green-700"
                              : ["in progress", "pending"].includes(
                                  order.status?.toLowerCase()
                                )
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {order.status || "Pending"}
                        </span>
                      </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {order.products &&
                        order.products.map((product, idx) => (
                          <div
                            key={idx}
                            className="bg-gray-50 rounded-xl p-3 border border-gray-200"
                          >
                            <div className="aspect-square mb-2 overflow-hidden rounded-lg">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                              {product.name}
                            </h4>
                            <p className="text-amber-600 font-bold text-sm">
                              ₹{product.price}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Order Actions & Info */}
                  <div className="lg:w-80 space-y-4">
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
                      <div className="text-center">
                        <p className="text-amber-700 font-medium mb-1">
                          Total Amount
                        </p>
                        <p className="text-3xl font-bold text-amber-800">
                          ₹{order.total}
                        </p>
                      </div>
                      <div className="mt-3 pt-3 border-t border-amber-200">
                        <p className="text-sm text-amber-600 text-center">
                          Placed on{" "}
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-3">
                        Delivery Information
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-blue-700 font-medium">
                            Estimated Date:
                          </span>
                          <p className="text-sm text-blue-600">
                            {order.arrivingDate || "Not set"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-blue-700 font-medium">
                            Delivery Info:
                          </span>
                          <p className="text-sm text-blue-600">
                            {order.arrivingInfo || "Not set"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      {["in progress", "pending"].includes(
                        (order.status || "").toLowerCase()
                      ) && (
                        <button
                          className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-xl font-semibold shadow-lg hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200"
                          onClick={async () => {
                            try {
                              const res = await axios.put(
                                `${BASE_API_URL}/api/orders/cancel/${order._id}`
                              );
                              if (res.status === 200) {
                                setOrders((prev) =>
                                  prev.map((o) =>
                                    o._id === order._id
                                      ? { ...o, status: "Cancelled" }
                                      : o
                                  )
                                );
                              }
                            } catch (err) {
                              alert("Failed to cancel order.");
                            }
                          }}
                        >
                          Cancel Order
                        </button>
                      )}
                      <button
                        className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-2 px-4 rounded-xl font-semibold shadow-lg hover:from-gray-600 hover:to-gray-700 transform hover:scale-105 transition-all duration-200"
                        onClick={async () => {
                          if (
                            !window.confirm(
                              "Are you sure you want to delete this order?"
                            )
                          )
                            return;
                          try {
                            const res = await axios.delete(
                              `${BASE_API_URL}/api/orders/${order._id}`
                            );
                            if (res.status === 200) {
                              setOrders((prev) =>
                                prev.filter((o) => o._id !== order._id)
                              );
                            } else {
                              alert("Failed to delete order.");
                            }
                          } catch (err) {
                            alert("Failed to delete order.");
                          }
                        }}
                      >
                        Delete Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
