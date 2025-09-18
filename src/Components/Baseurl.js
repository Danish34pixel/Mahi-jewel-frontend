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

let BASE_API_URL;

if (isLocal || isDev) {
  // during local development, always point to local backend
  BASE_API_URL = "http://localhost:3000";
} else {
  // In production builds require VITE_API_URL to be set at build time.
  // This prevents accidentally shipping a hard-coded backend URL.
  if (!envUrl || String(envUrl).trim() === "") {
    throw new Error(
      "VITE_API_URL is not set. Please set VITE_API_URL to your backend URL when building for production."
    );
  }
  BASE_API_URL = envUrl;
}

export default BASE_API_URL;
