import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { Moon, Sun, User, Settings, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBell } from "react-icons/fa";

function Navbar() {

  const { user, darkMode, setDarkMode, unreadCount, fetchUnreadCount } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(false);

  // const fetchUnread = async () => {
  //   const token = sessionStorage.getItem("token");

  //   try {
  //     const res = await axios.get(
  //       "http://localhost:5000/api/notifications",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       }
  //     );

  //     const count = res.data.filter(n => !n.isRead).length;
  //     setUnread(count);

  //   } catch (err) {
  //     console.log(err);
  //   }
  // };



  useEffect(() => {
    fetchUnreadCount();

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 3000);

    return () => clearInterval(interval);
  }, []);




  const isAdmin = user?.role === "admin";

  // Dynamic Page Title
  const getPageTitle = () => {
    const path = location.pathname;

    // ADMIN ROUTES
    if (path.startsWith("/admin")) {
      if (path.includes("dashboard")) return "Dashboard";
      if (path.includes("users")) return "User Management";
      if (path.includes("appliances")) return "Appliance Overview";
      if (path.includes("analytics")) return "Analytics";
      if (path.includes("settings")) return "Settings";
      if (path.includes("profile")) return "Profile";
      return "Admin Panel";
    }

    // USER ROUTES
    if (path === "/dashboard") return "Dashboard";
    if (path === "/appliances") return "Appliances";
    if (path === "/usage-log") return "Usage Log";
    if (path === "/analytics") return "Analytics";
    if (path === "/notifications") return "Notifications";
    if (path === "/profile") return "Profile";
    if (path === "/settings") return "Settings";

    return "WattWise";
  };

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">

      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
        {getPageTitle()}
      </h2>

      <div className="flex items-center gap-4 relative">

        {/* Notifications (ONLY USER) */}
        {!isAdmin && (
          <button
            onClick={() => {
              navigate("/notifications");
            }}
            className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:scale-105 transition"
          >
            <FaBell size={18} className="text-gray-700 dark:text-gray-200" />

            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        )}

        {/* Profile (ONLY USER) */}
        {!isAdmin && (
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
                    navigate("/profile");
                    setOpenMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <User size={16} />
                  Profile
                </button>

                <button
                  onClick={() => {
                    navigate("/settings");
                    setOpenMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Settings size={16} />
                  Settings
                </button>

                {/* USER LOGOUT WITH ICON */}
                <button
                  onClick={() => {
                    handleLogout();
                    setOpenMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-3 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <LogOut size={16} />
                  Logout
                </button>

              </div>
            )}
          </div>
        )}

        {/* ADMIN LOGOUT WITH ICON */}
        {isAdmin && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm hover:scale-105 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        )}

        {/* Theme Toggle */}
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