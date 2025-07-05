import axios from "axios";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { AppContext } from "../contexts/AppContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Loader, LoaderCircle } from "lucide-react";

const ComplainBox = () => {
  const [loading, setLoading] = useState(false);

  const { backendUrl } = useContext(AppContext);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    division: "",
    district: "",
    upazila: "",
    complainSubject: "",
    complainDetails: "",
    complainProve: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStepOne = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "নাম আবশ্যক";
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "মোবাইল নম্বর আবশ্যক";
    } else if (!/^\d{11}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "১১ সংখ্যার মোবাইল নম্বর দিন";
    }
    if (!formData.division.trim()) newErrors.division = "বিভাগ আবশ্যক";
    if (!formData.district.trim()) newErrors.district = "জেলা আবশ্যক";
    if (!formData.upazila.trim()) newErrors.upazila = "উপজেলা আবশ্যক";
    if (!formData.complainSubject.trim())
      newErrors.complainSubject = "অভিযোগের বিষয় আবশ্যক";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStepTwo = () => {
    const newErrors = {};
    if (!formData.complainDetails.trim()) {
      newErrors.complainDetails = "অভিযোগের বিস্তারিত আবশ্যক";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStepOne()) setStep(2);
  };

  const handleBack = () => setStep(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStepTwo()) return;

    setLoading(true);

    try {
      const submissionData = new FormData();
      for (const key in formData) {
        submissionData.append(key, formData[key]);
      }

      const { data } = await axios.post(
        `${backendUrl}/complain/send-complain`,
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("অভিযোগ সফলভাবে জমা হয়েছে!");
      setFormData({
        name: "",
        mobileNumber: "",
        division: "",
        district: "",
        upazila: "",
        complainSubject: "",
        complainDetails: "",
        complainProve: null,
      });
      setStep(1);
    } catch (error) {
      toast.error("অভিযোগ জমা দিতে ব্যর্থ!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col md:flex-row">
        <div className="hidden md:block w-54 border-r border-gray-200">
          <Sidebar />
        </div>

        <div className="w-full pt-4 xl:pl-4 mb-10">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              অভিযোগ পাঠান
            </h1>
            <p className="mt-2 text-gray-600">
              আপনি যদি কোনও পণ্যের দাম, মান বা অন্য কোনো বিষয়ে অভিযোগ করতে চান,
              নিচের ফর্মটি পূরণ করুন।
            </p>
          </div>

          {/* Stepper */}
          <div className="relative mb-8">
            <div className="flex justify-between">
              {[1, 2].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className="flex flex-col items-center z-10"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 text-sm font-semibold ${
                      step >= stepNumber
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-300 bg-white text-gray-400"
                    }`}
                  >
                    {stepNumber}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      step >= stepNumber ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {stepNumber === 1 ? "ব্যক্তিগত তথ্য" : "অভিযোগ"}
                  </span>
                </div>
              ))}
            </div>
            <div className="absolute top-5 left-0 right-0 flex items-center justify-between px-10">
              <div
                className={`h-1 flex-1 mx-2 ${
                  step > 1 ? "bg-blue-600" : "bg-gray-200"
                }`}
              ></div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg space-y-6 border border-gray-200"
          >
            {step === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="col-span-1 sm:col-span-2">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    ব্যক্তিগত তথ্য
                  </h2>
                </div>

                {[
                  { name: "name", placeholder: "পূর্ণ নাম" },
                  {
                    name: "mobileNumber",
                    placeholder: "মোবাইল নম্বর",
                    type: "tel",
                  },
                  { name: "division", placeholder: "বিভাগ" },
                  { name: "district", placeholder: "জেলা" },
                  { name: "upazila", placeholder: "উপজেলা" },
                  { name: "complainSubject", placeholder: "অভিযোগের বিষয়" },
                ].map((input) => (
                  <div key={input.name} className="flex flex-col">
                    <input
                      type={input.type || "text"}
                      name={input.name}
                      value={formData[input.name]}
                      onChange={handleChange}
                      placeholder={input.placeholder}
                      className={`w-full px-4 py-2 border rounded-md outline-none ${
                        errors[input.name]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors[input.name] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[input.name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  অভিযোগের বিস্তারিত
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    বিস্তারিত বিবরণ <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="complainDetails"
                    rows="6"
                    value={formData.complainDetails}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md outline-none ${
                      errors.complainDetails
                        ? "border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="আপনার অভিযোগের বিস্তারিত লিখুন..."
                  ></textarea>
                  {errors.complainDetails && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.complainDetails}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    প্রমাণ (যদি থাকে)
                  </label>
                  <input
                    type="file"
                    name="complainProve"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    ছবি, ডকুমেন্ট বা অন্য কোন প্রমাণ আপলোড করতে পারেন (সর্বোচ্চ
                    5MB)
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row justify-between pt-4 border-t border-gray-200">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mb-4 md:mb-0"
                >
                  পূর্ববর্তী
                </button>
              )}
              {step < 2 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  পরবর্তী
                </button>
              ) : (
                <button
                  type="submit"
                  className={`px-6 py-2 rounded-md text-white transition duration-200 ${
                    loading
                      ? "bg-green-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <LoaderCircle size={19} className="animate-spin" />
                      <span>অভিযোগ পাঠানো হচ্ছে...</span>
                    </div>
                  ) : (
                    "অভিযোগ জমা দিন"
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ComplainBox;
