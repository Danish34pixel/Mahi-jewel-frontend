import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_API_URL from "./Baseurl";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [productId, setProductId] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) setWishlist(JSON.parse(stored));
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Fetch product details for wishlist
  useEffect(() => {
    if (!wishlist.length) {
      setProducts([]);
      return;
    }
    setLoading(true);
    Promise.all(
      wishlist.map((id) =>
        axios
          .get(`${BASE_API_URL}/api/products/${id}`)
          .then((res) => res.data)
          .catch(() => null)
      )
    )
      .then((results) => {
        setProducts(results.filter(Boolean));
      })
      .finally(() => setLoading(false));
  }, [wishlist]);

  // Add product to wishlist by ID
  const handleAdd = () => {
    if (!productId.trim()) return;
    if (wishlist.includes(productId.trim())) return;
    setWishlist([...wishlist, productId.trim()]);
    setProductId("");
  };

  // Remove product from wishlist
  const handleRemove = (id) => {
    setWishlist(wishlist.filter((pid) => pid !== id));
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-yellow-500">Your Wishlist</h1>
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          placeholder="Enter Product ID to add"
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-yellow-500"
        />
        <button
          onClick={handleAdd}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 font-semibold"
        >
          Add to Wishlist
        </button>
      </div>
      {loading ? (
        <div className="text-gray-500">Loading wishlist...</div>
      ) : products.length === 0 ? (
        <div className="text-gray-500">No products in your wishlist.</div>
      ) : (
        <ul className="space-y-3">
          {products.map((product) => (
            <li
              key={product._id}
              className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded px-4 py-3"
            >
              <div
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => navigate(`/viewproduct/${product._id}`)}
              >
                <img
                  src={product.images?.[0] || "/mahi.logo.jpg"}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded shadow"
                />
                <div>
                  <div className="font-semibold text-yellow-600 text-lg">
                    {product.name}
                  </div>
                  <div className="text-gray-700">₹{product.price}</div>
                  <div className="text-xs text-gray-400">
                    {product.category}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleRemove(product._id)}
                className="text-red-500 hover:text-red-700 font-semibold"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Wishlist;
