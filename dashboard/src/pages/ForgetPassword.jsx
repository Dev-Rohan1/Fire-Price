import axios from "axios";
import { LoaderCircle, Lock, Mail } from "lucide-react";
import { useContext, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../contexts/AppContext";

const ForgetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const inputRefs = useRef([]);
  const { backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInput = (e, index) => {
    const value = e.target.value;
    if (!/^\d$/.test(value)) {
      e.target.value = "";
      return;
    }
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    setTimeout(updateOtp, 0);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    pasted.split("").forEach((char, index) => {
      if (inputRefs.current[index] && /^\d$/.test(char)) {
        inputRefs.current[index].value = char;
      }
    });
    setTimeout(updateOtp, 0);
  };

  const updateOtp = () => {
    const code = inputRefs.current.map((ref) => ref?.value || "").join("");
    setOtp(code);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/goverment/reset-password-otp`,
        { email }
      );
      if (data.success) {
        toast.success(data.message);
        setStep(2);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "সার্ভার সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      toast.error("৬ সংখ্যার সঠিক ওটিপি দিন");
      return;
    }
    setStep(3);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/goverment/change-password`,
        {
          email,
          otp: Number(otp),
          newPassword,
        }
      );

      if (data.success) {
        toast.success("পাসওয়ার্ড সফলভাবে রিসেট হয়েছে");
        navigate("/admin-login");
        setStep(1);
        setEmail("");
        setOtp("");
        setNewPassword("");
        inputRefs.current.forEach((ref) => {
          if (ref) ref.value = "";
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "সার্ভার সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-xs border border-gray-200">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-5">
            {step === 1 && "পাসওয়ার্ড রিসেট করুন"}
            {step === 2 && "ওটিপি যাচাই করুন"}
            {step === 3 && "নতুন পাসওয়ার্ড সেট করুন"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 1 && "পাসওয়ার্ড রিসেট করার জন্য আপনার ইমেইল দিন"}
            {step === 2 && "আপনার ইমেইলে পাঠানো ৬ সংখ্যার ওটিপি লিখুন"}
            {step === 3 && "নতুন পাসওয়ার্ড লিখুন এবং সাবমিট করুন"}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="mt-6 space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="আপনার ইমেইল লিখুন"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-md shadow-xs placeholder-gray-400 outline-0"
                autoComplete="email"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors duration-300 ${
                loading
                  ? "bg-indigo-500 opacity-70 cursor-not-allowed"
                  : "bg-indigo-500 hover:bg-indigo-600"
              }`}
            >
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin mr-2 h-5 w-5" /> কোড
                  পাঠানো হচ্ছে...
                </>
              ) : (
                "কোড পাঠান"
              )}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="mt-6 space-y-6">
            <div className="flex justify-center gap-2" onPaste={handlePaste}>
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <input
                    key={index}
                    type="tel"
                    maxLength="1"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    ref={(el) => (inputRefs.current[index] = el)}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-10 h-12 text-center border border-gray-300 text-xl rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                ))}
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              ওটিপি যাচাই করুন
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={onSubmitNewPassword} className="mt-6 space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="নতুন পাসওয়ার্ড লিখুন"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-md shadow-xs placeholder-gray-400 outline-0"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors duration-300 ${
                loading
                  ? "bg-indigo-500 opacity-70 cursor-not-allowed"
                  : "bg-indigo-500 hover:bg-indigo-600"
              }`}
            >
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin mr-2 h-5 w-5" />{" "}
                  পাসওয়ার্ড রিসেট করা হচ্ছে...
                </>
              ) : (
                "পাসওয়ার্ড রিসেট করুন"
              )}
            </button>
          </form>
        )}

        <div className="text-center text-sm mt-6">
          <p className="text-gray-600">
            মনে পড়েছে?{" "}
            <Link
              to="/admin-login"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              লগইন করুন
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ForgetPassword;
