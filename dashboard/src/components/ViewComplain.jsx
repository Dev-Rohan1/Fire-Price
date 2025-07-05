import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";
import toast from "react-hot-toast";
import { AppContext } from "../contexts/AppContext";
import Loader from "./Loader";

const ViewComplain = () => {
  const [complainData, setComplainData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { backendUrl } = useContext(AppContext);


  const fetchComplainById = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/complain/${id}`);
      if (data.success) {
        setComplainData(data.complainData);
      } else {
        toast.error(data.message || "অভিযোগ লোড করা যায়নি");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "সার্ভার সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplainById();
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col md:flex-row">
        <div className="hidden md:block w-54 border-r border-gray-200">
          <Sidebar />
        </div>

        <main className="flex-1 p-4">
          {loading ? (
            <Loader />
          ) : !complainData ? (
            <div className="text-center py-10 text-red-500">
              অভিযোগের তথ্য পাওয়া যায়নি।
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-6 bg-white">
              <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
                অভিযোগের বিবরণ
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Complaint Details First */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold border-b border-gray-200 pb-2 text-gray-700">
                    অভিযোগের তথ্য
                  </h2>

                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      অভিযোগের বিষয়:
                    </p>
                    <p className="text-gray-800">
                      {complainData.complainSubject || "নেই"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      অভিযোগের বিস্তারিত:
                    </p>
                    <p className="text-gray-800">
                      {complainData.complainDetails || "নেই"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      প্রমাণের ছবি:
                    </p>
                    {complainData.complainProve ? (
                      <img
                        src={complainData.complainProve}
                        alt="প্রমাণ"
                        className="rounded-lg max-w-[200px]"
                      />
                    ) : (
                      <p className="text-gray-500">কোন প্রমাণ নেই</p>
                    )}
                  </div>
                </div>

                {/* 2. Personal Information Second */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold border-b border-gray-200 pb-2 text-gray-700">
                    ব্যক্তিগত তথ্য
                  </h2>

                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      অভিযোগকারীর নাম:
                    </p>
                    <p className="text-gray-800">
                      {complainData.name || "নেই"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      মোবাইল নম্বর:
                    </p>
                    <p className="text-gray-800">
                      {complainData.mobileNumber || "নেই"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">ইমেইল:</p>
                    <p className="text-gray-800">
                      {complainData.emailAddress || "নেই"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">বিভাগ:</p>
                    <p className="text-gray-800">
                      {complainData.division || "নেই"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">উপজেলা:</p>
                    <p className="text-gray-800">
                      {complainData.upazila || "নেই"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default ViewComplain;
