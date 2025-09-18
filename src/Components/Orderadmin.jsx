import React, { useEffect, useState, useCallback } from "react";
import BASE_API_URL from "./Baseurl";
import axios from "axios";

const Orderadmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  // Read locally-stored address (set at login/signup) as a fallback
  const [localUserAddress, setLocalUserAddress] = useState(
    () => localStorage.getItem("userAddress") || ""
  );

  // Update localUserAddress when localStorage changes (login/signup may set it)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "userAddress") setLocalUserAddress(e.newValue || "");
    };
    const onAuthUpdated = (ev) => {
      try {
        const u = ev.detail && ev.detail.user;
        if (u && u.address) setLocalUserAddress(u.address);
      } catch (err) {
        // ignore
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("auth:updated", onAuthUpdated);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth:updated", onAuthUpdated);
    };
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${BASE_API_URL}/api/orders`);
      const ordersData = Array.isArray(res.data) ? res.data : [];
      // Also fetch users once and merge into orders where possible so the UI
      // can display user.address even when order.address is empty.
      let usersRes = null;
      try {
        usersRes = await axios.get(`${BASE_API_URL}/api/auth/users`);
      } catch (e) {
        usersRes = { data: [] };
      }
      const usersList = Array.isArray(usersRes.data) ? usersRes.data : [];
      const usersMap = new Map(usersList.map((u) => [String(u._id), u]));
      const merged = ordersData.map((ord) => {
        if (ord.user) return ord;
        const uidRaw =
          ord.userId && typeof ord.userId === "object"
            ? ord.userId._id || ord.userId.id
            : ord.userId;
        const key = uidRaw ? String(uidRaw) : null;
        if (key && usersMap.has(key)) {
          const u = usersMap.get(key);
          return {
            ...ord,
            user: {
              id: String(u._id),
              username: u.username,
              name: u.name,
              email: u.email,
              phone: u.phone,
              address: u.address,
            },
          };
        }
        return ord;
      });
      setOrders(merged);
    } catch (err) {
      setError("Could not load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, currentStatus) => {
    let newStatus = prompt(
      `Enter new status for order (current: ${currentStatus}) [e.g., Arriving, Cancelled, Completed]:`
    );
    if (!newStatus) return;
    let arrivingDate = "";
    let arrivingInfo = "";
    if (newStatus.toLowerCase() === "arriving") {
      arrivingInfo = prompt("Enter arrival details (e.g., tracking info):");
      if (!arrivingInfo) return;
      arrivingDate = prompt(
        "Enter estimated arriving date (e.g., 2025-07-01):"
      );
      if (!arrivingDate) return;
    }
    try {
      const res = await axios.put(
        `${BASE_API_URL}/api/orders/status/${orderId}`,
        { status: newStatus, arrivingInfo, arrivingDate },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.status === 200) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId
              ? { ...o, status: newStatus, arrivingInfo, arrivingDate }
              : o
          )
        );
        setStatusMsg("Order status updated.");
        setTimeout(() => setStatusMsg(""), 2000);
      } else {
        setStatusMsg("Failed to update status.");
      }
    } catch (err) {
      setStatusMsg("Failed to update status.");
    }
  };

  // no edit-address functionality here; backend should return order.user.address

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-4 px-1 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">
            Admin Order Management
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchOrders}
              className="px-3 py-1 bg-amber-500 text-white rounded shadow-md hover:opacity-90"
            >
              Refresh
            </button>
            <span className="text-sm text-gray-300">
              {loading ? "Refreshing..." : "Last updated: "}
            </span>
          </div>
        </div>

        {statusMsg && (
          <div className="mb-4 text-center text-green-400 font-semibold">
            {statusMsg}
          </div>
        )}

        {loading ? (
          <p className="text-gray-300 text-center text-lg">Loading orders...</p>
        ) : error ? (
          <p className="text-red-400 text-center text-lg">{error}</p>
        ) : orders.length === 0 ? (
          <div className="text-center">
            <p className="text-lg text-gray-300 mb-4">No orders found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              // Backend may attach a `user` object to the order for convenience
              const user = order.user || null;

              return (
                <div
                  key={order._id}
                  className="bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-l-4 border-blue-500 border border-gray-700"
                >
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-white">
                        Order ID:
                      </span>
                      <span className="text-gray-200 text-xs bg-gray-700 px-2 py-1 rounded">
                        {order.orderId || order._id}
                      </span>
                      <span className="ml-4 font-semibold text-white">
                        Status:
                      </span>
                      <span className="text-yellow-300 bg-yellow-900/80 px-2 py-1 rounded text-xs font-semibold">
                        {order.status || "Pending"}
                      </span>
                      <span className="ml-4 font-semibold text-white">
                        Payment:
                      </span>
                      <span className="text-gray-200 text-xs bg-gray-700 px-2 py-1 rounded ml-1">
                        {(() => {
                          const pm = String(
                            order.paymentMethod || order.payment || "COD"
                          ).toLowerCase();
                          return pm === "online"
                            ? "Online (UPI)"
                            : pm.toUpperCase() === "COD"
                            ? "Cash on Delivery"
                            : order.paymentMethod || order.payment || "COD";
                        })()}
                      </span>
                    </div>

                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-white">User:</span>
                      <span className="text-gray-200 text-xs bg-gray-700 px-2 py-1 w-fit rounded">
                        {order.username ||
                        order.name ||
                        (user
                          ? `${user.name || user.username || "User"}`
                          : null)
                          ? `${
                              order.username ||
                              order.name ||
                              user?.name ||
                              user?.username ||
                              "User"
                            }${
                              order.phone || user?.phone
                                ? " — " + (order.phone || user?.phone)
                                : ""
                            }`
                          : "Guest"}
                      </span>
                    </div>

                    <div className="mb-2 flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">
                          User Address:
                        </span>
                        <span className="text-gray-200 text-xs bg-gray-700 px-2 py-1 w-fit rounded">
                          {order.address ||
                            user?.address ||
                            localUserAddress ||
                            "N/A"}
                        </span>
                      </div>
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
                    <button
                      className="mt-2 px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded shadow-lg hover:from-blue-700 hover:to-cyan-700 text-xs font-semibold transition-all duration-200 transform hover:scale-105"
                      onClick={() =>
                        handleStatusChange(order._id, order.status)
                      }
                    >
                      Change Status
                    </button>

                    {order.status &&
                      order.status.toLowerCase() === "arriving" &&
                      (order.arrivingInfo || order.arrivingDate) && (
                        <div className="mt-2 text-xs text-blue-300 bg-blue-900/80 rounded p-2 backdrop-blur-sm">
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orderadmin;
