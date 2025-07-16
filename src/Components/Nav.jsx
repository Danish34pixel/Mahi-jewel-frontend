import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/product?search=${encodeURIComponent(search.trim())}`);
      setIsOpen(false);
      setSearch("");
    }
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

  const handleNavigation = (item) => {
    setActiveItem(item);
    setIsOpen(false);

    const navigationMap = {
      Cart: "/cart",
      "Your Orders": "/order",
      Wishlist: "/wishlist",
      Home: "/",
      About: "/about",
      Services: "/services",
      Contact: "/contact",
      Blogs: "/blogs",
    };

    if (navigationMap[item]) {
      navigate(navigationMap[item]);
    }
  };

  const navItems = [
    "Home",
    "About",
    "Services",
    "Contact",
    "Blogs",
    "Cart",
    "Your Orders",
    "Wishlist",
  ];

  return (
    <>
      {/* Animated background with geometric patterns */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 border border-amber-400 rounded-full animate-pulse shadow-2xl shadow-amber-400/20"></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 border border-cyan-400 rotate-45 animate-bounce shadow-xl shadow-cyan-400/20"></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-blue-300 rounded-full opacity-20 animate-spin shadow-2xl shadow-blue-300/10"
            style={{ animationDuration: "20s" }}
          ></div>
          <div className="absolute top-1/4 right-1/4 w-16 h-16 border border-purple-400 rounded-full animate-ping shadow-lg shadow-purple-400/20"></div>
          <div className="absolute bottom-1/3 right-1/3 w-24 h-24 border border-emerald-400 rotate-12 animate-pulse shadow-xl shadow-emerald-400/20"></div>
        </div>

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-50/30 to-transparent"></div>
      </div>

      <nav className="relative z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div
              className="flex-shrink-0 flex items-center group cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg shadow-amber-400/30 group-hover:shadow-amber-400/50">
                  <img
                    src="/mahi.logo.jpg"
                    alt="Mahi Jewels"
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">
                    Mahi
                  </span>
                  <span className="text-sm text-gray-600 -mt-1 font-medium">
                    Jewels
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation Links + Search */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-1 bg-gray-100/60 rounded-full px-3 py-2 backdrop-blur-sm border border-gray-200/50 shadow-lg">
                {navItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleNavigation(item)}
                    className={`relative px-4 py-2.5 text-sm font-medium transition-all duration-300 rounded-full group ${
                      activeItem === item
                        ? "text-gray-800"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    {activeItem === item && (
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-full border border-amber-400/50 backdrop-blur-sm animate-pulse shadow-lg"></div>
                    )}
                    <span className="relative z-10 group-hover:drop-shadow-sm">
                      {item}
                    </span>
                    {activeItem === item && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-bounce shadow-sm"></div>
                    )}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="ml-4 flex items-center bg-white/95 rounded-full px-4 py-2.5 shadow-lg border border-gray-200/50 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="bg-transparent outline-none text-gray-700 text-sm px-2 py-1 w-32 md:w-40 placeholder-gray-500"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch(e);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="text-amber-500 hover:text-amber-700 ml-2 p-1 rounded-full hover:bg-amber-50 transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="8" strokeWidth="2" />
                    <line
                      x1="21"
                      y1="21"
                      x2="16.65"
                      y2="16.65"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Desktop Login/Signup Buttons */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate("/login")}
                  className="relative group px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-800 transition-all duration-300 overflow-hidden rounded-lg border border-gray-300/50 hover:border-amber-400/50 backdrop-blur-sm shadow-lg hover:shadow-amber-400/20"
                >
                  <span className="relative z-10">Login</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="relative group px-6 py-3 text-sm font-medium text-black bg-gradient-to-r from-amber-400 to-yellow-500 rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-amber-400/50 font-semibold"
                >
                  <span className="relative z-10">Sign Up</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-600 hover:text-gray-800 focus:outline-none p-2 rounded-lg hover:bg-gray-100/50 transition-all duration-300 backdrop-blur-sm"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isOpen && (
            <div className="md:hidden">
              <div className="px-3 pt-3 pb-4 space-y-2 bg-white/90 backdrop-blur-xl rounded-xl mt-4 border border-gray-200/50 shadow-2xl">
                {/* Mobile Search Bar */}
                <div className="mb-4 flex items-center bg-white/95 rounded-full px-4 py-2.5 shadow-lg border border-gray-200/50 backdrop-blur-sm">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="bg-transparent outline-none text-gray-700 text-sm px-2 py-1 w-full placeholder-gray-500"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSearch(e);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="text-amber-500 hover:text-amber-700 ml-2 p-1 rounded-full hover:bg-amber-50 transition-all duration-300"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="11" cy="11" r="8" strokeWidth="2" />
                      <line
                        x1="21"
                        y1="21"
                        x2="16.65"
                        y2="16.65"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                </div>

                {navItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleNavigation(item)}
                    className={`block w-full text-left px-4 py-3.5 text-base font-medium rounded-lg transition-all duration-300 ${
                      activeItem === item
                        ? "text-gray-800 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/50 shadow-lg"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-100/50 hover:shadow-md"
                    }`}
                  >
                    {item}
                  </button>
                ))}

                <div className="px-2 py-4 space-y-3 border-t border-gray-200/50 mt-4">
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-800 transition-all duration-300 rounded-lg border border-gray-300/50 hover:border-amber-400/50 hover:bg-gray-100/50 backdrop-blur-sm"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="w-full px-4 py-3 text-sm font-medium text-black bg-gradient-to-r from-amber-400 to-yellow-500 rounded-lg font-semibold hover:from-yellow-500 hover:to-amber-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
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
