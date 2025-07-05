import axios from "axios";
import { KeyRound, LoaderCircle, Mail } from "lucide-react";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../contexts/AppContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { backendUrl, fetchAdminData } = useContext(AppContext);
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { data } = await axios.post(`${backendUrl}/goverment/login`, {
        email,
        password,
      });

      if (data.success) {
        toast.success(data.message);
        localStorage.setItem("token", data?.govermentData?.token);
        fetchAdminData();
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "লগইন করতে সমস্যা হচ্ছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-xs border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            প্রশাসক লগইন
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            আপনার অ্যাকাউন্টে প্রবেশ করতে লগইন করুন
          </p>
        </div>

        <form onSubmit={loginHandler} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              value={email}
              autoComplete="email"
              placeholder="আপনার ইমেইল লিখুন"
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-md shadow-xs placeholder-gray-400 outline-none"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <KeyRound className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              name="password"
              value={password}
              autoComplete="current-password"
              placeholder="আপনার পাসওয়ার্ড লিখুন"
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-md shadow-xs placeholder-gray-400 outline-none"
              required
            />
          </div>

          <div className="flex items-center justify-between flex-wrap">
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 border-gray-300"
                required
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-900"
              >
                শর্তাবলী ও নীতিমালা মেনে নিচ্ছি
              </label>
            </div>

            <div className="text-sm mt-2 sm:mt-0">
              <Link
                to="/admin-forget-password"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors duration-300 ${
              loading
                ? "bg-indigo-500 opacity-70 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600"
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <LoaderCircle className="animate-spin mr-2 h-5 w-5" /> লগইন
                হচ্ছে...
              </>
            ) : (
              "লগইন করুন"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
