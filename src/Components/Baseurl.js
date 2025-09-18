// Prefer a Vite env var on the host in production. During local development
// force the API to point at localhost:3000 so local dev uses the local backend
// even if VITE_API_URL is present (many devs keep a VITE_API_URL pointing to
// a deployed preview which causes confusion).
const envUrl = import.meta.env.VITE_API_URL;
const isLocal =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");
// import.meta.env.DEV is true when running Vite dev server
const isDev = !!import.meta.env.DEV;

const BASE_API_URL =
  isLocal || isDev
    ? "http://localhost:3000"
    : envUrl || "https://mahi-jewel-backend-1.onrender.com";

export default BASE_API_URL;
