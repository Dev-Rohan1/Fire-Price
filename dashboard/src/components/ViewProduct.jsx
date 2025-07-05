import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { AppContext } from "../contexts/AppContext";
import Loader from "./Loader";

const ViewProductPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const fetchProductById = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/product/find-product/${id}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data.success) {
        setProduct(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "সার্ভার সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductById();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    try {
      return new Date(dateString).toLocaleDateString("bn-BD", options);
    } catch {
      return "N/A";
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col md:flex-row">
        <div className="hidden md:block w-54 border-r border-gray-200">
          <Sidebar />
        </div>

        <div className="flex-1 p-4">
          {loading ? (
            <Loader />
          ) : product ? (
            <div className="bg-white rounded-xl shadow-xs border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" /> পণ্য তালিকায় ফিরে যান
                </button>
              </div>

              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-1/3 lg:w-1/4">
                    <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center shadow-inner">
                      <img
                        src={product.image || "/placeholder.jpg"}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/placeholder.jpg";
                        }}
                        alt={product.name || "পণ্য"}
                        className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="mb-6 mt-4">
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        {product.name}
                      </h1>
                      <p className="text-gray-500 text-sm">
                        পণ্য যোগ করার তারিখ: {formatDate(product.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        এলাকা অনুযায়ী মূল্য
                      </h3>

                      {product.locationPrices &&
                      Object.keys(product.locationPrices).length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {Object.entries(product.locationPrices).map(
                            ([location, price]) => (
                              <div
                                key={location}
                                className="border border-gray-200 rounded-lg p-4 bg-gradient-to-b from-white to-gray-50"
                              >
                                <h4 className="font-medium text-gray-900 text-lg mb-3">
                                  {location}
                                </h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      খুচরা:
                                    </span>
                                    <span className="font-semibold text-blue-600">
                                      {price?.retailPrice ?? "N/A"} ৳
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      পাইকারি:
                                    </span>
                                    <span className="font-semibold text-blue-600">
                                      {price?.wholesalePrice ?? "N/A"} ৳
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm text-gray-500 mt-3 pt-2 border-t border-gray-100">
                                    <span>মূল্য আপডেট:</span>
                                    <span>
                                      {formatDate(
                                        price?.updatedAt || product.updatedAt
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm">
                          কোনো মূল্য তথ্য পাওয়া যায়নি।
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md mx-auto">
              <div className="text-gray-400 mb-4 text-5xl">😕</div>
              <h2 className="text-xl font-medium text-gray-800 mb-2">
                পণ্য পাওয়া যায়নি
              </h2>
              <p className="text-gray-600 mb-6">
                আপনি যে পণ্যটি খুঁজছেন তা বিদ্যমান নেই বা সরিয়ে ফেলা হয়েছে
              </p>
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> ফিরে যান
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewProductPage;
