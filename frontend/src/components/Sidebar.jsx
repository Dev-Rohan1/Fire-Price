import { LogOut } from "lucide-react";
import { useContext } from "react";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import { menu } from "../assets/assets";
import { AppContext } from "../contexts/AppContext";

const Sidebar = () => {
  const { storeData, getStoreData } = useContext(AppContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("storeToken");
    toast.success("লগআউট সম্পন্ন হয়েছে");
    navigate("/login");
    getStoreData();
    window.location.reload();
  };

  return (
    <aside>
      <ul className="flex flex-col pt-4 pr-4 gap-4">
        {menu.map((item) => (
          <li key={item.id}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center px-4 gap-2 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-700"
                }`
              }
            >
              <item.icon size={22} /> {item.name}
            </NavLink>
          </li>
        ))}
        <li>
          {storeData ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 text-blue-500 font-medium hover:bg-red-50 py-2.5 rounded px-2"
            >
              <LogOut size={22} /> লগ আউট
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              লগইন করুন
            </button>
          )}
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
