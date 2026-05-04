import React from "react";
import { Link, useLocation } from "react-router-dom";

function AdminSidebar() {

  const location = useLocation();

  const linkClass = (path) =>
    `block px-3 py-2 rounded ${location.pathname === path
      ? "bg-gray-700"
      : "hover:bg-gray-800"
    }`;

  return (
    <div className="h-full w-64 bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

      <ul className="space-y-2">

        <li>
          <Link to="/admin/dashboard" className={linkClass("/admin/dashboard")}>
            Dashboard
          </Link>
        </li>

        <li>
          <Link to="/admin/users" className={linkClass("/admin/users")}>
            User Management
          </Link>
        </li>

        <li>
          <Link to="/admin/analytics" className={linkClass("/admin/analytics")}>
            Energy Insights
          </Link>
        </li>

      </ul>
    </div>
  );
}

export default AdminSidebar;