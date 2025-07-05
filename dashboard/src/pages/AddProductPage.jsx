import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

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

const AddProductPage = () => {
  const initialLocationPrices = divisions.reduce((acc, division) => {
    acc[division] = { retailPrice: "", wholesalePrice: "" };
    return acc;
  }, {});

  const [formData, setFormData] = useState({
    name: "",
    locationPrices: initialLocationPrices,
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e, location, type) => {
    const { name, value } = e.target;
    if (location && type) {
      setFormData((prev) => ({
        ...prev,
        locationPrices: {
          ...prev.locationPrices,
          [location]: {
            ...prev.locationPrices[location],
            [type]: value,
          },
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !imageFile) {
      toast.error("পণ্যের নাম এবং ছবি আবশ্যক!");
      return;
    }

    setLoading(true);

    const form = new FormData();
    form.append("name", formData.name);
    form.append("locationPrices", JSON.stringify(formData.locationPrices));
    form.append("image", imageFile);

    try {
      const { data } = await axios.post(
        "http://localhost:8080/product/add",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data.success) {
        toast.success(data.message || "পণ্য সফলভাবে যুক্ত হয়েছে");

        setFormData({
          name: "",
          locationPrices: initialLocationPrices,
        });
        setImageFile(null);
      } else {
        toast.error(data.message || "পণ্য যুক্ত করা ব্যর্থ হয়েছে");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "সার্ভার সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col md:flex-row">
        <div className="hidden xl:block md:w-54 border-r border-gray-200 bg-white">
          <Sidebar />
        </div>

        <main className="w-full pt-4 xl:pl-4 mb-5">
          <div>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
              নতুন পণ্য যোগ করুন
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    পণ্যের নাম
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="পণ্যের নাম"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* Upload Image */}
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
                          className="w-full h-full object-contain p-2"
                          src={URL.createObjectURL(imageFile)}
                          alt="Uploaded"
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

              {/* Price Section */}
              <div>
                <h2 className="text-lg font-semibold mb-3 text-gray-700 border-b border-b-gray-200">
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
                        value={formData.locationPrices[division].retailPrice}
                        onChange={(e) =>
                          handleChange(e, division, "retailPrice")
                        }
                        className="border border-gray-300 p-2 rounded w-full mb-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        min="0"
                        required
                      />
                      <input
                        type="number"
                        placeholder="পাইকারি মূল্য"
                        value={formData.locationPrices[division].wholesalePrice}
                        onChange={(e) =>
                          handleChange(e, division, "wholesalePrice")
                        }
                        className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-blue-400"
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
                className={`flex items-center justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm font-medium text-white transition-colors duration-300 ${
                  loading
                    ? "bg-indigo-500 opacity-70 cursor-not-allowed"
                    : "bg-indigo-500 hover:bg-indigo-600"
                }`}
              >
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin w-5 h-5 mr-2" />
                    পণ্য যোগ হচ্ছে...
                  </>
                ) : (
                  "পণ্য যোগ করুন"
                )}
              </button>
            </form>
          </div>
        </main>
      </div>
    </>
  );
};

export default AddProductPage;
