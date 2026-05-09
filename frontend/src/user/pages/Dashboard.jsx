import React, { useMemo, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import {
  Zap,
  BarChart3,
  BatteryCharging,
  IndianRupee,
  TrendingUp,
  Activity,
  Flame,
  Lightbulb,
  CalendarDays,
} from "lucide-react";

import EnergyChart from "../components/EnergyChart";

function Dashboard() {

  // ================= CONTEXT =================

  const { appliances, usageLogs } = useAppContext();

  // ================= DATE =================

  const today = new Date().toISOString().split("T")[0];

  // ================= BASIC METRICS =================

  const totalEnergy = useMemo(() => {
    return usageLogs.reduce((sum, log) => sum + Number(log.energy), 0);
  }, [usageLogs]);

  const electricityRate = 6;

  const estimatedBill = useMemo(() => {
    return totalEnergy * electricityRate;
  }, [totalEnergy]);

  const todayEnergy = useMemo(() => {
    return usageLogs
      .filter((log) => log.date?.split("T")[0] === today)
      .reduce((sum, log) => sum + Number(log.energy), 0);
  }, [usageLogs, today]);

  const recentLogs = useMemo(() => {
    return [...usageLogs].reverse().slice(0, 5);
  }, [usageLogs]);

  const avgEnergyPerLog = useMemo(() => {
    return usageLogs.length ? totalEnergy / usageLogs.length : 0;
  }, [usageLogs, totalEnergy]);

  // ================= BADGE & ALERT =================

  const DAILY_LIMIT = 5;

  const isHighUsage = todayEnergy > DAILY_LIMIT;

  const getBadge = () => {
    if (todayEnergy < 2) return "Energy Saver";
    if (todayEnergy < 5) return "Efficient User";
    return "High Consumer";
  };

  // ================= FILTER =================

  const [filter, setFilter] = useState("daily");

  const getFilteredLogs = () => {

    const now = new Date();

    return usageLogs.filter((log) => {

      if (!log.date) return false;

      const logDate = new Date(log.date);

      if (filter === "daily") {
        return log.date?.split("T")[0] === today;
      }

      if (filter === "weekly") {

        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);

        return logDate >= weekAgo && logDate <= now;
      }

      if (filter === "monthly") {

        return (
          logDate.getMonth() === now.getMonth() &&
          logDate.getFullYear() === now.getFullYear()
        );
      }

      return true;
    });
  };

  const filteredLogs = getFilteredLogs();

  // ================= SMART TIP =================

  const getSmartTip = () => {

    if (todayEnergy > 5) {
      return "Reduce usage of high-power appliances like AC and heaters during peak hours.";
    }

    if (todayEnergy < 2) {
      return "Excellent energy efficiency today. Keep maintaining this habit.";
    }

    return "Switch off unused appliances and use energy-efficient devices to save more electricity.";
  };

  // ================= TOP APPLIANCE =================

  const getTopAppliance = () => {

    const map = {};

    usageLogs.forEach((log) => {

      if (!map[log.applianceName]) {
        map[log.applianceName] = 0;
      }

      map[log.applianceName] += Number(log.energy);
    });

    let top = null;
    let max = 0;

    for (let key in map) {

      if (map[key] > max) {
        max = map[key];
        top = key;
      }
    }

    return top;
  };

  // ================= STATS =================

  const stats = [
    {
      title: "Total Appliances",
      value: appliances.length,
      icon: <Zap size={24} />,
      color: "from-cyan-500 to-blue-600",
    },

    {
      title: "Usage Logs",
      value: usageLogs.length,
      icon: <BarChart3 size={24} />,
      color: "from-emerald-500 to-green-600",
    },

    {
      title: "Energy Used",
      value: `${totalEnergy.toFixed(2)} kWh`,
      icon: <BatteryCharging size={24} />,
      color: "from-orange-500 to-amber-600",
    },

    {
      title: "Estimated Bill",
      value: `₹${estimatedBill.toFixed(2)}`,
      icon: <IndianRupee size={24} />,
      color: "from-violet-500 to-purple-600",
    },
  ];

  return (

    <div className="min-h-screen space-y-8 text-gray-900 dark:text-white bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-[#0b1120] dark:via-[#0f172a] dark:to-[#111827] p-2 rounded-3xl">

      {/* ================= HERO ================= */}

      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-white via-sky-50 to-cyan-100 dark:from-[#111827] dark:via-[#172554] dark:to-[#0f172a] p-6 md:p-8 border border-white/40 dark:border-white/10 shadow-xl backdrop-blur-xl">

        {/* Glow */}

        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-400/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400/10 blur-3xl rounded-full"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

          <div>

            <p className="text-cyan-600 dark:text-cyan-300 text-sm font-semibold tracking-wide mb-3">
              SMART ENERGY MONITORING DASHBOARD
            </p>

            <h1 className="text-3xl md:text-5xl font-black leading-[1.1] text-gray-900 dark:text-white">
              Track & Optimize
              <br />
              Your Energy Usage
            </h1>

            <p className="mt-3 max-w-xl text-gray-600 dark:text-gray-300 text-sm md:text-[15px] leading-relaxed">
              Monitor appliance energy consumption, analyze usage trends,
              reduce electricity costs, and improve energy efficiency with
              powerful real-time analytics.
            </p>

          </div>

          {/* TODAY STATUS */}

          <div className="bg-white/70 dark:bg-white/[0.05] backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[28px] p-6 min-w-[280px] shadow-lg">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Today's Consumption
                </p>

                <h2 className="text-5xl font-black text-gray-900 dark:text-white mt-3">
                  {todayEnergy.toFixed(2)}
                </h2>

                <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                  kWh
                </span>

              </div>

              <div className="bg-cyan-100 dark:bg-cyan-900/30 p-4 rounded-2xl shadow-inner">
                <Activity
                  size={30}
                  className="text-cyan-600 dark:text-cyan-300"
                />
              </div>

            </div>

            <div className="mt-8 flex items-center justify-between">

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Daily Status
              </p>

              <div
                className={`px-4 py-1.5 rounded-full text-xs font-bold ${isHighUsage
                  ? "bg-red-500 text-white"
                  : "bg-emerald-500 text-white"
                  }`}
              >
                {isHighUsage ? "High Usage" : "Efficient"}
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================= ALERT ================= */}

      {isHighUsage && (

        <div className="flex items-center gap-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl p-5 shadow-sm">

          <div className="bg-red-100 dark:bg-red-900 p-3 rounded-2xl">
            <Flame className="text-red-600 dark:text-red-300" />
          </div>

          <div>

            <h3 className="font-bold text-red-700 dark:text-red-300">
              High Energy Consumption Detected
            </h3>

            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              Your electricity usage today is higher than the recommended daily limit.
            </p>

          </div>

        </div>

      )}

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {stats.map((item, index) => (

          <div
            key={index}
            className="relative overflow-hidden rounded-[28px] bg-white/70 dark:bg-white/[0.04] backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >

            <div
              className={`absolute inset-0 opacity-10 bg-gradient-to-br ${item.color}`}
            ></div>

            <div className="relative p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {item.title}
                  </p>

                  <h2 className="mt-4 text-3xl font-black text-gray-900 dark:text-white">
                    {item.value}
                  </h2>

                </div>

                <div
                  className={`bg-gradient-to-br ${item.color} p-4 rounded-2xl text-white shadow-lg`}
                >
                  {item.icon}
                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* ================= ANALYTICS ================= */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* CHART */}

        <div className="xl:col-span-2 bg-white/70 dark:bg-white/[0.04] backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[32px] p-6 shadow-xl">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

            <div>

              <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                Energy Analytics
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Appliance-wise energy usage overview
              </p>

            </div>

            {/* FILTERS */}

            <div className="flex gap-3 flex-wrap">

              {["daily", "weekly", "monthly"].map((type) => (

                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-5 py-2 rounded-2xl text-sm font-semibold transition-all duration-300 ${filter === type
                    ? "bg-cyan-500 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:scale-105"
                    }`}
                >
                  {type}
                </button>

              ))}

            </div>

          </div>

          <EnergyChart data={filteredLogs} />

        </div>

        {/* RIGHT PANEL */}

        <div className="space-y-6">

          {/* BADGE */}

          <div className="bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 rounded-[30px] p-6 text-white shadow-xl">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-emerald-100">
                  Energy Efficiency Badge
                </p>

                <h2 className="text-3xl font-black mt-2">
                  {getBadge()}
                </h2>

              </div>

              <TrendingUp size={42} />

            </div>

          </div>

          {/* TOP APPLIANCE */}

          <div className="bg-white/70 dark:bg-white/[0.04] backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[30px] p-6 shadow-lg">

            <div className="flex items-center gap-3 mb-5">

              <div className="bg-orange-100 dark:bg-orange-900/40 p-3 rounded-2xl">
                <Zap className="text-orange-500" />
              </div>

              <div>

                <h3 className="font-bold text-gray-900 dark:text-white">
                  Highest Usage Appliance
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Most power-consuming appliance
                </p>

              </div>

            </div>

            <h2 className="text-3xl font-black text-orange-500">
              {getTopAppliance() || "N/A"}
            </h2>

          </div>

          {/* AVG */}

          <div className="bg-white/70 dark:bg-white/[0.04] backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[30px] p-6 shadow-lg">

            <div className="flex items-center gap-3 mb-5">

              <div className="bg-cyan-100 dark:bg-cyan-900/40 p-3 rounded-2xl">
                <BatteryCharging className="text-cyan-500" />
              </div>

              <div>

                <h3 className="font-bold text-gray-900 dark:text-white">
                  Average Consumption
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Average usage per log
                </p>

              </div>

            </div>

            <h2 className="text-3xl font-black text-cyan-500">
              {avgEnergyPerLog.toFixed(2)} kWh
            </h2>

          </div>

        </div>

      </div>

      {/* ================= BOTTOM SECTION ================= */}

      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">

        {/* RECENT ACTIVITY */}

        <div className="bg-white/70 dark:bg-white/[0.04] backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[32px] p-6 shadow-xl">

          <div className="flex items-center gap-3 mb-6">

            <div className="bg-cyan-100 dark:bg-cyan-900/40 p-3 rounded-2xl">
              <CalendarDays className="text-cyan-500" />
            </div>

            <div>

              <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                Recent Activity
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Latest appliance energy logs
              </p>

            </div>

          </div>

          {recentLogs.length === 0 ? (

            <div className="text-center py-10">

              <p className="text-gray-500 dark:text-gray-400">
                No recent usage data available
              </p>

            </div>

          ) : (

            <div className="space-y-4">

              {recentLogs.map((log, i) => (

                <div
                  key={i}
                  className="flex items-center justify-between bg-white/60 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 hover:scale-[1.01] transition-all"
                >

                  <div>

                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {log.applianceName}
                    </h3>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {log.date?.split("T")[0]}
                    </p>

                  </div>

                  <div className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-300 px-4 py-2 rounded-xl font-bold text-sm">
                    {log.energy} kWh
                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* RIGHT SIDE */}

        <div className="space-y-6">

          {/* SMART ENERGY TIP */}

          <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-[#1e293b] dark:via-[#172033] dark:to-[#0f172a] border border-orange-100 dark:border-yellow-500/10 rounded-[32px] p-7 shadow-lg">

            <div className="bg-orange-100 dark:bg-yellow-900/20 w-fit p-4 rounded-2xl mb-5 shadow-sm">
              <Lightbulb className="text-yellow-500" size={32} />
            </div>

            <h2 className="text-3xl font-black text-orange-500 dark:text-yellow-300 mb-4">
              Smart Energy Tip
            </h2>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
              {getSmartTip()}
            </p>

          </div>

          {/* QUICK INSIGHTS */}

          <div className="bg-white/70 dark:bg-white/[0.04] backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[32px] p-6 shadow-xl">

            <div className="flex items-center gap-3 mb-6">

              <div className="bg-cyan-100 dark:bg-cyan-900/40 p-3 rounded-2xl">
                <TrendingUp className="text-cyan-500" />
              </div>

              <div>

                <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                  Quick Insights
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Real-time energy summary
                </p>

              </div>

            </div>

            <div className="space-y-5">

              <div className="flex items-center justify-between">

                <span className="text-gray-600 dark:text-gray-300">
                  Total Appliances
                </span>

                <span className="font-black text-cyan-500 text-lg">
                  {appliances.length}
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-gray-600 dark:text-gray-300">
                  Today's Usage
                </span>

                <span className="font-black text-orange-500 text-lg">
                  {todayEnergy.toFixed(2)} kWh
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-gray-600 dark:text-gray-300">
                  Estimated Bill
                </span>

                <span className="font-black text-violet-500 text-lg">
                  ₹{estimatedBill.toFixed(2)}
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-gray-600 dark:text-gray-300">
                  Efficiency
                </span>

                <span
                  className={`font-black text-lg ${isHighUsage
                    ? "text-red-500"
                    : "text-emerald-500"
                    }`}
                >
                  {isHighUsage ? "High Usage" : "Efficient"}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;