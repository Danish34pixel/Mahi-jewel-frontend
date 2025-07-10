import React, { useEffect, useState } from "react";
import BASE_API_URL from "./Baseurl";

const Orderadmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        // Try deployed backend first, fallback to localhost if it fails
        let res;
        fetch(`${BASE_API_URL}/api/orders`)
          .then((response) => {
            if (!response.ok) throw new Error("Failed to fetch orders");
            return response.json();
          })
          .then((data) => {
            setOrders(Array.isArray(data) ? data : []);
          })
          .catch(() => {
            fetch("http://localhost:3000/api/orders")
              .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch orders");
                return response.json();
              })
              .then((data) => {
                setOrders(Array.isArray(data) ? data : []);
              })
              .catch(() => {
                setError("Could not load orders.");
              });
          });
      } catch (err) {
        setError("Could not load orders.");
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

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
      const res = await fetch(
        `https://mahi-jewel-backend.onrender.com/api/orders/status/${orderId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: newStatus,
            arrivingInfo,
            arrivingDate,
          }),
        }
      );
      if (res.ok) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-4 px-1 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-white text-center">
          Admin Order Management
        </h1>
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
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-l-4 border-blue-500 border border-gray-700"
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
                  <button
                    className="mt-2 px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded shadow-lg hover:from-blue-700 hover:to-cyan-700 text-xs font-semibold transition-all duration-200 transform hover:scale-105"
                    onClick={() => handleStatusChange(order._id, order.status)}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orderadmin;
