import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginSignup from "../src/Components/LoginSignup";
import Home from "../src/Components/Home";
import Admin from "../src/Components/Admin";
import AddProduct from "../src/Components/AddProduct";
import Product from "../src/Components/Product";
import ViewProduct from "../src/Components/ViewProduct";
import Cart from "../src/Components/Cart";

import Order from "../src/Components/Order";

const Routing = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginSignup />} />
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/addproduct" element={<AddProduct />} />
      <Route path="/product" element={<Product />} />
      <Route path="/viewproduct/:id" element={<ViewProduct />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/order" element={<Order />} />
    </Routes>
  );
};

export default Routing;
