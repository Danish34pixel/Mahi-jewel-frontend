import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginSignup from "../src/Components/LoginSignup";
import Home from "../src/Components/Home";
import Admin from "../src/Components/Admin";
import AddProduct from "../src/Components/AddProduct";
import Product from "../src/Components/Product";

const Routing = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginSignup />} />
      <Route path="/home" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/addproduct" element={<AddProduct />} />
      <Route path="/product" element={<Product />} />
    </Routes>
  );
};

export default Routing;
