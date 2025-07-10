import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_API_URL from "./Baseurl";
// ShinyText component integrated
const ShinyText = ({ text, disabled = false, speed = 5, className = "" }) => {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`text-[#b5b5b5a4] bg-clip-text inline-block ${
        disabled ? "" : "animate-shine"
      } ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        animationDuration: animationDuration,
      }}
    >
      {text}
    </div>
  );
};

// Shiny Border component
const ShinyBorder = ({ children, className = "", speed = 3 }) => {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`relative ${className}`}
      style={{
        background:
          "linear-gradient(120deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.1) 100%)",
        backgroundSize: "200% 100%",
        animation: `shine ${animationDuration} linear infinite`,
        padding: "2px",
        borderRadius: "inherit",
      }}
    >
      <div className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-[inherit]">
        {children}
      </div>
    </div>
  );
};

const LoginSignup = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setStatus(null);

    if (isSignUp) {
      // Frontend validation for required fields
      if (
        !form.username.trim() ||
        !form.email.trim() ||
        !form.password.trim() ||
        !form.phone.trim() ||
        !form.address.trim()
      ) {
        setStatus(false);
        setMessage("All fields are required.");
        return;
      }
      try {
        const res = await fetch(`${BASE_API_URL}/api/auth/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
        let data = {};
        try {
          data = await res.json();
        } catch {
          setStatus(false);
          setMessage("Network error. Please try again.");
          return;
        }
        console.log("Signup/Login response:", data); // Add this line for debugging
        if (res.ok) {
          // Always store user id, email, and token in localStorage if present
          if (data.user && (data.user.id || data.user._id)) {
            localStorage.setItem("userId", data.user.id || data.user._id);
          }
          if (data.user && data.user.email) {
            localStorage.setItem("userEmail", data.user.email);
          }
          if (data.token) {
            localStorage.setItem("token", data.token);
          }
          setStatus(true);
          setMessage("Account created successfully!");
          setForm({
            username: "",
            email: "",
            password: "",
            phone: "",
            address: "",
          });
          setTimeout(() => {
            navigate("/");
          }, 500);
        } else {
          setStatus(false);
          setMessage(data.message || "Signup failed");
        }
      } catch (err) {
        setStatus(false);
        setMessage("Network error. Please try again.");
      }
    } else {
      // Login: send data to backend
      try {
        const res = await fetch(`${BASE_API_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        });
        let data = {};
        try {
          data = await res.json();
        } catch {
          setStatus(false);
          setMessage("Network error. Please try again.");
          return;
        }
        console.log("Signup/Login response:", data); // Add this line for debugging
        if (res.ok) {
          // Always store user id and email in localStorage if present
          if (data.user && (data.user.id || data.user._id)) {
            localStorage.setItem("userId", data.user.id || data.user._id);
          }
          if (data.user && data.user.email) {
            localStorage.setItem("userEmail", data.user.email);
          }
          if (data.token) {
            localStorage.setItem("token", data.token);
          }
          setStatus(true);
          setMessage("Welcome back!");
          setTimeout(() => {
            navigate("/");
          }, 500);
        } else {
          setStatus(false);
          setMessage(data.message || "Login failed");
        }
      } catch (err) {
        setStatus(false);
        setMessage("Network error. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
      <style>{`
        @keyframes shine {
          0% { background-position: 100%; }
          100% { background-position: -100%; }
        }
        .animate-shine {
          animation: shine 5s linear infinite;
        }
      `}</style>

      {/* Mobile Layout - Vertical Stack with Shiny Border */}
      <ShinyBorder
        className="w-full max-w-md mx-auto rounded-3xl shadow-2xl overflow-hidden md:hidden relative h-[700px]"
        speed={4}
      >
        {/* Animated Header Section */}
        <div
          className={`absolute top-0 left-0 w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white text-center relative overflow-hidden transition-all duration-700 ease-in-out ${
            isSignUp ? "h-32" : "h-40"
          }`}
        >
          <div className="absolute top-2 right-2 w-12 h-12 border-2 border-yellow-400 opacity-20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-2 left-2 w-8 h-8 border-2 border-yellow-400 opacity-30 rotate-45"></div>

          <div className="flex flex-col items-center justify-center h-full px-6">
            <div
              className={`rounded-full mx-auto mb-3 transition-all duration-500 bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center text-white font-bold ${
                isSignUp ? "w-16 h-16 text-lg" : "w-20 h-20 text-xl"
              }`}
            >
              <img src="/mahi.logo.jpg" alt="" />
            </div>
            <h1
              className={`font-bold mb-2 transition-all duration-500 ${
                isSignUp ? "text-xl" : "text-2xl"
              }`}
            >
              <ShinyText
                text={isSignUp ? "Create Account" : "Welcome Back!"}
                speed={3}
                className="text-white"
              />
            </h1>
            <p className="text-emerald-100 text-xs">
              {isSignUp ? "Join mahi-jewels today" : "Sign in to your account"}
            </p>
          </div>
        </div>

        {/* Forms Container with Vertical Sliding */}
        <div
          className={`absolute left-0 w-full transition-all duration-700 ease-in-out ${
            isSignUp ? "top-32" : "top-40"
          }`}
          style={{
            height: isSignUp ? "calc(100% - 8rem)" : "calc(100% - 10rem)",
          }}
        >
          {/* Sign In Form */}
          <form
            onSubmit={handleSubmit}
            className={`absolute left-0 top-0 w-full h-full flex flex-col justify-center p-6 transition-all duration-700 ease-in-out ${
              isSignUp
                ? "opacity-0 -translate-y-full pointer-events-none"
                : "opacity-100 translate-y-0"
            }`}
            autoComplete="on"
          >
            <div className="space-y-4 mb-6">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-sm"
                autoComplete="email"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-sm"
                autoComplete="current-password"
              />

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transform hover:scale-105 transition-all duration-200 shadow-lg text-sm"
              >
                Sign In
              </button>
            </div>

            {/* Message Display for Sign In */}
            {message && !isSignUp && (
              <div
                className={`mb-4 p-3 rounded-lg text-center text-sm transition-all duration-300 ${
                  status
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            {/* Toggle to Sign Up */}
            <div className="text-center">
              <p className="text-gray-300 text-sm mb-3">
                Don't have an account?
              </p>
              <button
                onClick={() => setIsSignUp(true)}
                className="px-6 py-2 border-2 border-emerald-500 text-emerald-400 font-semibold rounded-full hover:bg-emerald-50 transition-all duration-300 text-sm transform hover:scale-105"
              >
                <ShinyText
                  text="Sign Up"
                  speed={4}
                  className="text-emerald-400"
                />
              </button>
            </div>
          </form>

          {/* Sign Up Form */}
          <form
            onSubmit={handleSubmit}
            className={`absolute left-0 top-0 w-full h-full flex flex-col justify-start p-6 pt-4 transition-all duration-700 ease-in-out ${
              isSignUp
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-full pointer-events-none"
            }`}
            autoComplete="on"
          >
            <div className="space-y-3 mb-4">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-sm"
                autoComplete="username"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-sm"
                autoComplete="email"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-sm"
                autoComplete="new-password"
              />

              <div className="relative">
                <label className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
                  +91
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                  className="w-full pl-14 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-sm"
                  inputMode="numeric"
                  autoComplete="tel"
                />
              </div>

              <input
                type="text"
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-sm"
                autoComplete="street-address"
              />

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transform hover:scale-105 transition-all duration-200 shadow-lg text-sm"
              >
                Sign Up
              </button>
            </div>

            {/* Message Display for Sign Up */}
            {message && isSignUp && (
              <div
                className={`mb-4 p-3 rounded-lg text-center text-sm transition-all duration-300 ${
                  status
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            {/* Toggle to Sign In */}
            <div className="text-center">
              <p className="text-gray-300 text-sm mb-3">
                Already have an account?
              </p>
              <button
                onClick={() => setIsSignUp(false)}
                className="px-6 py-2 border-2 border-emerald-500 text-emerald-400 font-semibold rounded-full hover:bg-emerald-50 transition-all duration-300 text-sm transform hover:scale-105"
              >
                <ShinyText
                  text="Sign In"
                  speed={4}
                  className="text-emerald-400"
                />
              </button>
            </div>
          </form>
        </div>

        {/* Floating Animation Elements */}
        <div className="absolute top-20 right-4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute bottom-20 left-4 w-3 h-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full animate-bounce opacity-60"></div>
      </ShinyBorder>

      {/* Desktop Layout - Original Horizontal Design with Shiny Border */}
      <ShinyBorder
        className="relative w-full max-w-4xl h-[600px] rounded-3xl shadow-2xl overflow-hidden hidden md:block"
        speed={5}
      >
        {/* Form Container */}
        <div
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            isSignUp ? "translate-x-1/2" : "translate-x-0"
          }`}
        >
          {/* Sign In Form */}
          <form
            onSubmit={handleSubmit}
            className={`absolute left-0 top-0 w-1/2 h-full flex flex-col justify-center p-12 transition-all duration-700 ${
              isSignUp
                ? "opacity-0 translate-x-full pointer-events-none"
                : "opacity-100 translate-x-0"
            }`}
            autoComplete="on"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-emerald-100 mb-2">
                <ShinyText
                  text="Welcome to mahi-jewels!"
                  speed={3}
                  className="text-emerald-100"
                />
              </h1>
              <p className="text-gray-300">Sign in to your account</p>
            </div>

            <div className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                autoComplete="email"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                autoComplete="current-password"
              />

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Sign In
              </button>
            </div>

            {message && !isSignUp && (
              <div
                className={`mt-4 p-3 rounded-lg text-center ${
                  status
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}
          </form>

          {/* Sign Up Form */}
          <form
            onSubmit={handleSubmit}
            className={`absolute left-0 top-0 w-1/2 h-full flex flex-col justify-center p-12 transition-all duration-700 ${
              isSignUp
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-full pointer-events-none"
            }`}
            autoComplete="on"
          >
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-emerald-100 mb-2">
                <ShinyText
                  text="Create Account"
                  speed={3}
                  className="text-emerald-100"
                />
              </h1>
              <p className="text-gray-300">Sign up for a new account</p>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                autoComplete="username"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                autoComplete="email"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                autoComplete="new-password"
              />

              <div className="relative">
                <label className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-base pointer-events-none">
                  +91
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                  className="w-full pl-16 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                  inputMode="numeric"
                  autoComplete="tel"
                />
              </div>

              <input
                type="text"
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                autoComplete="street-address"
              />

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Sign Up
              </button>
            </div>

            {/* Message Display for Sign Up */}
            {message && isSignUp && (
              <div
                className={`mt-4 p-3 rounded-lg text-center ${
                  status
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            {/* Toggle to Sign In */}
            <div className="text-center">
              <p className="text-gray-300 text-sm mb-3">
                Already have an account?
              </p>
              <button
                onClick={() => setIsSignUp(false)}
                className="px-6 py-2 border-2 border-emerald-500 text-emerald-400 font-semibold rounded-full hover:bg-emerald-50 transition-all duration-300 text-sm transform hover:scale-105"
              >
                <ShinyText
                  text="Sign In"
                  speed={4}
                  className="text-emerald-400"
                />
              </button>
            </div>
          </form>
        </div>

        {/* Overlay Container */}
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 z-50 ${
            isSignUp ? "-translate-x-full" : "translate-x-0"
          }`}
        >
          <div
            className={`relative -left-full h-full w-[200%] bg-gradient-to-br from-gray-900 via-black to-gray-800 transition-transform duration-700 ${
              isSignUp ? "translate-x-1/2" : "translate-x-0"
            }`}
          >
            {/* Left Overlay Panel */}
            <div
              className={`absolute top-0 flex items-center justify-center flex-col px-10 text-center h-full w-1/2 text-white transition-transform duration-700 ${
                isSignUp ? "translate-x-0" : "-translate-x-1/5"
              }`}
            >
              <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center text-white font-bold text-2xl">
                <img src="/mahi.logo.jpg" alt="" />
              </div>
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">
                  <ShinyText
                    text="Welcome to mahi-jewels!"
                    speed={4}
                    className="text-white"
                  />
                </h1>
                <p className="text-emerald-100 leading-relaxed">
                  To keep connected with us please login with your personal info
                </p>
                <button
                  onClick={() => setIsSignUp(false)}
                  className="px-8 py-3 border-2 border-cyan-500/30 font-semibold rounded-full hover:bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:text-emerald-800 transition-all duration-300 transform hover:scale-105"
                >
                  <ShinyText text="Sign In" speed={3} className="text-white" />
                </button>
              </div>
              <div className="absolute top-10 right-10 w-20 h-20 border-2 border-yellow-400 opacity-20 rounded-full animate-pulse"></div>
              <div className="absolute bottom-10 left-10 w-16 h-16 border-2 border-yellow-400 opacity-30 rotate-45"></div>
            </div>

            {/* Right Overlay Panel */}
            <div
              className={`absolute top-0 right-0 flex items-center justify-center flex-col px-10 text-center h-full w-1/2 text-white transition-transform duration-700 ${
                isSignUp ? "translate-x-1/5" : "translate-x-0"
              }`}
            >
              <div className="w-24 h-24 rounded-full mb-10 bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center text-white font-bold text-2xl">
                <img src="/mahi.logo.jpg" alt="" />
              </div>
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">
                  <ShinyText
                    text="Hello, Friend!"
                    speed={4}
                    className="text-white"
                  />
                </h1>
                <p className="text-emerald-100 leading-relaxed">
                  Enter your personal details and start your journey with us
                </p>
                <button
                  onClick={() => setIsSignUp(true)}
                  className="px-8 py-3 border-2 border-cyan-500/30 font-semibold rounded-full hover:bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:text-emerald-800 transition-all duration-300 transform hover:scale-105"
                >
                  <ShinyText text="Sign Up" speed={3} className="text-white" />
                </button>
              </div>
              <div className="absolute top-10 left-10 w-24 h-24 border-2 border-yellow-400 opacity-20 rounded-full animate-pulse"></div>
              <div className="absolute bottom-10 right-10 w-12 h-12 border-2 border-yellow-400 opacity-30 rotate-45"></div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-5 left-5 w-3 h-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full animate-bounce opacity-70"></div>
        <div className="absolute top-20 right-20 w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-50"></div>
        <div
          className="absolute bottom-10 left-20 w-4 h-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full animate-bounce opacity-60"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </ShinyBorder>
    </div>
  );
};

export default LoginSignup;
