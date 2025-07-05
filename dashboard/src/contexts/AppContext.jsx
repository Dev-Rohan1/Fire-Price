import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/goverment/data`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      if (data.success) {
        setAdminData(data.govermentData);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "সার্ভার সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) fetchAdminData();
  }, []);

  // Context value
  const value = {
    backendUrl,
    adminData,
    loading,
    fetchAdminData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
