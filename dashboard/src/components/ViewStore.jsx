import axios from "axios";
import {
  BadgeCheck,
  CircleCheckBig,
  MapPin,
  MapPlus,
  Phone,
  Store,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import Sidebar from "../components/Sidebar";
import { AppContext } from "../contexts/AppContext";
import Loader from "./Loader";
import Navbar from "./Navbar";

const ViewStore = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(false);

  const { backendUrl } = useContext(AppContext);

  const fetchStoreById = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/store/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      if (data.success) {
        setShop(data.storeData);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "সার্ভার সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreById();
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
        <div className="hidden md:block w-54 border-r border-gray-200">
          <Sidebar />
        </div>

        <div className="flex-1 p-4">
          {loading ? (
            <Loader />
          ) : (
            shop && (
              <div className="bg-white shadow-xs border border-gray-200 rounded-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                  <div className="flex flex-col items-center md:flex-row md:items-center md:space-x-6">
                    <div className="relative">
                      <img
                        src={shop?.image || assets.user}
                        alt={shop?.name || "Shop Image"}
                        className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-full border-4 border-white shadow-md"
                      />
                      {shop?.verified && (
                        <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
                          <BadgeCheck className="text-white" size={20} />
                        </div>
                      )}
                    </div>
                    <div className="text-center md:text-left mt-4 md:mt-0">
                      <h2 className="text-2xl md:text-3xl font-bold">
                        {shop?.name || "নাম নেই"}
                      </h2>
                      <p className="text-blue-100 flex items-center gap-2">
                        <Store size={18} />
                        {shop?.role || "পদবী নেই"} দোকান
                      </p>
                      <div className="mt-2 flex items-center justify-center md:justify-start space-x-2">
                        <Phone size={18} />
                        <p className="text-blue-100">
                          {shop?.phone || "ফোন নেই"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Address */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                        <MapPin className="text-gray-600" size={20} />
                        ঠিকানা:
                      </h4>
                      <p className="text-gray-600">{shop?.address || "নেই"}</p>
                    </div>

                    {/* Location */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                        <MapPlus className="text-gray-600" size={20} />
                        অবস্থান:
                      </h4>
                      <div className="text-gray-600 space-y-1 pl-1">
                        <p>
                          <span className="font-medium">বিভাগ:</span>{" "}
                          {shop?.division || "নির্ধারিত নয়"}
                        </p>
                        <p>
                          <span className="font-medium">জেলা:</span>{" "}
                          {shop?.district || "নির্ধারিত নয়"}
                        </p>
                        <p>
                          <span className="font-medium">উপজেলা:</span>{" "}
                          {shop?.upazila || "নির্ধারিত নয়"}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                        <CircleCheckBig className="text-gray-600" size={20} />
                        স্ট্যাটাস:
                      </h4>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          shop?.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : shop?.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {shop?.status === "approved"
                          ? "অনুমোদিত"
                          : shop?.status === "pending"
                          ? "মুলতুবি"
                          : "প্রত্যাখ্যাত"}
                      </span>
                    </div>

                    {/* Verification */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <h4 className="font-semibold text-gray-700">
                          ভেরিফিকেশন:
                        </h4>
                      </div>
                      <div className="pl-7">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            shop.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : shop.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {shop.status === "approved"
                            ? "ভেরিফাইড"
                            : shop.status === "pending"
                            ? "মুলতুবি"
                            : "ভেরিফাইড নয়"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default ViewStore;
