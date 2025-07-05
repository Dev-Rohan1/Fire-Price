import { LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import { menu } from "../assets/assets";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("প্রশাসক লগআউট সম্পন্ন হয়েছে");
    navigate("/admin-login");
  };

  return (
    <aside>
      <ul className="flex flex-col py-4 pr-4 gap-4">
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
          <button
            onClick={() => handleLogout()}
            type="button"
            className="w-full flex items-center gap-2 text-blue-500 font-medium hover:bg-red-50 py-2.5 rounded px-4"
          >
            <LogOut size={22} />
            লগ আউট
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
