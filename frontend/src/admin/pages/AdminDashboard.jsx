import React, { useEffect, useState } from "react";
import { getAdminStatsAPI } from "../../services/allAPI";
import { server_url } from "../../services/server_url";
import axios from "axios";
import {
  Users,
  UserCheck,
  UserX,
  Zap,
  Activity,
  TrendingUp,
  Flame,
  Crown,
} from "lucide-react";

// Charts
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ArcElement
);

/* ================= COMPONENTS ================= */

const DashboardCard = ({ icon, title, value, color }) => (
  <div className={`p-6 rounded-2xl text-white shadow-lg bg-gradient-to-r ${color}`}>
    <div className="flex justify-between items-center">
      <div>{icon}</div>
      <span className="text-sm">{title}</span>
    </div>
    <h2 className="text-3xl font-bold mt-3">{value}</h2>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
    <span className="text-gray-600 dark:text-gray-300">{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);

/* 🔥 FIXED TREND CHART */
const TrendCard = ({ title, icon, data }) => {
  const labels = data
    ? Object.keys(data).map((label) => {
        if (label.length <= 3) return label;
        const d = new Date(label);
        return isNaN(d)
          ? label
          : d.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
            });
      })
    : [];

  const values = data ? Object.values(data) : [];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Energy (kWh)",
        data: values,
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.15)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 10,
    },
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: {
          color: "#9ca3af",
          autoSkip: false, // ✅ FIX: no skipping
        },
        grid: { display: false },
      },
      y: {
        ticks: {
          color: "#9ca3af",
          callback: (val) => val + " kWh",
        },
        grid: { color: "rgba(156,163,175,0.15)" },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border dark:border-gray-700 h-[320px] flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-indigo-500">{icon}</div>
        <h2 className="font-semibold">{title}</h2>
      </div>

      <div className="flex-1">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

/* 🔥 FIXED PIE CHART */
const PieChartCard = ({ data }) => {
  const labels = data ? Object.keys(data) : [];
  const values = data ? Object.values(data) : [];

  // ✅ UNIQUE COLORS (no repeats)
  const colors = [
    "#6366f1",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#3b82f6",
    "#a855f7",
    "#14b8a6",
    "#e11d48",
    "#84cc16",
    "#f97316",
  ];

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors.slice(0, labels.length),
        borderWidth: 0, // ✅ REMOVE GAP
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 20,
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#9ca3af",
          padding: 15,
          boxWidth: 14,
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border dark:border-gray-700 h-[320px] flex flex-col">
      <h2 className="font-semibold mb-4 text-gray-700 dark:text-gray-200">
        Appliance Distribution
      </h2>

      <div className="flex-1">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

/* ================= MAIN ================= */

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [trend, setTrend] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const statsRes = await getAdminStatsAPI();
      if (statsRes.status === 200) setStats(statsRes.data);

      const token = sessionStorage.getItem("token");

      const trendRes = await axios.get(
        `${server_url}/api/admin/energy-trend`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (trendRes.status === 200) setTrend(trendRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ KEEP YOUR LOADING (NOT REMOVED)
  if (!stats || !trend) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <DashboardCard icon={<Users />} title="Total Users" value={stats.totalUsers} color="from-blue-500 to-blue-600" />
        <DashboardCard icon={<UserCheck />} title="Active Users" value={stats.activeUsers} color="from-green-500 to-emerald-600" />
        <DashboardCard icon={<UserX />} title="Blocked Users" value={stats.blockedUsers} color="from-red-500 to-red-600" />
        <DashboardCard icon={<Zap />} title="Total Energy (kWh)" value={stats.totalEnergy} color="from-orange-500 to-orange-600" />
      </div>

      {/* Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-indigo-500" />
            <h2 className="text-lg font-semibold">System Performance</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <InfoRow label="Avg Energy per Log" value={`${stats.avgEnergyPerLog} kWh`} />
            <InfoRow label="Highest Energy Usage" value={`${stats.highestEnergyUsage} kWh`} />
            <InfoRow label="Today's Energy" value={`${stats.todayEnergy} kWh`} />
            <InfoRow label="Monthly Energy" value={`${stats.monthlyEnergy} kWh`} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="text-yellow-500" />
            <h2 className="font-semibold">Top Consuming User</h2>
          </div>

          {stats.topConsumingUser ? (
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-lg">
                {stats.topConsumingUser.username}
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                {stats.topConsumingUser.email}
              </p>
            </div>
          ) : (
            <p className="text-gray-400">No Data</p>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TrendCard title="Last 7 Days Energy Trend" icon={<TrendingUp />} data={trend.last7Days} />
        <TrendCard title="Monthly Energy Trend" icon={<Flame />} data={trend.monthlyTrend} />
        <PieChartCard data={trend.applianceDistribution} />
      </div>

    </div>
  );
}

export default AdminDashboard;