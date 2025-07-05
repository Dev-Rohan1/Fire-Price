import axios from "axios";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { AppContext } from "../contexts/AppContext";
import Loader from "../components/Loader";

const ShopRequestPage = () => {
  const [reqShops, setReqShops] = useState(null);
  const { backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const fetchShopReqData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/goverment/get-all-request-shop-list`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data.success) {
        setReqShops(data.reqStoreList);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "সার্ভার সমস্যা হয়েছে");
    } finally {
      setLoading(false); // ✅ Corrected
    }
  };

  useEffect(() => {
    fetchShopReqData();
  }, []);

  const handleChangeStatus = async (id, status) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/goverment/change-store-status`,
        { storeId: id, status: status.toLowerCase() },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        fetchShopReqData();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "সার্ভার সমস্যা হয়েছে");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col md:flex-row">
        <div className="hidden xl:block w-54 border-r border-gray-200 bg-white">
          <Sidebar />
        </div>
        <div className="w-full pt-4 xl:pl-4 mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            দোকানের রিকোয়েস্ট
          </h2>
          <div className="overflow-auto bg-white">
            <table className="min-w-full text-sm text-center border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 border-b border-b-gray-200">নাম</th>
                  <th className="px-3 py-3 border-b border-b-gray-200 hidden md:block">
                    ছবি
                  </th>
                  <th className="px-3 py-3 border-b border-b-gray-200">
                    ভূমিকা
                  </th>
                  <th className="px-3 py-3 border-b border-b-gray-200">জেলা</th>
                  <th className="px-3 py-3 border-b border-b-gray-200">
                    উপজেলা
                  </th>
                  <th className="px-3 py-3 border-b border-b-gray-200">
                    অ্যাকশন
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-6">
                      <Loader />
                    </td>
                  </tr>
                ) : reqShops?.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-6 text-red-500 font-semibold text-lg"
                    >
                      কোনও দোকান অনুরোধ পাওয়া যায়নি। 🥲
                    </td>
                  </tr>
                ) : (
                  reqShops
                    ?.slice()
                    .reverse()
                    .map((shop) => (
                      <tr
                        key={shop._id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-3 py-3 border-b border-b-gray-200 font-medium text-gray-800 truncate max-w-[150px]">
                          {shop.name}
                        </td>
                        <td className="hidden md:block px-3 py-3 border-b border-b-gray-200">
                          <img
                            src={shop.image}
                            alt={shop.name || "Shop"}
                            className="w-10 h-10 object-cover rounded-full mx-auto"
                            loading="lazy"
                          />
                        </td>
                        <td className="px-3 py-3 border-b border-b-gray-200 font-medium text-gray-800 truncate max-w-[150px]">
                          {shop.role}
                        </td>
                        <td className="px-3 py-3 border-b border-b-gray-200 font-medium text-gray-800 truncate max-w-[150px]">
                          {shop.district}
                        </td>
                        <td className="px-3 py-3 border-b border-b-gray-200 font-medium text-gray-800 truncate max-w-[150px]">
                          {shop.upazila}
                        </td>
                        <td className="px-3 py-3 border-b border-b-gray-200 font-medium text-gray-800 truncate max-w-[150px]">
                          {shop.status === "pending" ? (
                            <div className="flex items-center gap-2 justify-center">
                              <button
                                onClick={() =>
                                  handleChangeStatus(shop._id, "approved")
                                }
                                className="bg-green-500 px-2 py-1 rounded text-white text-xs hover:bg-green-600"
                              >
                                অ্যাপ্রুভ
                              </button>
                              <button
                                onClick={() =>
                                  handleChangeStatus(shop._id, "rejected")
                                }
                                className="bg-red-500 px-2 py-1 rounded text-white text-xs hover:bg-red-600"
                              >
                                রিজেক্ট
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-500 text-xs">
                              {shop.status === "approved"
                                ? "✅ অ্যাপ্রুভড"
                                : "❌ রিজেক্টেড"}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopRequestPage;
