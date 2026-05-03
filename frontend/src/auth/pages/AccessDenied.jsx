import React from "react";
import { Link } from "react-router-dom";

const AccessDenied = () => {
    return (

        <div className="fixed inset-0 z-50 flex flex-col justify-center items-center text-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">

            <img
                src="https://cdn-icons-png.flaticon.com/512/564/564619.png"
                alt="locked"
                className="w-24 mb-4 opacity-80"
            />

            <h1 className="text-2xl font-bold mb-2">Admin Only</h1>

            <p className="mb-4 text-gray-500">
                You are not allowed to access this page.
            </p>

            <Link
                to="/login"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
                Go to Login
            </Link>

        </div>
    );
};

export default AccessDenied;