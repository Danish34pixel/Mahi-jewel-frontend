import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import BASE_API_URL from "./Baseurl"; // ensure this exports eg "https://mahi-jewel-backend-1.onrender.com"

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    discount: "",
    images: [],
    description: "",
    category: "",
  });
  const [message, setMessage] = useState("");
  // Toggle this to true to call the backend debug path (?debug=1).
  // Set to false to call the real create endpoint that performs uploads.
  const DEBUG = false;

  const onDrop = useCallback((acceptedFiles) => {
    // keep max 5 files
    setForm((prev) => ({
      ...prev,
      images: acceptedFiles.slice(0, 5),
    }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
    maxFiles: 5,
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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
    formData.append("price", String(Number(form.price) || 0));
    formData.append("discount", String(Number(form.discount) || 0));
    formData.append("description", form.description || "");
    formData.append("category", form.category || "");

    for (let i = 0; i < form.images.length; i++) {
      const file = form.images[i];
      // Note: use same field name 'images' (backend expects upload.array('images', 5))
      formData.append("images", file, file.name);
    }

    // debug: log entries (can't log FormData directly)
    for (const pair of formData.entries()) {
      console.debug("FormData:", pair[0], pair[1]);
    }

    try {
      const token = localStorage.getItem("token"); // change key if you store elsewhere
      const headers = {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await axios.post(
        `${BASE_API_URL}/api/products${DEBUG ? "?debug=1" : ""}`,
        formData,
        {
          headers,
          timeout: 120000,
        }
      );

      if (res.status === 200 || res.status === 201) {
        setMessage("✅ Product added successfully!");
        setForm({
          name: "",
          price: "",
          images: [],
          description: "",
          category: "",
        });
      } else {
        setMessage(res.data?.message || "Failed to add product");
      }
    } catch (err) {
      console.error(
        "Add product error:",
        err.response?.status,
        err.response?.data || err.message
      );
      const serverMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Server error";
      setMessage(serverMsg);
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

        <input
          type="number"
          name="discount"
          placeholder="Discount (%)"
          min="0"
          max="100"
          value={form.discount}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
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
              <div key={idx} className="flex flex-col items-center w-20">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="h-16 w-16 object-cover rounded border mb-1"
                />
                <span className="text-xs bg-gray-100 px-2 py-1 rounded truncate w-full text-center">
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
        <div
          className={`mt-4 text-center ${
            message.startsWith("✅") ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default AddProduct;
