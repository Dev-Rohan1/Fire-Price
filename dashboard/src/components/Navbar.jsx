import {
  ChevronDown,
  CircleUserRound,
  LoaderCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { assets, menu } from "../assets/assets";
import { AppContext } from "../contexts/AppContext";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const { adminData, loading } = useContext(AppContext);
  const navigate = useNavigate();

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("প্রশাসক লগআউট সম্পন্ন হয়েছে");
    navigate("/admin-login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
      <nav className="py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img className="w-11 md:w-13" src={assets.logo} alt="Logo" />
          <h2 className="text-lg md:text-xl font-bold text-green-700">
            ড্যাশবোর্ড
          </h2>
        </Link>

        {loading ? (
          <LoaderCircle className="animate-spin hidden xl:block" />
        ) : (
          <div
            className="relative hidden xl:flex items-center gap-3"
            ref={dropdownRef}
          >
            <button
              type="button"
              onClick={toggleDropdown}
              className="flex items-center gap-2 focus:outline-none"
            >
              <span className="font-medium text-sm text-gray-700">
                {adminData?.name || "অ্যাডমিন"}
              </span>
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={adminData?.image}
                alt="User"
              />
              <ChevronDown
                size={20}
                className={`text-gray-600 transform transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full right-0 mt-5 w-50 bg-white border border-gray-200 rounded-md z-50 shadow-lg">
                <ul className="flex flex-col">
                  <li>
                    <Link
                      to="/admin-profile"
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-800 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <CircleUserRound size={18} /> প্রোফাইল
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-3 text-sm text-blue-500 hover:bg-red-50"
                    >
                      <LogOut size={18} /> লগ আউট
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={toggleMenu}
          className="xl:hidden text-gray-500 w-9 h-9 flex items-center justify-center border-gray-100 hover:border hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 border-r border-r-gray-200 transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out xl:hidden`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <Link to="/" className="flex items-center gap-3">
            <img className="w-10" src={assets.logo} alt="Logo" />
            <h2 className="text-lg font-bold text-green-700">ড্যাশবোর্ড</h2>
          </Link>
          <button
            type="button"
            className="w-9 h-9 flex items-center justify-center border-gray-100 hover:border hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
            onClick={toggleMenu}
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div
          onClick={() => navigate("/admin-profile")}
          className="p-4 border-b border-gray-200"
        >
          <div className="flex items-center gap-3">
            <img
              className="w-10 h-10 rounded-full object-cover"
              src={adminData?.image}
              alt="User"
            />
            <div className="flex flex-col truncate">
              <span className="font-medium">
                {adminData?.name || "অ্যাডমিন"}
              </span>
              <span className="text-xs text-gray-500 truncate">
                {adminData?.email || "admin@email.com"}
              </span>
            </div>
          </div>
        </div>

        <ul className="flex flex-col p-4 gap-4">
          {menu.map((item, index) => (
            <li key={index}>
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
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 text-blue-500 font-medium hover:bg-red-50 py-2.5 rounded px-2"
            >
              <LogOut size={22} />
              লগ আউট
            </button>
          </li>
        </ul>
      </div>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 backdrop-blur-[2px] z-40 xl:hidden"
          onClick={toggleMenu}
        />
      )}
    </header>
  );
};

export default Navbar;
