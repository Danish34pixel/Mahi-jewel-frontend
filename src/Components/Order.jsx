import React, { useEffect, useState } from "react";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState("");
  const [checkoutMsg, setCheckoutMsg] = useState("");

  // Get userId from logged-in user
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user && user._id ? user._id : null;

  // Fetch user's cart
  useEffect(() => {
    if (!userId) return;
    const fetchCart = async () => {
      setCartLoading(true);
      setCartError("");
      try {
        const res = await fetch("http://localhost:8000/api/cart", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch cart");
        const data = await res.json();
        setCart(Array.isArray(data.cart) ? data.cart : []);
      } catch (err) {
        setCartError("Could not load cart.");
      }
      setCartLoading(false);
    };
    fetchCart();
  }, [userId]);

  // Fetch user's orders
  useEffect(() => {
    if (!userId) return;
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`http://localhost:8000/api/orders/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
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
      const res = await fetch("http://localhost:8000/api/orders", {
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
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCheckoutMsg("Order placed successfully!");
        setCart([]);
        // Optionally, refresh orders
        setOrders((prev) => [data.order, ...prev]);
      } else {
        setCheckoutMsg(data.message || "Failed to place order.");
      }
    } catch (err) {
      setCheckoutMsg("Failed to place order.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-800 py-4 px-1 sm:px-4">
      <div className="max-w-md sm:max-w-5xl mx-auto">
        <img
          className="h-[8vh] rounded-full mx-auto sm:mx-0"
          src="/mahi.jpg"
          alt=""
        />
        <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-green-300 text-center sm:text-left ">
          <span className="text-yellow-500 text-xl">Mahi </span> jewels
        </h1>
        {/* Cart/Checkout Section */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-4 mb-8">
          <h2 className="text-xl font-bold text-green-200 mb-4">Checkout</h2>
          {cartLoading ? (
            <p className="text-green-300">Loading cart...</p>
          ) : cartError ? (
            <p className="text-red-400">{cartError}</p>
          ) : cart.length === 0 ? (
            <p className="text-green-300">Your cart is empty.</p>
          ) : (
            <>
              <div className="flex flex-wrap gap-4 mb-4">
                {cart.map((product, idx) => (
                  <div key={idx} className="flex flex-col items-center w-24">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded mb-1 border-2 border-green-600"
                    />
                    <span className="text-xs text-green-200 font-semibold text-center">
                      {product.name}
                    </span>
                    <span className="text-xs text-green-400">
                      ₹{product.price}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <span className="text-green-300">
                  Subtotal: ₹{subtotal.toFixed(2)}
                </span>
                <span className="text-green-300">
                  GST (18%): ₹{gstAmount.toFixed(2)}
                </span>
                <span className="text-green-200 font-bold">
                  Total: ₹{total.toFixed(2)}
                </span>
              </div>
              <button
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 font-semibold"
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
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6">
          <button
            className={`px-3 sm:px-4 py-2 rounded-lg font-semibold border-2 transition-all duration-200 ${
              filter === "In Progress"
                ? "bg-green-600 text-white border-green-500 shadow-lg"
                : "bg-gray-800 text-green-300 border-green-600 hover:bg-green-700 hover:text-white"
            }`}
            onClick={() => setFilter("In Progress")}
          >
            In Progress
          </button>
          <button
            className={`px-3 sm:px-4 py-2 rounded-lg font-semibold border-2 transition-all duration-200 ${
              filter === "Ordered"
                ? "bg-green-600 text-white border-green-500 shadow-lg"
                : "bg-gray-800 text-green-300 border-green-600 hover:bg-green-700 hover:text-white"
            }`}
            onClick={() => setFilter("Ordered")}
          >
            Ordered
          </button>
          <button
            className={`px-3 sm:px-4 py-2 rounded-lg font-semibold border-2 transition-all duration-200 ${
              filter === "Arriving"
                ? "bg-green-600 text-white border-green-500 shadow-lg"
                : "bg-gray-800 text-green-300 border-green-600 hover:bg-green-700 hover:text-white"
            }`}
            onClick={() => setFilter("Arriving")}
          >
            Arriving
          </button>
          <button
            className={`px-3 sm:px-4 py-2 rounded-lg font-semibold border-2 transition-all duration-200 ${
              filter === "All"
                ? "bg-green-600 text-white border-green-500 shadow-lg"
                : "bg-gray-800 text-green-300 border-green-600 hover:bg-green-700 hover:text-white"
            }`}
            onClick={() => setFilter("All")}
          >
            All
          </button>
        </div>
        {loading ? (
          <p className="text-green-300 text-center text-lg">Loading...</p>
        ) : error ? (
          <p className="text-red-400 text-center text-lg">{error}</p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-lg text-green-300 text-center">
            No orders placed yet.
          </p>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-gray-800 rounded-xl shadow-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-l-4 border-green-500 hover:shadow-green-900/20 transition-shadow duration-300"
              >
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-green-300">
                      Order ID:
                    </span>
                    <span className="text-green-200 text-xs bg-green-900 px-2 py-1 rounded">
                      {order.orderId || order._id}
                    </span>
                    <span className="ml-4 font-semibold text-green-300">
                      Status:
                    </span>
                    <span className="text-yellow-300 bg-yellow-900 px-2 py-1 rounded text-xs font-semibold">
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
                            className="w-16 h-16 object-cover rounded mb-1 border-2 border-green-600"
                          />
                          <span className="text-xs text-green-200 font-semibold text-center">
                            {product.name}
                          </span>
                          <span className="text-xs text-green-400">
                            ₹{product.price}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-green-300 font-bold text-lg">
                    ₹{order.total}
                  </span>
                  <span className="text-xs text-green-400 mt-1">
                    Placed on {new Date(order.createdAt).toLocaleString()}
                  </span>
                  {["in progress", "pending"].includes(
                    (order.status || "").toLowerCase()
                  ) && (
                    <button
                      className="mt-2 px-3 py-1 bg-red-600 text-white rounded shadow hover:bg-red-700 text-xs font-semibold"
                      onClick={async () => {
                        try {
                          const res = await fetch(
                            `http://localhost:8000/api/orders/cancel/${order._id}`,
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
                    className="mt-2 px-3 py-1 bg-gray-700 text-white rounded shadow hover:bg-gray-900 text-xs font-semibold"
                    onClick={async () => {
                      if (
                        !window.confirm(
                          "Are you sure you want to delete this order?"
                        )
                      )
                        return;
                      try {
                        const res = await fetch(
                          `http://localhost:8000/api/orders/${order._id}`,
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
                  {/* Arriving Status Button with Input */}
                  {order.status && order.status.toLowerCase() !== "arriving" ? (
                    <button
                      className="mt-2 px-3 py-1 bg-blue-600 text-white rounded shadow hover:bg-blue-700 text-xs font-semibold"
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
                            `http://localhost:8000/api/orders/status/${order._id}`,
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
                  ) : order.status &&
                    order.status.toLowerCase() === "arriving" &&
                    (order.arrivingInfo || order.arrivingDate) ? (
                    <div className="mt-2 text-xs text-blue-300 bg-blue-900 rounded p-2">
                      <span className="font-semibold">Arriving Info:</span>{" "}
                      {order.arrivingInfo}
                      <br />
                      <span className="font-semibold">Arriving Date:</span>{" "}
                      {order.arrivingDate}
                    </div>
                  ) : null}
                  {/* Arriving Info/Date Display for User */}
                  {order.status &&
                    order.status.toLowerCase() === "arriving" &&
                    (order.arrivingInfo || order.arrivingDate) && (
                      <div className="mt-2 text-xs text-blue-300 bg-blue-900 rounded p-2">
                        {order.arrivingInfo && (
                          <span>
                            <span className="font-semibold">
                              Arriving Info:
                            </span>{" "}
                            {order.arrivingInfo}
                            <br />
                          </span>
                        )}
                        {order.arrivingDate && (
                          <span>
                            <span className="font-semibold">
                              Arriving Date:
                            </span>{" "}
                            {order.arrivingDate}
                          </span>
                        )}
                      </div>
                    )}
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
