// Custom hook to fetch user address by userId
import { useEffect, useState } from "react";
import BASE_API_URL from "./Baseurl";

export default function useUserAddress(userId) {
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!userId) return;
    fetch(`${BASE_API_URL}/api/auth/users`)
      .then((res) => res.json())
      .then((users) => {
        const user = users.find((u) => u._id === userId || u.id === userId);
        setAddress(user?.address || "N/A");
      })
      .catch(() => setAddress("N/A"));
  }, [userId]);

  return address;
}
