import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { AppContext } from "../contexts/AppContext";

const divisions = [
  "ঢাকা",
  "চট্টগ্রাম",
  "রাজশাহী",
  "খুলনা",
  "বরিশাল",
  "সিলেট",
  "রংপুর",
  "ময়মনসিংহ",
];

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  // Default empty prices for each division
  const defaultLocationPrices = divisions.reduce((acc, division) => {
    acc[division] = { retailPrice: "", wholesalePrice: "" };
    return acc;
  }, {});

  const [formData, setFormData] = useState({
    name: "",
    image: null,
    locationPrices: defaultLocationPrices,
  });
  const [imageFile, setImageFile] = useState(null);
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch product on mount
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${backendUrl}/product/find-product/${id}`,
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );

        if (data.success) {
          const product = data.data;
          setProductData(product);

          // Fill prices, convert to string for controlled inputs
          const filledPrices = divisions.reduce((acc, division) => {
            const locPrice = product.locationPrices?.[division] || {};
            acc[division] = {
              retailPrice: locPrice.retailPrice?.toString() || "",
              wholesalePrice: locPrice.wholesalePrice?.toString() || "",
            };
            return acc;
          }, {});

          setFormData({
            name: product.name,
            locationPrices: filledPrices,
          });
        } else {
          toast.error("পণ্য লোড করা যায়নি");
        }
      } catch (error) {
        toast.error("সার্ভার সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id, backendUrl]);

  // Handle price inputs
  const handleChange = (e, division, priceType) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      locationPrices: {
        ...prev.locationPrices,
        [division]: {
          retailPrice:
            priceType === "retailPrice"
              ? value
              : prev.locationPrices[division]?.retailPrice || "",
          wholesalePrice:
            priceType === "wholesalePrice"
              ? value
              : prev.locationPrices[division]?.wholesalePrice || "",
        },
      },
    }));
  };

  // Handle name input
  const handleNameChange = (e) => {
    setFormData((prev) => ({ ...prev, name: e.target.value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert prices to numbers, fallback 0
      const updatedPrices = {};
      for (const division of divisions) {
        updatedPrices[division] = {
          retailPrice:
            Number(formData.locationPrices[division]?.retailPrice) || 0,
          wholesalePrice:
            Number(formData.locationPrices[division]?.wholesalePrice) || 0,
        };
      }

      // Create new FormData instance here (important!)
      const form = new FormData();
      form.append("name", formData.name);
      form.append("locationPrices", JSON.stringify(updatedPrices));
      if (imageFile) form.append("image", imageFile);

      console.log(formData);

      // Send PUT request with form data
      const { data } = await axios.put(
        `${backendUrl}/product/update-product/${id}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "পণ্য আপডেট ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col md:flex-row">
        <div className="hidden md:block w-56 border-r border-gray-200 bg-white">
          <Sidebar />
        </div>

        <div className="flex-1 p-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  পণ্যের নাম
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="পণ্যের নাম"
                  required
                  className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <span className="block mb-1 font-medium text-gray-700">
                  পণ্যের ছবি
                </span>
                <div className="w-40 h-40 border border-gray-200 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden">
                  <label className="cursor-pointer w-full h-full flex items-center justify-center">
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => setImageFile(e.target.files[0])}
                    />
                    {imageFile ? (
                      <img
                        src={URL.createObjectURL(imageFile)}
                        alt="Uploaded"
                        className="w-full h-full object-contain p-2"
                      />
                    ) : productData?.image ? (
                      <img
                        src={productData.image}
                        alt="Product"
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <span className="text-sm text-gray-500">
                        ছবি যুক্ত করুন
                      </span>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3 text-gray-700 border-b border-gray-200">
                বিভাগভিত্তিক মূল্য
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {divisions.map((division) => (
                  <div key={division}>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {division}
                    </h3>
                    <input
                      type="number"
                      placeholder="খুচরা মূল্য"
                      value={
                        formData.locationPrices[division]?.retailPrice || ""
                      }
                      onChange={(e) => handleChange(e, division, "retailPrice")}
                      className="border border-gray-300 p-2 rounded w-full mb-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      min="0"
                      required
                    />
                    <input
                      type="number"
                      placeholder="পাইকারি মূল্য"
                      value={
                        formData.locationPrices[division]?.wholesalePrice || ""
                      }
                      onChange={(e) =>
                        handleChange(e, division, "wholesalePrice")
                      }
                      className="border border-gray-300 p-2 rounded w-full mb-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      min="0"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`flex items-center justify-center py-2.5 px-4 rounded-md shadow-sm font-medium text-white transition-colors duration-300 ${
                loading
                  ? "bg-indigo-500 opacity-70 cursor-not-allowed"
                  : "bg-indigo-500 hover:bg-indigo-600"
              }`}
            >
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin w-5 h-5 mr-2" />
                  পণ্য আপডেট হচ্ছে...
                </>
              ) : (
                "পণ্য আপডেট করুন"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProductPage;
