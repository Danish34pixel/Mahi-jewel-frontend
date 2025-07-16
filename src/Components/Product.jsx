import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BASE_API_URL from "./Baseurl";
import axios from "axios";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search).get("search") || "";
  const normalizedQuery = query.replace(/\s+/g, "").toLowerCase();

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) setWishlist(JSON.parse(stored));
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let res;
        try {
          res = await axios.get(`${BASE_API_URL}/api/products`);
          setProducts(Array.isArray(res.data) ? res.data : []);
        } catch {
          res = await axios.get("http://localhost:3000/api/products");
          setProducts(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products by search query
  const filteredProducts = !normalizedQuery
    ? products
    : products.filter(
        (p) =>
          (p.name &&
            p.name
              .replace(/\s+/g, "")
              .toLowerCase()
              .includes(normalizedQuery)) ||
          (p.category &&
            p.category
              .replace(/\s+/g, "")
              .toLowerCase()
              .includes(normalizedQuery))
      );

  // Wishlist handlers
  const isWishlisted = (id) => wishlist.includes(id);
  const toggleWishlist = (id) => {
    if (isWishlisted(id)) {
      setWishlist(wishlist.filter((pid) => pid !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-400 border-t-transparent mb-4"></div>
          <div className="text-gray-700 text-xl font-medium">
            Loading products...
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-12 animate-fade-in-down">
          <div className="relative mb-4">
            <img
              src="/mahi.logo.jpg"
              alt="MahiJewels Logo"
              className="h-20 w-20 rounded-full shadow-2xl ring-4 ring-amber-400/30 animate-bounce-slow"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/20 to-yellow-400/20 animate-pulse"></div>
          </div>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-400 tracking-wide mb-2 animate-fade-in">
            Mahi Jewels
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full"></div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product, idx) => (
              <div
                key={product._id}
                className="group relative bg-white border border-slate-200 rounded-2xl p-6 hover:bg-amber-50 hover:border-amber-400/30 transition-all duration-300 cursor-pointer animate-fade-in-up transform hover:scale-105 hover:shadow-2xl hover:shadow-amber-400/10"
                style={{ animationDelay: `${idx * 100}ms` }}
                onClick={() => navigate(`/viewproduct/${product._id}`)}
              >
                {/* Wishlist Icon */}
                <button
                  className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-amber-100 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product._id);
                  }}
                  aria-label={
                    isWishlisted(product._id)
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                >
                  {isWishlisted(product._id) ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#f59e42"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="#f59e42"
                      className="w-7 h-7"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.435 6.582a5.373 5.373 0 00-7.6 0l-.835.836-.835-.836a5.373 5.373 0 00-7.6 7.6l.836.835 7.599 7.6 7.6-7.6.835-.835a5.373 5.373 0 000-7.6z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="#f59e42"
                      className="w-7 h-7"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.435 6.582a5.373 5.373 0 00-7.6 0l-.835.836-.835-.836a5.373 5.373 0 00-7.6 7.6l.836.835 7.599 7.6 7.6-7.6.835-.835a5.373 5.373 0 000-7.6z"
                      />
                    </svg>
                  )}
                </button>
                {/* Gradient overlay for hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 to-yellow-400/0 group-hover:from-amber-400/5 group-hover:to-yellow-400/5 rounded-2xl transition-all duration-300"></div>

                {/* Product Images */}
                {product.images && product.images.length > 0 && (
                  <div className="relative mb-6">
                    <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                      {product.images.slice(0, 5).map((img, idx) => (
                        <div key={idx} className="relative flex-shrink-0">
                          <img
                            src={img}
                            alt={product.name}
                            className="h-28 w-28 object-cover rounded-xl border border-slate-200 group-hover:border-amber-400/50 transition-all duration-300 shadow-lg"
                          />
                          {idx === 0 && (
                            <div className="absolute top-2 left-2 bg-amber-400 text-slate-900 text-xs font-bold px-2 py-1 rounded-full">
                              Featured
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product Info */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-400 transition-colors duration-300">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between mb-3">
                    <p className="text-2xl font-bold text-amber-400">
                      ₹{product.price}
                    </p>
                    <span className="bg-slate-100 text-amber-400 text-sm font-medium px-3 py-1 rounded-full uppercase tracking-wide">
                      {product.category}
                    </span>
                  </div>

                  <p className="text-gray-700 leading-relaxed text-sm line-clamp-3">
                    {product.description}
                  </p>

                  {/* View Details Button */}
                  <div className="mt-4 flex items-center text-amber-400 text-sm font-medium group-hover:text-amber-300 transition-colors duration-300">
                    View Details
                    <svg
                      className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
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

export default Product;
