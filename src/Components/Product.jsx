import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center text-white text-xl">Loading...</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-10">
      <div className="max-w-4xl mx-auto px-4">
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

        {products.length === 0 ? (
          <div className="text-center text-gray-300 text-lg">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((product, idx) => (
              <div
                key={product._id}
                className="border border-gray-700 rounded-lg p-6 bg-white/10 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-shadow duration-300 cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
                onClick={() => navigate(`/viewproduct/${product._id}`)}
              >
                {product.images && product.images.length > 0 && (
                  <div className="flex gap-2 mb-4 overflow-x-auto">
                    {product.images.slice(0, 5).map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={product.name}
                        className="h-24 w-24 object-cover rounded-lg border border-gray-600 flex-shrink-0"
                      />
                    ))}
                  </div>
                )}
                <h3 className="text-xl font-semibold text-white mb-2">
                  {product.name}
                </h3>
                <p className="text-amber-400 font-bold text-lg mb-1">
                  ${product.price}
                </p>
                <p className="text-sm text-gray-400 mb-3 uppercase tracking-wide">
                  {product.category}
                </p>
                <p className="text-gray-200 leading-relaxed">
                  {product.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
