import { useNavigate } from "react-router-dom";
import { complainBox } from "../assets/assets";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../contexts/AppContext";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const ComplainPage = () => {
  const [allComplains, setAllComplains] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const fetchAllComplains = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/complain/all-complain`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      if (data.success) {
        setAllComplains(data.complains);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "সার্ভার সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllComplains();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="hidden xl:block w-54 border-r border-gray-200 bg-white">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="w-full pt-4 xl:pl-4 mb-10">
          <h2 className="text-xl font-bold mb-4">সবগুলো অভিযোগ</h2>
          <div className="bg-white overflow-x-auto">
            <div className="min-w-[1000px] border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="p-6 flex justify-center">
                  <Loader />
                </div>
              ) : allComplains.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  কোনো অভিযোগ পাওয়া যায়নি।
                </div>
              ) : (
                <>
                  {/* Table Header */}
                  <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 border-b border-gray-300 font-semibold text-gray-700 text-sm">
                    <div className="col-span-1">অভিযোগকারীর নাম</div>
                    <div className="col-span-1">মোবাইল নম্বর</div>
                    <div className="col-span-1">বিভাগ</div>
                    <div className="col-span-1">উপজেলা</div>
                    <div className="col-span-1">অভিযোগের বিষয়</div>
                  </div>

                  {/* Complains List */}
                  {allComplains.reverse().map((complain) => (
                    <div
                      onClick={() => navigate(`/complain/${complain._id}`)}
                      key={complain._id}
                      className="grid grid-cols-5 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 text-sm text-gray-800 transition cursor-pointer"
                    >
                      <div className="col-span-1">{complain.name || "N/A"}</div>
                      <div className="col-span-1">
                        {complain.mobileNumber || "N/A"}
                      </div>
                      <div className="col-span-1">
                        {complain.division || "N/A"}
                      </div>
                      <div className="col-span-1">
                        {complain.upazila || "N/A"}
                      </div>
                      <div className="col-span-1">
                        {complain.complainSubject
                          ? `${complain.complainSubject.slice(0, 20)}${
                              complain.complainSubject.length > 20 ? "..." : ""
                            }`
                          : "N/A"}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComplainPage;
