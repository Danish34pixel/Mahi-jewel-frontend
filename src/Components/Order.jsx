import React, { useEffect, useState } from "react";
import BASE_API_URL from "./Baseurl";

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
        // Pass userId as query param for backend
        const res = await fetch(`${BASE_API_URL}/api/cart?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch cart");
        const data = await res.json();
        console.log("Cart data:", data); // Debug log
        setCart(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Cart fetch error:", err);
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
        // Fixed: Use correct port
        const res = await fetch(
          `https://mahi-jewel-backend.onrender.com/api/orders/${userId}`
        );
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        console.log("Orders data:", data); // Debug log
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Orders fetch error:", err);
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
      // Fixed: Use correct port
      const res = await fetch(
        "https://mahi-jewel-backend.onrender.com/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
          body: JSON.stringify({
            userId,
            products: cart,
            total,
            address: user && user.address ? user.address : "",
          }),
        }
      );
      const data = await res.json();
      console.log("Checkout response:", data); // Debug log
      if (res.ok && data.success) {
        setCheckoutMsg("Order placed successfully!");
        setCart([]);
        localStorage.removeItem("cart"); // Clear cart from localStorage if used
        // Optionally, you can also call the backend to clear the cart for this user
        try {
          await fetch(
            `https://mahi-jewel-backend.onrender.com/api/cart/clear?userId=${userId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              credentials: "include",
            }
          );
        } catch (e) {}
        // Refresh orders
        setOrders((prev) => [data.order, ...prev]);
      } else {
        setCheckoutMsg(data.message || "Failed to place order.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setCheckoutMsg("Failed to place order.");
    }
  };

  // Show login prompt if no user
  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-4 px-1 sm:px-4 flex items-center justify-center">
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-2xl p-8 text-center border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">Please Log In</h2>
          <p className="text-gray-300">
            You need to be logged in to view your orders.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-4 px-1 sm:px-4">
      <div className="max-w-md sm:max-w-5xl mx-auto">
        <img
          className="h-[8vh] rounded-full mx-auto sm:mx-0 shadow-lg border-2 border-gray-600"
          src="/mahi.logo.jpg"
          alt=""
        />
        <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-white text-center sm:text-left">
          <span className="text-yellow-400 text-xl">Mahi </span> jewels
        </h1>

        {/* Cart/Checkout Section */}
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-2xl p-4 mb-8 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Checkout</h2>
          {cartLoading ? (
            <p className="text-gray-300">Loading cart...</p>
          ) : cartError ? (
            <p className="text-red-400">{cartError}</p>
          ) : cart.length === 0 ? (
            <p className="text-gray-300">Your cart is empty.</p>
          ) : (
            <>
              <div className="flex flex-wrap gap-4 mb-4">
                {cart.map((product, idx) => (
                  <div key={idx} className="flex flex-col items-center w-24">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded mb-1 border-2 border-gray-600 shadow-md"
                    />
                    <span className="text-xs text-gray-200 font-semibold text-center">
                      {product.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      ₹{product.price}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <span className="text-gray-300">
                  Subtotal: ₹{subtotal.toFixed(2)}
                </span>
                <span className="text-gray-300">
                  GST (18%): ₹{gstAmount.toFixed(2)}
                </span>
                <span className="text-white font-bold">
                  Total: ₹{total.toFixed(2)}
                </span>
              </div>
              <button
                className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded shadow-lg hover:from-blue-700 hover:to-purple-700 font-semibold transition-all duration-200 transform hover:scale-105"
                onClick={handleCheckout}
                disabled={cartLoading}
              >
                Place Order
              </button>
              {checkoutMsg && (
                <p
                  className={`mt-2 text-center ${
                    checkoutMsg.includes("success")
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {checkoutMsg}
                </p>
              )}
            </>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6">
          <button
            className={`px-3 sm:px-4 py-2 rounded-lg font-semibold border-2 transition-all duration-200 transform hover:scale-105 ${
              filter === "In Progress"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-500 shadow-lg"
                : "bg-gray-800/90 text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white backdrop-blur-sm"
            }`}
            onClick={() => setFilter("In Progress")}
          >
            In Progress
          </button>
          <button
            className={`px-3 sm:px-4 py-2 rounded-lg font-semibold border-2 transition-all duration-200 transform hover:scale-105 ${
              filter === "Ordered"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-500 shadow-lg"
                : "bg-gray-800/90 text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white backdrop-blur-sm"
            }`}
            onClick={() => setFilter("Ordered")}
          >
            Ordered
          </button>
          <button
            className={`px-3 sm:px-4 py-2 rounded-lg font-semibold border-2 transition-all duration-200 transform hover:scale-105 ${
              filter === "Arriving"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-500 shadow-lg"
                : "bg-gray-800/90 text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white backdrop-blur-sm"
            }`}
            onClick={() => setFilter("Arriving")}
          >
            Arriving
          </button>
          <button
            className={`px-3 sm:px-4 py-2 rounded-lg font-semibold border-2 transition-all duration-200 transform hover:scale-105 ${
              filter === "All"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-500 shadow-lg"
                : "bg-gray-800/90 text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white backdrop-blur-sm"
            }`}
            onClick={() => setFilter("All")}
          >
            All
          </button>
        </div>

        {/* Orders Display */}
        {loading ? (
          <p className="text-gray-300 text-center text-lg">Loading orders...</p>
        ) : error ? (
          <p className="text-red-400 text-center text-lg">{error}</p>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center">
            <p className="text-lg text-gray-300 mb-4">No orders found.</p>
            {filter !== "All" && (
              <p className="text-gray-400 text-sm">
                Try changing the filter or place your first order!
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-l-4 border-blue-500 hover:shadow-blue-900/20 transition-all duration-300 transform hover:scale-[1.02] border border-gray-700"
              >
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-white">Order ID:</span>
                    <span className="text-gray-200 text-xs bg-gray-700 px-2 py-1 rounded">
                      {order.orderId || order._id}
                    </span>
                    <span className="ml-4 font-semibold text-white">
                      Status:
                    </span>
                    <span className="text-yellow-300 bg-yellow-900/80 px-2 py-1 rounded text-xs font-semibold">
                      {order.status || "Pending"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {order.products &&
                      order.products.map((product, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col items-center w-24"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded mb-1 border-2 border-gray-600 shadow-md"
                          />
                          <span className="text-xs text-gray-200 font-semibold text-center">
                            {product.name}
                          </span>
                          <span className="text-xs text-gray-400">
                            ₹{product.price}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-white font-bold text-lg">
                    ₹{order.total}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    Placed on {new Date(order.createdAt).toLocaleString()}
                  </span>
                  {["in progress", "pending"].includes(
                    (order.status || "").toLowerCase()
                  ) && (
                    <button
                      className="mt-2 px-3 py-1 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded shadow-lg hover:from-red-700 hover:to-pink-700 text-xs font-semibold transition-all duration-200 transform hover:scale-105"
                      onClick={async () => {
                        try {
                          const res = await fetch(
                            `https://mahi-jewel-backend.onrender.com/api/orders/cancel/${order._id}`,
                            {
                              method: "PUT",
                            }
                          );
                          if (res.ok) {
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
                      Cancel
                    </button>
                  )}
                  {/* Delete Order Button */}
                  <button
                    className="mt-2 px-3 py-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded shadow-lg hover:from-gray-700 hover:to-gray-800 text-xs font-semibold transition-all duration-200 transform hover:scale-105"
                    onClick={async () => {
                      if (
                        !window.confirm(
                          "Are you sure you want to delete this order?"
                        )
                      )
                        return;
                      try {
                        const res = await fetch(
                          `https://mahi-jewel-backend.onrender.com/api/orders/${order._id}`,
                          {
                            method: "DELETE",
                          }
                        );
                        if (res.ok) {
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
                    Delete
                  </button>
                  {/* Arriving Status Button */}
                  {order.status && order.status.toLowerCase() !== "arriving" ? (
                    <button
                      className="mt-2 px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded shadow-lg hover:from-blue-700 hover:to-cyan-700 text-xs font-semibold transition-all duration-200 transform hover:scale-105"
                      onClick={async () => {
                        const arrivingInfo = prompt(
                          "Enter arrival details (e.g., tracking info):"
                        );
                        if (!arrivingInfo) return;
                        const arrivingDate = prompt(
                          "Enter expected arriving date (e.g., 2025-07-01):"
                        );
                        if (!arrivingDate) return;
                        try {
                          const res = await fetch(
                            `https://mahi-jewel-backend.onrender.com/api/orders/status/${order._id}`,
                            {
                              method: "PUT",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                status: "Arriving",
                                arrivingInfo,
                                arrivingDate,
                              }),
                            }
                          );
                          if (res.ok) {
                            setOrders((prev) =>
                              prev.map((o) =>
                                o._id === order._id
                                  ? {
                                      ...o,
                                      status: "Arriving",
                                      arrivingInfo,
                                      arrivingDate,
                                    }
                                  : o
                              )
                            );
                          } else {
                            alert("Failed to update status.");
                          }
                        } catch (err) {
                          alert("Failed to update status.");
                        }
                      }}
                    >
                      Mark as Arriving
                    </button>
                  ) : null}
                  {/* Arriving Info Display - always show if either is present */}
                  <div className="mt-2 text-xs text-blue-300 bg-blue-900/80 rounded p-2 backdrop-blur-sm">
                    <span>
                      <span className="font-semibold">
                        Estimated Arriving Date:
                      </span>{" "}
                      {order.arrivingDate ? (
                        order.arrivingDate
                      ) : (
                        <span className="text-red-300">Not set</span>
                      )}
                    </span>
                    <br />
                    <span>
                      <span className="font-semibold">Arriving Info:</span>{" "}
                      {order.arrivingInfo ? (
                        order.arrivingInfo
                      ) : (
                        <span className="text-red-300">Not set</span>
                      )}
                    </span>
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
