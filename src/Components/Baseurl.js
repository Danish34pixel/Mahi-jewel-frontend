// Prefer a Vite env var set on the host (Vercel). For local development, fall back to localhost.
const envUrl = import.meta.env.VITE_API_URL;
const isLocal =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");
const BASE_API_URL =
  envUrl ||
  (isLocal
    ? "http://localhost:3000"
    : "https://mahi-jewel-backend-1.onrender.com");

export default BASE_API_URL;
