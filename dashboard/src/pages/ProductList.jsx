import axios from "axios";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { AppContext } from "../contexts/AppContext";

const ProductList = () => {
  const [searchInput, setSearchInput] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("ঢাকা");
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  // লোকেশনগুলো সংগ্রহ করুন প্রোডাক্ট থেকে (ফাঁকা হলে খালি অ্যারে)
  const allLocations = Array.from(
    new Set(
      allProducts?.flatMap((product) =>
        Object.keys(product.locationPrices || {})
      ) || []
    )
  );

  // যদি current selectedLocation সবসময় ডাটা থেকে আসে তাহলে, সেট করুন লোকেশন
  useEffect(() => {
    if (allLocations.length > 0 && !allLocations.includes(selectedLocation)) {
      setSelectedLocation(allLocations[0]);
    }
  }, [allLocations, selectedLocation]);

  const filteredProducts = allProducts
    .filter((product) =>
      (product.name || "")
        .toLowerCase()
        .includes(searchInput.trim().toLowerCase())
    )
    .map((product) => ({
      ...product,
      price: product.locationPrices?.[selectedLocation] || {},
    }))
    // Avoid mutating original array with reverse, so slice first
    .slice()
    .reverse();

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/product/all-products`);
      if (data.success) {
        setAllProducts(data?.data || []);
      } else {
        toast.error(data.message || "পণ্য আনতে ব্যর্থ");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "সার্ভার সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    const confirmed = window.confirm("আপনি কি নিশ্চিতভাবে ডিলিট করতে চান?");
    if (!confirmed) return;

    try {
      const { data } = await axios.delete(
        `${backendUrl}/product/delete-product/${id}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        await fetchAllProducts();
        // navigate("/product-list"); // দরকার নেই কারণ আমরা একই পেজে আছি
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error?.response?.data?.message || "সার্ভার সমস্যা হয়েছে");
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col md:flex-row">
        <div className="hidden xl:block w-54 bg-white border-r border-gray-200">
          <Sidebar />
        </div>

        <main className="w-full pt-4 xl:pl-4 mb-10">
          <div className="mb-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-800 text-center w-full md:w-auto">
                পণ্যের তালিকা
              </h2>

              <div className="flex flex-col md:flex-row md:items-center gap-4 justify-center w-full md:w-auto">
                <input
                  type="text"
                  placeholder="পণ্য সার্চ করুন"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md outline-0"
                />
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="location" className="font-medium text-gray-700">
                  লোকেশন:
                </label>
                <select
                  id="location"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 outline-0"
                >
                  {allLocations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <Loader />
          ) : filteredProducts.length === 0 ? (
            <div className="text-center text-red-500 font-medium py-10 text-lg">
              কোনও পণ্য পাওয়া যায়নি। 🥲
            </div>
          ) : (
            <div className="overflow-x-auto bg-white">
              <table className="min-w-full text-sm text-center border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-200 px-3 py-2">
                      পণ্যের নাম
                    </th>
                    <th className="border border-gray-200 px-3 py-2 hidden md:table-cell">
                      ছবি
                    </th>
                    <th className="border border-gray-200 px-3 py-2">
                      খুচরা মূল্য ({selectedLocation})
                    </th>
                    <th className="border border-gray-200 px-3 py-2">
                      পাইকারি মূল্য ({selectedLocation})
                    </th>
                    <th className="border border-gray-200 px-3 py-2">একশন</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.slice(0, 10).map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      <td className="border border-gray-200 px-3 py-2">
                        {product.name}
                      </td>
                      <td className="border border-gray-200 px-3 py-2 hidden md:table-cell">
                        <img
                          src={product.image}
                          alt={product.name || "product image"}
                          className="w-10 h-10 object-cover mx-auto"
                          loading="lazy"
                        />
                      </td>
                      <td className="border border-gray-200 px-3 py-2">
                        {product.price.retailPrice
                          ? `${product.price.retailPrice} ৳`
                          : "N/A"}
                      </td>
                      <td className="border border-gray-200 px-3 py-2">
                        {product.price.wholesalePrice
                          ? `${product.price.wholesalePrice} ৳`
                          : "N/A"}
                      </td>
                      <td className="px-3 py-3 border-b border-r border-gray-200">
                        <div className="flex justify-center gap-2">
                          <button
                            className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/edit-product/${product._id}`);
                            }}
                          >
                            আপডেট
                          </button>
                          <button
                            className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteProduct(product._id);
                            }}
                          >
                            ডিলিট
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default ProductList;
