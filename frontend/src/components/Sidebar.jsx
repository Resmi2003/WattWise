import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import {
  Home,
  Zap,
  BarChart2,
  Bell,
  User,
  Settings,
  Activity,
  FileText
} from "lucide-react";

function Sidebar() {
  const { user } = useAppContext();
  const location = useLocation();

  const userMenu = [
    { name: "Dashboard", path: "/dashboard", icon: <Home size={19} strokeWidth={2} /> },
    { name: "Appliances", path: "/appliances", icon: <Zap size={19} strokeWidth={2} /> },
    { name: "Usage Log", path: "/usage-log", icon: <FileText size={19} strokeWidth={2} /> },
    { name: "Analytics", path: "/analytics", icon: <BarChart2 size={19} strokeWidth={2} /> },
    { name: "Notifications", path: "/notifications", icon: <Bell size={19} strokeWidth={2} /> },
    { name: "Profile", path: "/profile", icon: <User size={19} strokeWidth={2} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={19} strokeWidth={2} /> },
  ];

  const adminMenu = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <Home size={19} strokeWidth={2} /> },
    { name: "User Management", path: "/admin/users", icon: <User size={19} strokeWidth={2} /> },
    { name: "Appliance Overview", path: "/admin/appliances", icon: <Zap size={19} strokeWidth={2} /> },
    { name: "Analytics", path: "/admin/analytics", icon: <BarChart2 size={19} strokeWidth={2} /> },
  ];

  const menu = user?.role === "admin" ? adminMenu : userMenu;

  return (
    <div className="w-64 min-h-screen flex flex-col
      bg-gray-100 dark:bg-gray-900
      border-r border-gray-300 dark:border-gray-800 backdrop-blur-md 
      shadow-sm">

      <div className="p-6 text-2xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">
        WattWise
      </div>

      <nav className="px-4 space-y-2 flex-1">
        {menu.map((item) => {
          const active = location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
            >
              <span className={active ? "text-white" : "text-gray-600 dark:text-gray-400"}>
                {item.icon}
              </span>

              <span className="font-semibold tracking-wide">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-5">
        <div className="p-4 rounded-xl 
            bg-blue-50 dark:bg-gray-800
            border border-blue-100 dark:border-gray-700">

          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Smart Energy Tracker
          </p>

          <p className="text-xs text-gray-600 dark:text-gray-500 mt-1">
            Monitoring Active
          </p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;