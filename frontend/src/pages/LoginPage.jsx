import axios from "axios";
import { KeyRound, LoaderCircle, Mail, Phone } from "lucide-react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../contexts/AppContext";
import { toast } from "react-hot-toast";

// Reusable InputField component
const InputField = ({
  icon: Icon,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
}) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon className="h-5 w-5 text-gray-400" />
    </div>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-md shadow-xs placeholder-gray-400 outline-none"
      value={value}
      onChange={onChange}
      required
    />
  </div>
);

const LoginPage = () => {
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${backendUrl}/store/login`, formData);

      if (data.success) {
        toast.success(data.message);

        localStorage.setItem("storeToken", data.token);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "লগইন ব্যর্থ হয়েছে";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">লগইন করুন</h2>
          <p className="mt-2 text-sm text-gray-600">
            আপনার অ্যাকাউন্টে প্রবেশ করতে লগইন করুন
          </p>
        </div>

        <form onSubmit={loginHandler} className="space-y-6">
          <InputField
            icon={Phone}
            name="phone"
            type="tel"
            placeholder="মোবাইল নাম্বার"
            value={formData.phone}
            onChange={handleChange}
          />
          <InputField
            icon={Mail}
            name="email"
            type="email"
            placeholder="আপনার ইমেইল লিখুন"
            value={formData.email}
            onChange={handleChange}
          />
          <InputField
            icon={KeyRound}
            name="password"
            type="password"
            placeholder="আপনার পাসওয়ার্ড লিখুন"
            value={formData.password}
            onChange={handleChange}
          />

          <div className="flex items-center justify-between flex-wrap text-sm">
            <div className="flex items-center gap-2">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 border-gray-300"
                required
              />
              <label htmlFor="terms" className="text-gray-700">
                শর্তাবলী ও নীতিমালা মেনে নিচ্ছি
              </label>
            </div>
            <Link
              to="/forget-password"
              className="text-indigo-600 hover:underline"
            >
              পাসওয়ার্ড ভুলে গেছেন?
            </Link>
          </div>

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
              <>
                <LoaderCircle className="animate-spin mr-2 h-5 w-5" />
                লগইন হচ্ছে...
              </>
            ) : (
              "লগইন করুন"
            )}
          </button>

          <p className="text-sm text-center text-gray-600">
            আপনার যদি অ্যাকাউন্ট না থাকে তাহলে{" "}
            <Link to="/signup" className="text-indigo-600 hover:underline">
              অ্যাকাউন্ট খুলুন
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
