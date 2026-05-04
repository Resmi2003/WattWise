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

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [trend, setTrend] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const statsRes = await getAdminStatsAPI();
      if (statsRes.status === 200) {
        setStats(statsRes.data);
      }

      const token = sessionStorage.getItem("token");

      const trendRes = await axios.get(
        `${server_url}/api/admin/energy-trend`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (trendRes.status === 200) {
        setTrend(trendRes.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (!stats || !trend) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <DashboardCard icon={<Users />} title="Total Users" value={stats.totalUsers} color="from-blue-500 to-blue-600" />

        <DashboardCard icon={<UserCheck />} title="Active Users" value={stats.activeUsers} color="from-green-500 to-emerald-600" />

        <DashboardCard icon={<UserX />} title="Blocked Users" value={stats.blockedUsers} color="from-red-500 to-red-600" />

        <DashboardCard icon={<Zap />} title="Total Energy (kWh)" value={stats.totalEnergy} color="from-orange-500 to-orange-600" />

      </div>

      {/* ================= PERFORMANCE SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* System Health */}
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

        {/* Top User */}
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

      {/* ================= TREND SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Last 7 Days */}
        <TrendCard
          title="Last 7 Days Energy Trend"
          icon={<TrendingUp />}
          data={trend.last7Days}
        />

        {/* Monthly */}
        <TrendCard
          title="Monthly Energy Trend"
          icon={<Flame />}
          data={trend.monthlyTrend}
        />

      </div>

    </div>
  );
}

export default AdminDashboard;

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

const TrendCard = ({ title, icon, data }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border dark:border-gray-700">
    <div className="flex items-center gap-2 mb-4">
      <div className="text-indigo-500">{icon}</div>
      <h2 className="font-semibold">{title}</h2>
    </div>

    <div className="space-y-2 text-sm">
      {Object.entries(data).map(([key, value]) => (
        <div
          key={key}
          className="flex justify-between bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg"
        >
          <span>{key}</span>
          <span className="font-semibold">{value} kWh</span>
        </div>
      ))}
    </div>
  </div>
);