import { ChevronDown, CircleUserRound, LogOut, Menu, X } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { assets, menu } from "../assets/assets";
import { AppContext } from "../contexts/AppContext";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const { storeData, fetchStoreData } = useContext(AppContext);
  const navigate = useNavigate();

  const toggleMenu = () => setMobileMenuOpen((prev) => !prev);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("storeToken");
    toast.success("লগআউট সম্পন্ন হয়েছে");
    navigate("/");
    fetchStoreData();
    toggleMenu();
    window.location.reload();
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

  useEffect(() => {
    fetchStoreData();
  }, []);

  return (
    <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
      <nav className="py-3.5 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img className="w-11 md:w-13" src={assets.logo} alt="Logo" />
          <h2 className="text-lg md:text-xl font-bold text-green-700">
            ন্যায্যমূল্য
          </h2>
        </Link>

        {/* Desktop Dropdown */}
        {storeData ? (
          <div
            ref={dropdownRef}
            className="relative hidden md:flex items-center gap-3"
          >
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 focus:outline-none"
            >
              <span className="font-medium text-sm text-gray-700">
                {storeData.name}
              </span>
              <img
                src={storeData.image || assets.user}
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
              />
              <ChevronDown
                size={20}
                className={`text-gray-600 transform transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full right-0 mt-5 w-52 bg-white border border-gray-200 rounded-md shadow-md z-50">
                <ul className="flex flex-col">
                  <li>
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      <CircleUserRound size={18} /> প্রোফাইল
                    </Link>
                  </li>
                  <li>
                    <button
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
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="hidden xl:block bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            লগইন করুন
          </button>
        )}

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMenu}
          className="xl:hidden text-gray-600 w-9 h-9 flex items-center justify-center hover:bg-gray-50 rounded-md transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 border-r border-gray-200 transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out xl:hidden`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <Link to="/" className="flex items-center gap-3">
            <img className="w-10" src={assets.logo} alt="Logo" />
            <h2 className="text-lg font-bold text-green-700">ন্যায্যমূল্য</h2>
          </Link>
          <button
            onClick={toggleMenu}
            className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 rounded-md"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Mobile Profile Info */}
        {storeData && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={storeData.image || assets.user}
                alt="User"
              />
              <div className="flex flex-col truncate">
                <span className="font-medium">{storeData.name}</span>
                <span className="text-xs text-gray-500 truncate">
                  {storeData.email}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        <ul className="flex flex-col p-4 gap-4">
          {menu.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.path}
                onClick={toggleMenu}
                className="flex items-center gap-2 text-gray-700 font-medium hover:text-blue-500 hover:bg-blue-50 py-2.5 rounded px-2"
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
      </div>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={toggleMenu}
          className="fixed inset-0 backdrop-blur-[2px] z-40 xl:hidden"
        />
      )}
    </header>
  );
};

export default Navbar;
