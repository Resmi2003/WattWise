import React from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  BarChart2,
  Bell,
  FileText,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Cpu,
  Activity,
  BatteryCharging,
  IndianRupee,
  Crown,
} from "lucide-react";

function Landing() {


  const features = [
    {
      icon: <Zap />,
      title: "Appliance Management",
      description:
        "Add and organize appliances to monitor individual electricity consumption.",
    },

    {
      icon: <BarChart2 />,
      title: "Energy Analytics",
      description:
        "Visualize usage logs and identify which appliances consume the most power.",
    },

    {
      icon: <Bell />,
      title: "Usage Alerts",
      description:
        "Get notified when daily energy usage crosses your preferred limits.",
    },

    {
      icon: <TrendingUp />,
      title: "Efficiency Insights",
      description:
        "Track consumption trends and improve energy efficiency over time.",
    },

    {
      icon: <FileText />,
      title: "PDF Energy Reports",
      description:
        "Generate downloadable reports containing appliance usage and bill estimates.",
    },

    {
      icon: <Crown />,
      title: "Premium Dashboard",
      description:
        "Access additional monitoring and reporting features.",
    },
  ];

  return (

    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">


      <header className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b border-gray-100">

        <div className="flex justify-between items-center px-6 md:px-12 py-4 max-w-7xl mx-auto">

          <div className="flex items-center gap-2">
            <Zap className="text-green-600" />

            <h1 className="text-2xl font-bold text-green-600">
              WattWise
            </h1>
          </div>

          <nav className="flex items-center gap-4 text-sm">

            <Link
              to="/login"
              className="px-5 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-5 py-2 rounded-xl border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition"
            >
              Register
            </Link>

          </nav>

        </div>

      </header>


      <section className="relative">

        <div className="absolute inset-0 bg-gradient-to-b from-green-50 via-white to-white"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 grid md:grid-cols-2 gap-14 items-center relative">


          <div>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm mb-6">
              <Sparkles size={16} /> Smart Energy Monitoring Platform
            </div>

            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Understand your
              <span className="text-green-600"> electricity usage</span>
            </h2>

            <p className="mt-6 text-gray-600 text-lg leading-relaxed">
              WattWise helps users manage appliances, monitor energy usage,
              analyze consumption trends, and estimate electricity costs
              through a centralized smart dashboard.
            </p>

            <div className="flex justify-center md:justify-start mt-8">

              <Link
                to="/register"
                className="px-6 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition"
              >
                Get Started
              </Link>

            </div>

          </div>


          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">

            <div className="flex items-center gap-3 mb-6">
              <Cpu className="text-green-600" />

              <h4 className="font-semibold">
                WattWise Intelligence Core
              </h4>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              The platform analyzes appliance usage data to generate analytics, alerts, and electricity usage insights.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">

              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
                <Activity className="text-green-600" size={18} />
                Usage logs
              </div>

              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl">
                <BarChart2 className="text-blue-600" size={18} />
                Analytics
              </div>

              <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-xl">
                <Bell className="text-yellow-600" size={18} />
                Smart alerts
              </div>

              <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-xl">
                <FileText className="text-purple-600" size={18} />
                PDF reports
              </div>

            </div>

          </div>

        </div>

      </section>


      <section className="py-16 border-y bg-white">

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">

          <div>
            <BatteryCharging className="mx-auto text-green-600" />

            <p className="text-3xl font-bold text-green-600 mt-2">
              Appliance Tracking
            </p>

            <p className="text-gray-600 mt-1">
              Monitor electricity usage for each appliance.
            </p>
          </div>

          <div>
            <IndianRupee className="mx-auto text-green-600" />

            <p className="text-3xl font-bold text-green-600 mt-2">
              Bill Estimation
            </p>

            <p className="text-gray-600 mt-1">
              Estimate electricity costs from usage data.
            </p>
          </div>

          <div>
            <ShieldCheck className="mx-auto text-green-600" />

            <p className="text-3xl font-bold text-green-600 mt-2">
              Secure Access
            </p>

            <p className="text-gray-600 mt-1">
              Role-based access for users and administrators.
            </p>
          </div>

        </div>

      </section>


      <section className="py-24 bg-gray-50">

        <div className="max-w-6xl mx-auto px-6 text-center mb-14">

          <h3 className="text-3xl font-bold">
            Everything you need in one platform
          </h3>

          <p className="text-gray-600 mt-3">
            Built for monitoring appliance activity, tracking electricity
            consumption, and generating smart energy insights.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">

          {features.map((feature, index) => (

            <div
              key={index}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition"
            >

              <div className="text-green-600 mb-3">
                {feature.icon}
              </div>

              <h4 className="font-semibold">
                {feature.title}
              </h4>

              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                {feature.description}
              </p>

            </div>

          ))}

        </div>

      </section>


      <footer className="py-10 text-center text-sm bg-green-600 text-white">
        © 2026 WattWise. Smart Energy Monitoring System.
      </footer>

    </div>
  );
}

export default Landing;