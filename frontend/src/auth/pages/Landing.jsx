import React from "react";
import { Link } from "react-router-dom";
import { Zap, BarChart2, Bell, Activity, Gauge, Shield } from "lucide-react";

function Landing() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

      {/* navbar */}
      <div className="flex justify-between items-center px-10 py-5 bg-white shadow-sm sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-blue-600">WattWise</h1>

        <div className="flex items-center gap-6">
          <Link
            to="/login"
            className="text-sm text-gray-600 hover:text-blue-600"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            Register
          </Link>
        </div>
      </div>

      {/* hero */}
      <section className="text-center px-6 pt-20 pb-14 max-w-5xl mx-auto">
        <h2 className="text-5xl font-bold mb-5 leading-tight">
          Smart Energy Tracking for Modern Homes
        </h2>

        <p className="text-gray-600 text-lg mb-5 max-w-3xl mx-auto">
          Monitor appliance usage, analyze energy patterns, and optimize electricity consumption — all in one intelligent dashboard.
        </p>

        <p className="text-blue-600 font-medium mb-8">
          No hardware required. Just smarter energy insights.
        </p>

        <Link
          to="/register"
          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
        >
          Get Started
        </Link>
      </section>

      {/* features */}
      <section className="px-10 py-14 bg-white">
        <h3 className="text-3xl font-bold text-center mb-10">
          Core Features
        </h3>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

          <div className="p-6 rounded-xl border bg-gray-50">
            <Zap className="text-blue-500 mb-3" />
            <h4 className="font-semibold text-lg">Appliance Tracking</h4>
            <p className="text-sm text-gray-600 mt-2">
              Track energy usage of all appliances in real time.
            </p>
          </div>

          <div className="p-6 rounded-xl border bg-gray-50">
            <BarChart2 className="text-green-500 mb-3" />
            <h4 className="font-semibold text-lg">Analytics</h4>
            <p className="text-sm text-gray-600 mt-2">
              Understand consumption patterns with visual insights.
            </p>
          </div>

          <div className="p-6 rounded-xl border bg-gray-50">
            <Bell className="text-red-500 mb-3" />
            <h4 className="font-semibold text-lg">Smart Alerts</h4>
            <p className="text-sm text-gray-600 mt-2">
              Get notified when energy usage is high.
            </p>
          </div>

        </div>
      </section>

      {/* How it works */}
      <section className="px-10 py-16 bg-blue-50">
        <h3 className="text-3xl font-bold text-center mb-10">
          How It Works
        </h3>

        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto text-center">

          <div>
            <Activity className="mx-auto text-blue-600 mb-3" />
            <h4 className="font-semibold">Add Appliances</h4>
            <p className="text-sm text-gray-600 mt-2">
              Register your devices in the system.
            </p>
          </div>

          <div>
            <Gauge className="mx-auto text-green-600 mb-3" />
            <h4 className="font-semibold">Track Usage</h4>
            <p className="text-sm text-gray-600 mt-2">
              Monitor real-time energy consumption.
            </p>
          </div>

          <div>
            <Shield className="mx-auto text-yellow-600 mb-3" />
            <h4 className="font-semibold">Optimize</h4>
            <p className="text-sm text-gray-600 mt-2">
              Reduce electricity usage intelligently.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}

export default Landing;