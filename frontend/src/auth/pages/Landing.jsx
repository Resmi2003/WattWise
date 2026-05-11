import React from "react";
import { Link } from "react-router-dom";
import { Zap, BarChart2, Bell, Activity, Gauge, Shield } from "lucide-react";

// Add a background image relating to energy/smart home (optional)
const backgroundImageUrl = "https://images.unsplash.com/photo-1558442074-3c19857bc1dc?q=80&w=2862&auto=format&fit=crop"; // Consider dynamic import

function Landing() {
  return (
    <div
      className="min-h-screen bg-gray-50 text-gray-800 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      {/* navbar */}
      <div className="flex justify-between items-center px-10 py-5 bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <h1 className="text-3xl font-bold text-blue-700">WattWise</h1>

        <div className="flex items-center gap-6">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-700 hover:text-blue-700 transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-5 py-2.5 bg-blue-700 text-white rounded-xl text-sm font-semibold hover:bg-blue-800 transition"
          >
            Register
          </Link>
        </div>
      </div>

      {/* hero */}
      <section className="text-center px-6 pt-24 pb-16 max-w-5xl mx-auto bg-white/80 backdrop-blur-lg rounded-3xl mt-12 shadow-xl border border-gray-100">
        <h2 className="text-6xl font-extrabold mb-6 leading-tight text-gray-900">
          Smart Energy Tracking for <span className="text-blue-700">Modern Homes</span>
        </h2>

        <p className="text-gray-700 text-xl mb-6 max-w-3xl mx-auto leading-relaxed">
          Effortlessly monitor appliance usage, analyze energy consumption patterns, and gain actionable insights to optimize your electricity usage — all through an intuitive, intelligent dashboard.
        </p>

        <p className="text-blue-700 font-semibold mb-10 text-lg">
          No hardware required. Just smarter energy insights.
        </p>

        <Link
          to="/register"
          className="px-10 py-4 bg-blue-700 text-white rounded-xl font-bold text-lg hover:bg-blue-800 transition"
        >
          Get Started For Free
        </Link>
      </section>

      {/* features */}
      <section className="px-10 py-20 bg-white mt-16 rounded-3xl shadow-sm">
        <h3 className="text-4xl font-bold text-center mb-14 text-gray-950">
          Unlock Powerful Core Features
        </h3>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          <div className="p-8 rounded-2xl border border-gray-100 bg-white hover:border-blue-100 hover:bg-blue-50/50 transition">
            <Zap className="text-blue-600 mb-4 h-10 w-10 p-2.5 bg-blue-100 rounded-lg" />
            <h4 className="font-bold text-xl text-gray-950">Real-time Appliance Tracking</h4>
            <p className="text-base text-gray-700 mt-2.5 leading-relaxed">
              Instantly track the energy consumption of every registered appliance in real time.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-gray-100 bg-white hover:border-green-100 hover:bg-green-50/50 transition">
            <BarChart2 className="text-green-600 mb-4 h-10 w-10 p-2.5 bg-green-100 rounded-lg" />
            <h4 className="font-bold text-xl text-gray-950">In-depth Consumption Analytics</h4>
            <p className="text-base text-gray-700 mt-2.5 leading-relaxed">
              Visualize and understand your past consumption patterns with clear, insightful analytics.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-gray-100 bg-white hover:border-red-100 hover:bg-red-50/50 transition">
            <Bell className="text-red-600 mb-4 h-10 w-10 p-2.5 bg-red-100 rounded-lg" />
            <h4 className="font-bold text-xl text-gray-950">Proactive Smart Alerts</h4>
            <p className="text-base text-gray-700 mt-2.5 leading-relaxed">
              Receive notifications when consumption spikes or surpasses your set usage limits.
            </p>
          </div>

        </div>
      </section>

      {/* How it works */}
      <section className="px-10 py-20 bg-blue-50 mt-16 rounded-3xl shadow-inner">
        <h3 className="text-4xl font-bold text-center mb-14 text-gray-950">
          How <span className="text-blue-700">WattWise</span> Works in 3 Simple Steps
        </h3>

        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto text-center">

          <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
            <Activity className="mx-auto text-blue-700 mb-4 h-12 w-12 p-3 bg-blue-100 rounded-full" />
            <h4 className="font-bold text-xl text-gray-950">1. Register Appliances</h4>
            <p className="text-base text-gray-700 mt-2.5 leading-relaxed">
              Easily add your home appliances and their specifications to the WattWise system.
            </p>
          </div>

          <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
            <Gauge className="mx-auto text-green-700 mb-4 h-12 w-12 p-3 bg-green-100 rounded-full" />
            <h4 className="font-bold text-xl text-gray-950">2. Track & Monitor</h4>
            <p className="text-base text-gray-700 mt-2.5 leading-relaxed">
              WattWise calculates and displays real-time energy consumption for each active device.
            </p>
          </div>

          <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
            <Shield className="mx-auto text-yellow-700 mb-4 h-12 w-12 p-3 bg-yellow-100 rounded-full" />
            <h4 className="font-bold text-xl text-gray-950">3. Optimize & Save</h4>
            <p className="text-base text-gray-700 mt-2.5 leading-relaxed">
              Receive smart recommendations and insights to intelligently optimize and reduce usage.
            </p>
          </div>

        </div>
      </section>

      {/* Footer (simple) */}
      <footer className="py-8 px-10 text-center text-sm text-gray-600 bg-gray-100 mt-16 rounded-t-3xl border-t border-gray-200">
        <p>&copy; {new Date().getFullYear()} WattWise Inc. All energy smartened.</p>
      </footer>

    </div>
  );
}

export default Landing;