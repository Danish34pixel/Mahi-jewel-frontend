import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginSignup from "../src/Components/LoginSignup";
import Home from "../src/Components/Home";
import Admin from "../src/Components/Admin";
import AddProduct from "../src/Components/AddProduct";
import Product from "../src/Components/Product";
import ViewProduct from "../src/Components/ViewProduct";
import Cart from "../src/Components/Cart";

import Order from "../src/Components/Order";
import Orderadmin from "../src/Components/Orderadmin";
import Wishlist from "../src/Components/Wishlist";

// AdminRoute: Only allows access if user is admin (hardcoded check)
const isAdmin = () => {
  // Prefer userEmail from localStorage, fallback to user object
  const email = localStorage.getItem("userEmail");
  if (email === "Mahiijewels@gmail.com") {
    // Optionally, you can also check userId or other admin criteria here
    return true;
  }
  // Fallback for old user object logic
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return false;
    const user = JSON.parse(userStr);
    return (
      user.email === "Mahiijewels@gmail.com" &&
      (user.phone === "7987175226" || user.phone === 7987175226)
    );
  } catch {
    return false;
  }
};

const AdminRoute = ({ element }) => {
  return isAdmin() ? element : <Navigate to="/login" replace />;
};

const Routing = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginSignup />} />
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<AdminRoute element={<Admin />} />} />
      <Route
        path="/addproduct"
        element={<AdminRoute element={<AddProduct />} />}
      />
      <Route
        path="/orderadmin"
        element={<AdminRoute element={<Orderadmin />} />}
      />
      <Route path="/product" element={<Product />} />
      <Route path="/viewproduct/:id" element={<ViewProduct />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/order" element={<Order />} />
      <Route path="/Wishlist" element={<Wishlist />} />
    </Routes>
  );
};

export default Routing;
