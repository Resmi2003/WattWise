import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import {
  Home,
  Zap,
  BarChart2,
  Bell,
  User,
  Settings
} from "lucide-react";

function Sidebar() {

  const { user } = useAppContext();
  console.log("USER DATA:", user);
  
  const location = useLocation();

  const userMenu = [
    { name: "Dashboard", path: "/dashboard", icon: <Home size={18} /> },
    { name: "Appliances", path: "/appliances", icon: <Zap size={18} /> },
    { name: "Usage Log", path: "/usage-log", icon: <BarChart2 size={18} /> },
    { name: "Analytics", path: "/analytics", icon: <BarChart2 size={18} /> },
    { name: "Notifications", path: "/notifications", icon: <Bell size={18} /> },
    { name: "Profile", path: "/profile", icon: <User size={18} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={18} /> },
  ];

  const adminMenu = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <Home size={18} /> },
    { name: "Users", path: "/admin/users", icon: <User size={18} /> },
    { name: "Appliances", path: "/admin/appliances", icon: <Zap size={18} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={18} /> },
  ];

  const menu = user?.role === "admin" ? adminMenu : userMenu;

  return (
    <div className="w-64 min-h-screen flex flex-col
bg-gradient-to-b from-white to-gray-100
dark:from-gray-900 dark:to-gray-800
border-r border-gray-200 dark:border-gray-700">

      <div className="p-6 text-2xl font-bold text-blue-600 dark:text-blue-400">
        WattWise
      </div>

      {/* Menu */}
      <nav className="px-4 space-y-2 flex-1">
        {menu.map((item) => {
          const active = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
            ${active
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:translate-x-1"
                }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 text-xs text-gray-400 dark:text-gray-500">
        Smart Energy Tracker
      </div>

    </div>

  );
}

export default Sidebar;