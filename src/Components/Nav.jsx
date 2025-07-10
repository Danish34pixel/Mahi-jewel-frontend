import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Admin check (same as Routing.jsx)
  const isAdmin = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return false;
      const user = JSON.parse(userStr);
      return (
        user.email === "Mahiijewels@gmail.com" &&
        (user.phone === "7897175226" || user.phone === 7897175226)
      );
    } catch {
      return false;
    }
  };

  const navItems = [
    "Home",
    "About",
    "Services",
    "Contact",
    "Blogs",
    ...(isAdmin() ? ["Add Product", "Order Admin"] : []),
    "Cart",
    "Your Orders",
  ];

  return (
    <>
      {/* Animated background with geometric patterns */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 border border-blue-500 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 border border-cyan-400 rotate-45 animate-bounce"></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-blue-300 rounded-full opacity-20 animate-spin"
            style={{ animationDuration: "20s" }}
          ></div>
        </div>
      </div>

      <nav className="relative z-50 bg-black/20 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center group">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <span className="text-black font-bold text-lg">
                    <img src="/mahi.logo.jpg" alt="" />
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-[#E59D00] bg-clip-text text-transparent">
                    Mahi
                  </span>
                  <span className="text-sm text-gray-400 -mt-1">Jewels</span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-1 bg-gray-900/50 rounded-full px-2 py-2 backdrop-blur-sm">
                {navItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setActiveItem(item);
                      if (item === "Cart") {
                        navigate("/cart");
                      } else if (item === "Your Orders") {
                        navigate("/order");
                      } else if (item === "Add Product") {
                        navigate("/addproduct");
                      } else if (item === "Order Admin") {
                        navigate("/orderadmin");
                      }
                    }}
                    className={`relative px-6 py-3 text-sm font-medium transition-all duration-300 rounded-full ${
                      activeItem === item
                        ? "text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {activeItem === item && (
                      <div className="absolute inset-0 bg-zinc-950 rounded-full border border-[#E59D00] backdrop-blur-sm animate-pulse"></div>
                    )}
                    <span className="relative z-10">{item}</span>
                    {activeItem === item && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Login/Signup Buttons */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate("/login")}
                  className="relative group px-6 py-3 text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 overflow-hidden rounded-lg border border-gray-700 hover:border-[#E59D00]"
                >
                  <span className="relative z-10">Login</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="relative group px-6 py-3 text-sm font-medium text-black bg-[#E59D00] rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                >
                  <span className="relative z-10 font-semibold">Sign Up</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-400 hover:text-white focus:outline-none p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-300"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900/80 backdrop-blur-lg rounded-lg mt-4 border border-gray-800">
                {navItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setActiveItem(item);
                      setIsOpen(false);
                      if (item === "Cart") {
                        navigate("/cart");
                      } else if (item === "Your Orders") {
                        navigate("/order");
                      } else if (item === "Add Product") {
                        navigate("/addproduct");
                      } else if (item === "Order Admin") {
                        navigate("/orderadmin");
                      }
                    }}
                    className={`block w-full text-left px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 ${
                      activeItem === item
                        ? "text-white bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
                <div className="px-4 py-4 space-y-3 border-t border-gray-800 mt-4">
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full px-4 py-3 text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 rounded-lg border border-gray-700 hover:border-cyan-500/50 hover:bg-gray-800/50"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="w-full px-4 py-3 text-sm font-medium text-black bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg font-semibold hover:from-blue-500 hover:to-cyan-400 transition-all duration-300 transform hover:scale-105"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Nav;
