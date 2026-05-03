import React, { useMemo, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Zap, BarChart2, BatteryCharging, IndianRupee } from "lucide-react";
import EnergyChart from "../components/EnergyChart";

function Dashboard() {

  const { appliances, usageLogs } = useAppContext();

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
      .filter(log => log.date?.split("T")[0] === today)
      .reduce((sum, log) => sum + Number(log.energy), 0);
  }, [usageLogs, today]);

  const recentLogs = useMemo(() => {
    return [...usageLogs].reverse().slice(0, 4);
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

    return usageLogs.filter(log => {
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

  // ================= INSIGHTS =================

  const getSmartTip = () => {
    if (todayEnergy > 5)
      return "Reduce usage of high-power appliances like AC and heaters.";
    if (todayEnergy < 2)
      return "Great job! Maintain this low energy usage.";
    return "Turn off unused appliances to save more energy.";
  };

  const getTopAppliance = () => {
    const map = {};
    usageLogs.forEach(log => {
      if (!map[log.applianceName]) map[log.applianceName] = 0;
      map[log.applianceName] += Number(log.energy);
    });

    let top = null, max = 0;
    for (let key in map) {
      if (map[key] > max) {
        max = map[key];
        top = key;
      }
    }
    return top;
  };

  // console.log("usageLogs:", usageLogs);


  return (
    <div className="space-y-8">

      {/* ALERT */}
      {isHighUsage && (
        <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-700/50 text-red-600 dark:text-red-300 p-3 rounded-lg">
          <BatteryCharging size={18} />
          <span className="text-sm font-medium">
            High energy usage detected today
          </span>
        </div>
      )}

      {/* CARDS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">

        {[
          { label: "Appliances", value: appliances.length, icon: <Zap className="text-blue-600" /> },
          { label: "Usage Logs", value: usageLogs.length, icon: <BarChart2 className="text-green-600" /> },
          { label: "Energy Used", value: `${totalEnergy.toFixed(2)} kWh`, icon: <BatteryCharging className="text-yellow-600" /> },
          { label: "Estimated Bill", value: `₹${estimatedBill.toFixed(2)}`, icon: <IndianRupee className="text-purple-600" /> },
          { label: "Today Usage", value: `${todayEnergy.toFixed(2)} kWh`, icon: <Zap className="text-orange-600" /> }
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-xl p-6 shadow-sm hover:shadow-md transition flex items-center gap-4">
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              {item.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{item.value}</h3>
            </div>
          </div>
        ))}

      </div>

      {/* BADGE */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-xl p-4 flex justify-between">
        <div>
          <p className="text-sm text-gray-500">Energy Badge</p>
          <h3 className="text-lg font-semibold">{getBadge()}</h3>
        </div>
        <Zap className="text-green-600" />
      </div>

      {/* FILTER */}
      <div className="flex gap-3">
        {["daily", "weekly", "monthly"].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg transition ${filter === type
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white"
              }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* CHART */}
      <EnergyChart data={filteredLogs} />

      {/* EXTRA INSIGHTS */}
      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Highest Usage Appliance</p>
          <h3 className="text-lg font-semibold">{getTopAppliance() || "N/A"}</h3>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Average Consumption</p>
          <h3 className="text-lg font-semibold">
            {avgEnergyPerLog.toFixed(2)} kWh
          </h3>
        </div>

      </div>

      {/* RECENT LOGS (NEW FEATURE 🔥) */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-xl p-6">
        <h2 className="font-semibold mb-4">Recent Usage</h2>

        {recentLogs.length === 0 ? (
          <p className="text-gray-500">No recent logs</p>
        ) : (
          <div className="space-y-2">
            {recentLogs.map((log, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{log.applianceName}</span>
                <span>{log.energy} kWh</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TIP */}
      <div className="bg-blue-50 dark:bg-blue-900 border border-blue-100 dark:border-blue-800 rounded-xl p-6">
        <h2 className="font-semibold mb-2">Energy Saving Tip</h2>
        <p className="text-sm">{getSmartTip()}</p>
      </div>

    </div>
  );
}

export default Dashboard;