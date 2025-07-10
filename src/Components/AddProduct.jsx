import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    images: [],
    description: "",
    category: "",
  });
  const [message, setMessage] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    setForm((prev) => ({ ...prev, images: acceptedFiles.slice(0, 5) }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
    maxFiles: 5,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (form.images.length !== 5) {
      setMessage("Please select exactly 5 images.");
      return;
    }
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("description", form.description);
    formData.append("category", form.category);
    for (let i = 0; i < form.images.length; i++) {
      formData.append("images", form.images[i]);
    }
    try {
      const res = await fetch(
        "https://mahi-jewel-backend.onrender.com/api/products",
        {
          method: "POST",
          body: formData,
        }
      );
      if (res.ok) {
        setMessage("Product added successfully!");
        setForm({
          name: "",
          price: "",
          images: [],
          description: "",
          category: "",
        });
      } else {
        setMessage("Failed to add product");
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded p-4 text-center cursor-pointer ${
            isDragActive ? "bg-amber-50" : "bg-gray-50"
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the images here ...</p>
          ) : (
            <p>Drag & drop 5 images here, or click to select</p>
          )}
        </div>
        {form.images.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {form.images.map((file, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="h-16 w-16 object-cover rounded border mb-1"
                />
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {file.name}
                </span>
              </div>
            ))}
          </div>
        )}
        {form.images.length !== 5 && (
          <div className="text-red-500 text-xs mb-2">
            Please select exactly 5 images.
          </div>
        )}
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-amber-500 text-white py-2 rounded hover:bg-amber-600"
        >
          Add Product
        </button>
      </form>
      {message && (
        <div className="mt-4 text-center text-red-500">{message}</div>
      )}
    </div>
  );
};

export default AddProduct;
