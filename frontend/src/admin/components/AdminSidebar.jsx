import React from "react";
import { Link } from "react-router-dom";

function AdminSidebar() {
  return (
    <div className="h-full w-64 bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

      <ul className="space-y-4">
        <li>
          <Link to="/admin/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/admin/users">Users</Link>
        </li>
        <li>
          <Link to="/admin/appliances">Appliances</Link>
        </li>
      </ul>
    </div>
  );
}

export default AdminSidebar;