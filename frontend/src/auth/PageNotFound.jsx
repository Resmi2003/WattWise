import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

function PageNotFound() {

    return (

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-100 dark:from-[#0b1120] dark:via-[#111827] dark:to-[#0f172a] px-4">

            <div className="max-w-xl w-full bg-white/70 dark:bg-white/[0.04] backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[36px] shadow-2xl p-10 text-center">

                <div className="flex justify-center mb-6">

                    <div className="bg-red-100 dark:bg-red-900/20 p-5 rounded-full">
                        <AlertTriangle
                            size={60}
                            className="text-red-500"
                        />
                    </div>

                </div>

                <h1 className="text-7xl font-black text-red-500">
                    404
                </h1>

                <h2 className="mt-4 text-3xl font-black text-gray-900 dark:text-white">
                    Page Not Found
                </h2>

                <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                    The page you are looking for does not exist or may have been removed.
                </p>

                <Link
                    to="/"
                    className="inline-flex items-center gap-3 mt-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg transition-all duration-300 hover:scale-[1.03]"
                >

                    <Home size={22} />

                    Go Back Home

                </Link>

            </div>

        </div>
    );
}

export default PageNotFound;