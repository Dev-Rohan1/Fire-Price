import axios from "axios";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import RecentProducts from "../components/RecentProducts";
import RecentShop from "../components/RecentShop";
import ShopCart from "../components/ShopCart";
import ShopPieChart from "../components/ShopPieChart";
import Sidebar from "../components/Sidebar";
import { AppContext } from "../contexts/AppContext";

const DashboardPage = () => {
  const [retailShop, setRetailShop] = useState(0);
  const [wholesaleShop, setWholesaleShop] = useState(0);
  const [totalStore, setTotalStore] = useState(0);
  const [allProducts, setAllProducts] = useState([]);
  const [allstores, setAllStores] = useState([]);
  const [allComplains, setAllComplains] = useState([]);
  const [loading, setLoading] = useState(false);

  const { backendUrl } = useContext(AppContext);

  const fetchStoreCountData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/dashboard/store-role-counts`
      );

      if (data?.success) {
        const retail = data.data?.RetailShop || 0;
        const wholesale = data.data?.WholesaleShop || 0;

        setRetailShop(retail);
        setWholesaleShop(wholesale);
        setTotalStore(retail + wholesale);
        setAllProducts(data.data?.AllProducts || []);
        setAllStores(data.data?.AllStores || []);
        setAllComplains(data.data?.AllComplains || []);
      } else {
        toast.error("Unexpected response format");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Server error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreCountData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="hidden xl:block w-54 border-r border-gray-200">
          <Sidebar />
        </div>

        {/* Main Content */}
        {loading ? (
          <Loader />
        ) : (
          <div className="w-full pt-4 xl:pl-4 mb-10">
            <ShopCart
              totalStore={totalStore}
              retailShop={retailShop}
              wholesaleShop={wholesaleShop}
            />

            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] border-t border-gray-200 mt-6 gap-4">
              <RecentProducts allProducts={allProducts} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] border-t border-gray-200 mt-6 gap-4">
              <ShopPieChart
                totalStore={totalStore}
                retailShop={retailShop}
                wholesaleShop={wholesaleShop}
              />
              <RecentShop allstores={allstores} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardPage;
