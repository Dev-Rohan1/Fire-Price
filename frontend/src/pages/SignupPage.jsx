import axios from "axios";
import {
  Building2,
  Camera,
  CircleUserRound,
  Home,
  KeyRound,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../contexts/AppContext";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [division, setDivision] = useState("");
  const [upazila, setUpazila] = useState("");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    if (image) formData.append("image", image);
    formData.append("role", role);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("district", district);
    formData.append("division", division);
    formData.append("upazila", upazila);

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/store/register`,
        formData
      );
      if (data.success) {
        toast.success(data.message);
        localStorage.setItem("storeToken", data.token);
        navigate("/");
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "সাইনআপ ব্যর্থ হয়েছে";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">অ্যাকাউন্ট খুলুন</h2>
          <p className="mt-2 text-sm text-gray-600">আপনার তথ্য পূরণ করুন</p>
        </div>

        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep(2);
            }}
            className="space-y-4"
          >
            <InputField
              icon={CircleUserRound}
              name="shopName"
              placeholder="দোকানের নাম"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <InputField
              icon={Mail}
              name="email"
              type="email"
              placeholder="ইমেইল লিখুন"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputField
              icon={KeyRound}
              name="password"
              type="password"
              placeholder="পাসওয়ার্ড দিন"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex items-center gap-2 text-sm">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="text-gray-700 cursor-pointer">
                শর্তাবলী ও নীতিমালা মেনে নিচ্ছি
              </label>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition duration-200"
            >
              পরবর্তী ধাপ
            </button>
            <p className="text-sm text-center text-gray-600">
              আপনার যদি অ্যাকাউন্ট থাকে তাহলে{" "}
              <Link to="/login" className="text-indigo-600 hover:underline">
                লগইন করুন
              </Link>
            </p>
          </form>
        )}

        {step === 2 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep(3);
            }}
            className="flex flex-col items-center"
          >
            <div className="relative group mb-4">
              <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-300">
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="text-gray-400" size={32} />
                )}
              </div>
              <label
                htmlFor="profile-image"
                className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700"
              >
                <Camera size={16} />
                <input
                  id="profile-image"
                  name="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
            </div>
            <span className="text-sm text-gray-500 mb-6">
              {image ? "ছবি পরিবর্তন করুন" : "প্রোফাইল ছবি আপলোড করুন"}
            </span>
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition duration-200"
            >
              পরবর্তী ধাপ
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-gray-700 font-medium mb-1 block">
                দোকানের ধরণ
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="পাইকারি"
                    onChange={(e) => setRole(e.target.value)}
                    required
                  />
                  <span>পাইকারি</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="খুচরা"
                    onChange={(e) => setRole(e.target.value)}
                    required
                  />
                  <span>খুচরা</span>
                </label>
              </div>
            </div>
            <InputField
              icon={Phone}
              name="phone"
              placeholder="মোবাইল নম্বর"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <InputField
              icon={Home}
              name="address"
              placeholder="ঠিকানা"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <InputField
              icon={MapPin}
              name="district"
              placeholder="জেলা"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
            <label className="text-gray-700 font-medium mb-1 block">
              বিভাগ
            </label>
            <select
              className="block w-full pl-3 pr-3 py-3 border border-gray-200 rounded-md shadow-xs placeholder-gray-400 outline-none"
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              required
            >
              <option value="">বিভাগ সিলেক্ট করুন</option>
              <option value="ঢাকা">ঢাকা</option>
              <option value="চট্টগ্রাম">চট্টগ্রাম </option>
              <option value="রাজশাহী">রাজশাহী </option>
              <option value="বরিশাল">বরিশাল </option>
              <option value="সিলেট">সিলেট</option>
              <option value="রংপুর">রংপুর</option>
              <option value="খুলনা">খুলনা</option>
              <option value="ময়মনসিংহ">ময়মনসিংহ</option>
            </select>
            <InputField
              icon={Building2}
              name="upazila"
              placeholder="উপজেলা"
              value={upazila}
              onChange={(e) => setUpazila(e.target.value)}
            />
            <button
              type="submit"
              className={`w-full flex justify-center items-center py-3 px-4 rounded-md text-white font-medium transition duration-300 ${
                loading
                  ? "bg-indigo-500 opacity-70 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
              disabled={loading}
            >
              {loading ? (
                <LoaderCircle className="animate-spin mr-2" />
              ) : (
                "অ্যাকাউন্ট তৈরি করুন"
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

const InputField = ({
  icon: Icon,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
}) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon className="h-5 w-5 text-gray-400" />
    </div>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-md shadow-xs placeholder-gray-400 outline-none"
      required
    />
  </div>
);

export default SignupPage;
