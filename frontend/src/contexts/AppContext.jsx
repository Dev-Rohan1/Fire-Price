import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [storeData, setStoreData] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchStoreData = async () => {
    const token = localStorage.getItem("storeToken");
    if (!token) return;

    try {
      const { data } = await axios.get(`${backendUrl}/store/data`, {
        headers: { token },
      });

      setStoreData(data.storeData);
    } catch (error) {
      console.error("❌ Store data fetch failed:", error);

      // If token is invalid, remove it and clear state
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("storeToken");
      }

      setStoreData(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("storeToken");
    if (token) fetchStoreData();
  }, []);

  const value = {
    backendUrl,
    storeData,
    setStoreData,
    fetchStoreData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
