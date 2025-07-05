import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { assets } from "../assets/assets";
import { AppContext } from "../contexts/AppContext";

const UpdateProfile = ({ editData, setIsEditModalOpen, fetchAdminData }) => {
  const [changeProfile, setChangeProfile] = useState(null);
  const [name, setName] = useState(editData.name || "");
  const [phone, setPhone] = useState(editData.phone || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { backendUrl } = useContext(AppContext);

  const handleUpdate = async () => {
    if (!name || !phone) {
      toast.error("নাম এবং ফোন নাম্বার আবশ্যক");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("password", password);
      if (changeProfile) {
        formData.append("image", changeProfile);
      }

      const { data } = await axios.put(
        `${backendUrl}/goverment/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        fetchAdminData();
        setIsEditModalOpen(false);
        window.location.reload();
      } else {
        toast.error(data.message || "আপডেট ব্যর্থ হয়েছে");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "সার্ভার সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="border-b border-gray-200 p-4">
          <h2 className="text-xl font-semibold">প্রোফাইল এডিট করুন</h2>
        </div>

        <div className="p-6">
          <label className="flex flex-col items-center mb-6 cursor-pointer">
            <input
              type="file"
              onChange={(e) => setChangeProfile(e.target.files[0])}
              hidden
            />
            <img
              src={
                changeProfile
                  ? URL.createObjectURL(changeProfile)
                  : editData.image || assets.user
              }
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mb-2"
            />
            <span className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              ছবি পরিবর্তন করুন
            </span>
          </label>

          <div className="space-y-4">
            <InputField
              label="নাম"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="নতুন নাম লিখুন"
            />
            <InputField
              label="ফোন নাম্বার"
              name="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="নতুন ফোন নাম্বার লিখুন"
            />
            <InputField
              label="নতুন পাসওয়ার্ড"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="পাসওয়ার্ড পরিবর্তন করতে চাইলে লিখুন"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 p-4 flex justify-end gap-3">
          <button
            onClick={() => {
              setIsEditModalOpen(false);
              setChangeProfile(null);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            বাতিল
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-1">
                <LoaderCircle className="animate-spin" size={20} /> আপডেট
                হচ্ছে...{" "}
              </span>
            ) : (
              "পরিবর্তন করুন"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
);

export default UpdateProfile;
