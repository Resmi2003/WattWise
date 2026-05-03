import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../user/components/Sidebar";
import Navbar from "../user/components/Navbar";



function MainLayout() {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-screen w-64">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="ml-64 flex flex-col min-h-screen">

        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <div className="p-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 min-h-[calc(100vh-120px)] text-gray-800 dark:text-white">
            <Outlet />
          </div>
        </div>

      </div>

    </div>

  );
}

export default MainLayout;