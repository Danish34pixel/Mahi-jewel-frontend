const BASE_API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://mahi-jewel-backend.onrender.com";
export default BASE_API_URL;
