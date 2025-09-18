import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BASE_API_URL from "./Baseurl";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Animation helper for fade-in
const fadeInClass =
  "transition-all duration-700 ease-in-out opacity-0 translate-y-8";
const fadeInActiveClass = "opacity-100 translate-y-0";

const ViewProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const navigate = useNavigate();
  // Prices are stored in INR in the DB. Keep conversion factor as 1 so we don't inflate values.
  const USD_TO_INR = 1; // set to 83 only if prices are in USD
  const inrFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });
  // Use an explicit discount percent so strikethrough and badge match
  const DISCOUNT = 0.23; // 23% OFF

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${BASE_API_URL}/api/products/${id}`);
        setProduct(res.data);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
        setTimeout(() => setAnimate(true), 100);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    // Enforce login on the client-side before attempting to add to cart.
    if (!token || !userId) {
      toast.error("Please login first.");
      navigate("/login");
      return;
    }
    try {
      const url = `${BASE_API_URL}/api/cart`;
      const payload = {
        // keep userId for backward compatibility; server prefers token
        userId,
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || "",
        },
      };
      console.debug("AddToCart -> URL:", url);
      console.debug("AddToCart -> payload:", payload);
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const res = await axios.post(url, payload, { headers });
      toast.success(res.data.message || "Added to cart");
      navigate("/cart");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const handlePrev = () => {
    if (!product?.images?.length) return;
    setCurrentImg((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    if (!product?.images?.length) return;
    setCurrentImg((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleBack = () => {
    setMessage("Back button clicked!");
    setTimeout(() => setMessage(""), 2000);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-amber-300 rounded-full animate-spin animation-delay-150"></div>
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="text-6xl mb-4 text-gray-300">💎</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Product Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The product you're looking for doesn't exist.
        </p>
        <button
          onClick={handleBack}
          className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all duration-300 transform hover:scale-105"
        >
          Go Back
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative">
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full shadow-lg ring-2 ring-amber-200 flex items-center justify-center">
                  <img
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                    src="/mahi.logo.jpg"
                    alt=""
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-amber-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold">
                  <span className="text-amber-500">Mahi</span>
                  <span className="text-gray-900 ml-1">Jewels</span>
                </h1>
                <p className="text-xs text-gray-500 -mt-1">
                  Exquisite Collection
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 sm:mb-8 inline-flex items-center space-x-2 text-amber-600 hover:text-amber-700 transition-colors duration-200 group text-sm sm:text-base"
        >
          <svg
            className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="font-medium">Back to Products</span>
        </button>

        {/* Product Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Image Section */}
          <div className={`${fadeInClass} ${animate ? fadeInActiveClass : ""}`}>
            <div className="relative bg-gray-50 rounded-2xl p-4 sm:p-8 shadow-lg">
              {product.images && product.images.length > 0 && (
                <>
                  {/* Main Image */}
                  <div className="relative flex justify-center items-center mb-4 sm:mb-6">
                    <img
                      src={product.images[currentImg]}
                      alt={product.name}
                      className="h-48 w-48 sm:h-80 sm:w-80 object-cover rounded-xl shadow-2xl transition-all duration-500 hover:scale-105"
                      style={{ maxHeight: "20rem" }}
                    />

                    {/* Navigation Buttons */}
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={handlePrev}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 backdrop-blur-sm"
                          aria-label="Previous image"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={handleNext}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 backdrop-blur-sm"
                          aria-label="Next image"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {product.images.length > 1 && (
                    <div className="flex gap-2 sm:gap-3 justify-center">
                      {product.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImg(idx)}
                          className={`relative h-10 w-10 sm:h-16 sm:w-16 rounded-lg overflow-hidden transition-all duration-300 ${
                            idx === currentImg
                              ? "ring-2 ring-amber-500 ring-offset-2 scale-110"
                              : "opacity-60 hover:opacity-100 hover:scale-105"
                          }`}
                        >
                          <img
                            src={img}
                            alt={`${product.name} view ${idx + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Product Info Section */}
          <div
            className={`${fadeInClass} ${
              animate ? fadeInActiveClass : ""
            } space-y-4 sm:space-y-6`}
          >
            {/* Product Title */}
            <div>
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                {product.name}
              </h2>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 sm:px-3 sm:py-1 bg-amber-100 text-amber-800 text-xs sm:text-sm font-medium rounded-full">
                  {product.category}
                </span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-xs sm:text-sm text-gray-500 ml-2">
                    (4.9)
                  </span>
                </div>
              </div>
            </div>

            {/* Price (display in INR) */}
            <div className="flex items-baseline space-x-2">
              {(() => {
                const base = Number(product.price) || 0;
                const priceInINR = base * USD_TO_INR;
                const displayed = priceInINR * (1 - DISCOUNT); // price after discount
                const original = priceInINR; // original price before discount
                return (
                  <>
                    <span className="text-3xl sm:text-5xl font-bold text-amber-600">
                      {inrFormatter.format(displayed)}
                    </span>
                    <span className="text-base sm:text-lg text-gray-500 line-through">
                      {inrFormatter.format(original)}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs sm:text-sm font-medium rounded">
                      {Math.round(DISCOUNT * 100)}% OFF
                    </span>
                  </>
                );
              })()}
            </div>

            {/* Description */}
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 p-2 sm:p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs sm:text-sm text-gray-600">
                  Free Shipping
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-xs sm:text-sm text-gray-600">
                  30-Day Returns
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-xs sm:text-sm text-gray-600">
                  Lifetime Warranty
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-xs sm:text-sm text-gray-600">
                  Premium Quality
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="space-y-3 sm:space-y-4">
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-base sm:text-lg"
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01"
                    />
                  </svg>
                  <span>Add to Cart</span>
                </div>
              </button>

              <div className="flex space-x-2 sm:space-x-4">
                <button className="flex-1 bg-white border-2 border-gray-200 text-gray-700 font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-xl hover:border-amber-300 hover:text-amber-600 transition-all duration-200 text-xs sm:text-base">
                  <div className="flex items-center justify-center space-x-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span>Wishlist</span>
                  </div>
                </button>
                <button className="flex-1 bg-white border-2 border-gray-200 text-gray-700 font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-xl hover:border-amber-300 hover:text-amber-600 transition-all duration-200 text-xs sm:text-base">
                  <div className="flex items-center justify-center space-x-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg>
                    <span>Share</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1);
        }
        
        .animation-delay-150 {
          animation-delay: 0.15s;
        }
        
        .prose p {
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
};

export default ViewProduct;
