import axios from "axios";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../contexts/AppContext";
import Loader from "../components/Loader";

const Shops = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("সব");
  const [shopsList, setShopsList] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const fetchAllStore = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("storeToken");
      const { data } = await axios.get(
        `${backendUrl}/goverment/get-all-shop-list`
      );

      if (data.success && Array.isArray(data.storeList)) {
        setShopsList(data.storeList);

        // ✅ Safe unique division extraction
        const uniqueDivisions = Array.from(
          new Set(
            data.storeList
              .map((shop) => shop?.division?.trim())
              .filter((div) => !!div)
          )
        );
        setDivisions(uniqueDivisions);
      } else {
        toast.error(data.message || "ডাটা লোড করা যায়নি");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "সার্ভার সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStore();
  }, []);

  const filteredShops = shopsList
    .filter((shop) =>
      shop?.name?.toLowerCase().includes(searchTerm.toLowerCase().trim())
    )
    .filter((shop) =>
      selectedLocation === "সব" ? true : shop?.division === selectedLocation
    )
    .reverse();

  return (
    <>
      <div>
        {/* Header & Filters */}
        <div className="grid grid-cols-1 gap-3 mb-3 md:grid-cols-3 md:items-center">
          <h2 className="text-xl font-bold text-gray-800 md:col-span-1">
            দোকানের তালিকা
          </h2>

          <div className="col-span-1">
            <input
              type="text"
              placeholder="দোকান সার্চ করুন"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
          </div>

          <div className="flex items-center space-x-2 md:justify-end">
            <label htmlFor="location" className="font-semibold">
              বিভাগ:
            </label>
            <select
              id="location"
              className="border border-gray-300 rounded px-2 py-1"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="সব">সব</option>
              {divisions.map((division) => (
                <option key={division} value={division}>
                  {division}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Shop Table */}
        <div className="overflow-x-auto bg-white">
          <table className="min-w-full text-sm text-center border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-200 px-3 py-2">নাম</th>
                <th className="border border-gray-200 px-3 py-2 hidden md:table-cell">
                  ছবি
                </th>
                <th className="border border-gray-200 px-3 py-2">ভূমিকা</th>
                <th className="border border-gray-200 px-3 py-2">জেলা</th>
                <th className="border border-gray-200 px-3 py-2">উপজেলা</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-4">
                    <Loader />
                  </td>
                </tr>
              ) : filteredShops.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="border border-gray-200 px-3 py-2 text-red-500"
                  >
                    কোনও দোকান পাওয়া যায়নি 🥲
                  </td>
                </tr>
              ) : (
                filteredShops.map((shop, index) => (
                  <tr
                    key={shop._id || `${shop.name}-${index}`}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/store/${shop._id}`)}
                  >
                    <td className="border border-gray-200 px-3 py-2">
                      {shop.name || "N/A"}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 hidden md:table-cell">
                      <img
                        src={shop.image || assets.user}
                        alt={shop.name || "store"}
                        className="w-12 h-12 object-cover mx-auto rounded-full"
                        loading="lazy"
                      />
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      {shop.role || "N/A"}
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      {shop.district || "N/A"}
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      {shop.upazila || "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Shops;
