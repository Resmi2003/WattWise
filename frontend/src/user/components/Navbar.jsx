import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Moon, Sun, User, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBell } from "react-icons/fa";


function Navbar() {

  const { user } = useAppContext();
  const { darkMode, setDarkMode, unreadCount } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(false);

  const titles = {
    "/dashboard": "Dashboard",
    "/appliances": "Appliances",
    "/usage-log": "Usage Log",
    "/analytics": "Analytics",
    "/notifications": "Notifications",
    "/profile": "Profile",
    "/settings": "Settings"
  };

  const pageTitle = titles[location.pathname] || "Dashboard";

  // 🔐 Logout (temporary safe version)
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">

      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
        {pageTitle}
      </h2>

      <div className="flex items-center gap-4 relative">

        {/* Notifications */}
        <button
          onClick={() => navigate("/notifications")}
          className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:scale-105 transition"
        >
          <FaBell size={18} className="text-gray-700 dark:text-gray-200" />

          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Profile */}
        <div className="relative z-50">
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:scale-105 transition"
          >
            <User size={18} className="text-gray-700 dark:text-gray-200" />
          </button>

          {openMenu && (
            <div className="absolute right-0 mt-3 w-44 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-xl">

              <button
                onClick={() => {
                  navigate(user?.role === "admin" ? "/admin/profile" : "/profile")
                  setOpenMenu(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <User size={16} />
                Profile
              </button>

              <button
                onClick={() => {
                  navigate(user?.role === "admin" ? "/admin/settings" : "/settings")
                  setOpenMenu(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Settings size={16} />
                Settings
              </button>

              <button
                onClick={() => {
                  handleLogout();
                  setOpenMenu(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-3 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Logout
              </button>

            </div>
          )}
        </div>

        {/* Theme */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:scale-105 transition"
        >
          {darkMode
            ? <Sun size={18} className="text-yellow-400" />
            : <Moon size={18} className="text-gray-700" />
          }
        </button>

      </div>
    </div>
  );
}

export default Navbar;