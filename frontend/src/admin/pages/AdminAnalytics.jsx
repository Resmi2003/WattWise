import React, { useEffect, useState } from "react";

import {
  getAdminInsightsAPI,
  getAdminLeaderboardAPI,
  getAdminAlertsAPI,
  getAdminUsageLogsAPI
} from "../../services/allAPI";

import {
  Download,
  FileText,
  Crown,
  Zap,
  CalendarDays,
  Gauge
} from "lucide-react";



function AdminAnalytics() {

  const [logs, setLogs] = useState({});
  const [insights, setInsights] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const [isLive, setIsLive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  // ================= FETCH ALL =================
  const fetchAll = async () => {
    await Promise.all([
      fetchLogs(),
      fetchInsights(),
      fetchLeaderboard(),
      fetchAlerts()
    ]);

    setLastUpdated(new Date().toLocaleTimeString());
  };


  useEffect(() => {
    fetchAll();

    let interval;

    if (isLive) {
      interval = setInterval(() => {
        fetchAll();
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [isLive]);

  // ================= FETCH LOGS =================
  const fetchLogs = async () => {
    try {
      const res = await getAdminUsageLogsAPI();
      console.log(res.data);


      if (res.status === 200) {
        setLogs(res.data || []);
      }

    } catch (err) {
      console.log(err);
    }
  };



  // ================= FETCH INSIGHTS =================
  const fetchInsights = async () => {
    try {
      const res = await getAdminInsightsAPI();
      if (res.status === 200) {
        setInsights(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ================= FETCH LEADERBOARD =================
  const fetchLeaderboard = async () => {
    try {
      const res = await getAdminLeaderboardAPI();
      if (res.status === 200) {
        setLeaderboard(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ================= FETCH ALERTS =================
  const fetchAlerts = async () => {
    try {
      const res = await getAdminAlertsAPI();
      if (res.status === 200) {
        setAlerts(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ================= EXPORT CSV =================
  const handleExportCSV = () => {

    if (!logs || logs.length === 0) return;

    let csv =
      "User,Appliance,Power(W),Hours,Energy(kWh),Date\n";

    logs.forEach((log) => {

      const energy =
        ((log.power || 0) * (log.hours || 0)) / 1000;

      csv +=
        `${log.userId?.username || "Unknown"},` +
        `${log.applianceName || "N/A"},` +
        `${log.power || 0},` +
        `${log.hours || 0},` +
        `${energy.toFixed(2)},` +
        `${new Date(log.createdAt).toLocaleString()}\n`;

    });

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;"
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "admin-analytics-report.csv";

    a.click();
  };


  // ================= EXPORT PDF =================
  const handleExportPDF = () => {

    if (!logs || logs.length === 0) return;

    const printWindow = window.open("", "_blank");

    const content = `
    <html>
    <head>
      <title>Admin Analytics Report</title>

      <style>
        body {
          font-family: Arial;
          padding: 20px;
        }

        h2 {
          color: #2563eb;
          margin-bottom: 20px;
        }

        table {
          border-collapse: collapse;
          width: 100%;
        }

        th, td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: center;
        }

        th {
          background-color: #2563eb;
          color: white;
        }

        tr:nth-child(even) {
          background-color: #f3f4f6;
        }
      </style>
    </head>

    <body>

      <h2>Admin Analytics Report</h2>

      <table>

        <tr>
          <th>User</th>
          <th>Appliance</th>
          <th>Power</th>
          <th>Hours</th>
          <th>Energy</th>
          <th>Date</th>
        </tr>

        ${logs.map((log) => {

      const energy =
        ((log.power || 0) * (log.hours || 0)) / 1000;

      return `
            <tr>
              <td>${log.userId?.username || "Unknown"}</td>
              <td>${log.applianceName || "N/A"}</td>
              <td>${log.power || 0} W</td>
              <td>${log.hours || 0}</td>
              <td>${energy.toFixed(2)} kWh</td>
              <td>${new Date(log.createdAt).toLocaleString()}</td>
            </tr>
          `;
    }).join("")}

      </table>

    </body>
    </html>
  `;

    printWindow.document.write(content);

    printWindow.document.close();

    printWindow.print();
  };






  return (
    <div className="space-y-8">

      {/* LIVE CONTROL */}
      <div className="flex justify-between items-center">

        <div className="flex items-center gap-3">

          <span className={`text-xs px-3 py-1 rounded-full font-medium
            ${isLive
              ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            {isLive ? "Live Updating" : "Paused"}
          </span>

          <button
            onClick={() => setIsLive(!isLive)}
            className="text-sm px-3 py-1 rounded-lg bg-indigo-500 text-white hover:scale-105 transition"
          >
            {isLive ? "Pause" : "Resume"}
          </button>

        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          Last Updated: {lastUpdated || "Loading..."}
        </div>

      </div>

      {/* EXPORT BUTTONS */}
      <div className="flex flex-wrap gap-4">

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-xl
          bg-green-500 text-white hover:scale-105 transition shadow"
        >
          <Download size={16} />
          Export CSV
        </button>

        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-4 py-2 rounded-xl
          bg-blue-500 text-white hover:scale-105 transition shadow"
        >
          <FileText size={16} />
          Export PDF
        </button>

      </div>

      {/* INSIGHTS */}
      {insights && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow border dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="text-yellow-500" />
              <h3 className="font-semibold text-gray-700 dark:text-gray-200">
                Top Appliance
              </h3>
            </div>

            {insights.topAppliance ? (
              <>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {insights.topAppliance.name}
                </p>
                <p className="text-sm text-gray-500">
                  {insights.topAppliance.energy} kWh
                </p>
              </>
            ) : <p className="text-gray-400">No Data</p>}
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow border dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="text-yellow-400" />
              <h3 className="font-semibold text-gray-700 dark:text-gray-200">
                Top Users
              </h3>
            </div>

            {insights.topUsers?.length > 0
              ? insights.topUsers.map((u, i) => (
                <p key={i} className="text-sm text-gray-700 dark:text-gray-300">
                  {i + 1}. {u.username} ({u.energy} kWh)
                </p>
              ))
              : <p className="text-gray-400">No Data</p>}
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow border dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <CalendarDays className="text-blue-500" />
              <h3 className="font-semibold text-gray-700 dark:text-gray-200">
                Peak Day
              </h3>
            </div>

            {insights.peakDay ? (
              <>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {insights.peakDay.date}
                </p>
                <p className="text-sm text-gray-500">
                  {insights.peakDay.energy} kWh
                </p>
              </>
            ) : <p className="text-gray-400">No Data</p>}
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow border dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Gauge className="text-green-500" />
              <h3 className="font-semibold text-gray-700 dark:text-gray-200">
                Efficiency Score
              </h3>
            </div>

            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {insights.efficiencyScore}%
            </p>
          </div>

        </div>
      )}

      {/* LEADERBOARD */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow border dark:border-gray-700">

        <div className="flex items-center gap-2 mb-4">
          <Crown className="text-yellow-500" />
          <h2 className="font-semibold text-gray-700 dark:text-gray-200">
            Energy Leaderboard
          </h2>
        </div>

        {leaderboard.length > 0 ? (
          leaderboard.slice(0, 5).map((user, i) => (
            <div key={i} className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl mb-2">
              <span>#{i + 1} {user.username}</span>
              <span>{user.energy} kWh</span>
            </div>
          ))
        ) : <p className="text-gray-400">No data</p>}

      </div>

      {/* REAL ALERTS */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow border dark:border-gray-700">

        <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">
          System Alerts
        </h2>

        <div className="space-y-3">

          {alerts.length > 0 ? (
            alerts.map((a, i) => {

              const color =
                a.type === "danger"
                  ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                  : a.type === "warning"
                    ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"
                    : a.type === "info"
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400";

              return (
                <div key={i} className={`p-3 rounded-xl ${color}`}>
                  {a.message}
                </div>
              );
            })
          ) : (
            <p className="text-gray-400">No alerts</p>
          )}

        </div>

      </div>

    </div>
  );
}

export default AdminAnalytics;