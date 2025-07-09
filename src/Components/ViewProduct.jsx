import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Animation helper for fade-in
const fadeInClass =
  "transition-all duration-700 ease-in-out opacity-0 translate-y-8";
const fadeInActiveClass = "opacity-100 translate-y-0";

const ViewProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [animate, setAnimate] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setProduct(null);
      } finally {
        setLoading(false);
        setTimeout(() => setAnimate(true), 100); // trigger animation after mount
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setMessage("Please login first.");
      navigate("/cart");
      return;
    }
    localStorage.setItem("userId", userId);
    try {
      const res = await fetch("http://localhost:3000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || "",
        }),
      });
      const data = await res.json();
      setMessage(data.message || "Added to cart");
      // Navigate to /cart after adding to cart
      navigate("/cart");
    } catch {
      setMessage("Failed to add to cart");
    }
    setTimeout(() => setMessage(""), 2000);
  };

  // Add image slider handlers
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

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center text-white text-lg">
        <span className="animate-pulse">Loading...</span>
      </div>
    );
  if (!product)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center text-white text-lg">
        <span className="animate-fade-in">Product not found.</span>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-10 px-4">
      <div className="flex flex-col items-center mb-8 animate-fade-in-down">
        <img
          src="/mahi.logo.jpg"
          alt="MahiJewels Logo"
          className="h-16 w-16 mb-2 rounded-full shadow-lg animate-bounce-slow"
        />
        <h1 className="text-4xl font-extrabold text-amber-400 tracking-wide mb-1 animate-fade-in">
          Mahi <span className="text-white">Jewels</span>
        </h1>
      </div>
      <div
        className={`max-w-2xl mx-auto p-6 bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-700 ${fadeInClass} ${
          animate ? fadeInActiveClass : ""
        }`}
        style={{ transition: "all 0.7s cubic-bezier(.4,0,.2,1)" }}
      >
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-amber-400 hover:text-amber-300 transition-colors duration-200"
        >
          Back
        </button>
        <h2
          className={`text-2xl font-bold mb-4 text-white transition-all duration-700 ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          {product.name}
        </h2>
        {/* Image slider */}
        <div className="relative flex justify-center items-center mb-4">
          {product.images && product.images.length > 0 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-700/60 hover:bg-gray-900/80 text-white rounded-full p-2 z-10"
                style={{
                  display: product.images.length > 1 ? "block" : "none",
                }}
                aria-label="Previous image"
              >
                &#8592;
              </button>
              <img
                src={product.images[currentImg]}
                alt={product.name}
                className={`h-64 w-64 object-cover rounded border border-gray-600 mx-auto transition-all duration-700 ${
                  animate ? "scale-100 opacity-100" : "scale-90 opacity-0"
                }`}
                style={{ maxHeight: "16rem" }}
              />
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-700/60 hover:bg-gray-900/80 text-white rounded-full p-2 z-10"
                style={{
                  display: product.images.length > 1 ? "block" : "none",
                }}
                aria-label="Next image"
              >
                &#8594;
              </button>
            </>
          )}
        </div>
        {/* Thumbnails */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-2 justify-center mb-4">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={product.name}
                className={`h-12 w-12 object-cover rounded border cursor-pointer transition-all duration-300 ${
                  idx === currentImg
                    ? "border-amber-400 ring-2 ring-amber-400"
                    : "border-gray-600 opacity-60"
                }`}
                onClick={() => setCurrentImg(idx)}
              />
            ))}
          </div>
        )}
        <p
          className={`text-amber-400 font-bold text-lg mb-2 transition-all duration-700 ${
            animate ? "opacity-100" : "opacity-0"
          }`}
        >
          ${product.price}
        </p>
        <p
          className={`text-sm text-gray-300 mb-2 transition-all duration-700 ${
            animate ? "opacity-100" : "opacity-0"
          }`}
        >
          {product.category}
        </p>
        <p
          className={`text-gray-200 transition-all duration-700 ${
            animate ? "opacity-100" : "opacity-0"
          }`}
        >
          {product.description}
        </p>
        <button
          onClick={handleAddToCart}
          className={`mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-all duration-300 ${
            animate ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
        >
          Add to Cart
        </button>
        {message && (
          <div className="mt-2 text-green-400 animate-fade-in">{message}</div>
        )}
      </div>
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
};

export default ViewProduct;
