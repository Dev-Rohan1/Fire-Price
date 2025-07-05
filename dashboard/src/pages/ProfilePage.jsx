import { Edit, Mail, Phone, User } from "lucide-react";
import { useContext, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import UpdateProfile from "../components/UpdateProfile";
import { AppContext } from "../contexts/AppContext";

const ProfilePage = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const { adminData, loading, fetchAdminData } = useContext(AppContext);

  const handleEditClick = () => {
    if (adminData) {
      setEditData({ ...adminData });
      setIsEditModalOpen(true);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col md:flex-row">
        <aside className="hidden xl:block w-54 border-r border-gray-200 bg-white">
          <Sidebar />
        </aside>

        <div className="w-full pt-4 xl:pl-4">
          <div className="border border-gray-200 bg-white shadow rounded-xl overflow-hidden">
            <div className="bg-indigo-500 p-6 text-white">
              <h1 className="text-2xl sm:text-3xl font-bold">
                প্রশাসক প্রোফাইল
              </h1>
            </div>

            <div className="p-6 md:p-8">
              {loading ? (
                <p className="text-center text-gray-500">লোড হচ্ছে...</p>
              ) : (
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-1/3 flex flex-col items-center">
                    <div className="relative mb-4">
                      <img
                        src={adminData?.image}
                        alt="Admin"
                        className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    </div>
                  </div>

                  <div className="w-full md:w-2/3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InfoItem
                        icon={<User />}
                        label="নাম"
                        value={adminData?.name}
                      />
                      <InfoItem
                        icon={<Mail />}
                        label="ইমেইল"
                        value={adminData?.email}
                      />
                      <InfoItem
                        icon={<Phone />}
                        label="ফোন"
                        value={adminData?.phone}
                      />
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button
                        onClick={handleEditClick}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition"
                      >
                        <Edit className="h-4 w-4" />
                        প্রোফাইল এডিট করুন
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {isEditModalOpen && editData && (
            <UpdateProfile
              editData={editData}
              setIsEditModalOpen={setIsEditModalOpen}
              onUpdate={fetchAdminData}
              fetchAdminData={fetchAdminData}
            />
          )}
        </div>
      </div>
    </>
  );
};

const InfoItem = ({ icon, label, value, full }) => (
  <div className={`flex items-start gap-4 ${full ? "md:col-span-2" : ""}`}>
    <div className="bg-indigo-100 p-3 rounded-full">{icon}</div>
    <div>
      <h3 className="text-sm font-medium text-gray-500">{label}</h3>
      <p className="text-gray-900 break-all">{value || "N/A"}</p>
    </div>
  </div>
);

export default ProfilePage;
