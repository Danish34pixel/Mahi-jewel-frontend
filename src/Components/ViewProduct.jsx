import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ViewProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
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
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!product)
    return <div className="text-center mt-10">Product not found.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-amber-600 hover:underline"
      >
        Back
      </button>
      <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
      <div className="flex flex-wrap gap-4 mb-4">
        {product.images &&
          product.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={product.name}
              className="h-40 w-40 object-cover rounded border"
            />
          ))}
      </div>
      <p className="text-amber-600 font-bold text-lg mb-2">${product.price}</p>
      <p className="text-sm text-gray-600 mb-2">{product.category}</p>
      <p className="text-gray-700">{product.description}</p>
    </div>
  );
};

export default ViewProduct;
