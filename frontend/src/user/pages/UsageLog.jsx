import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { Trash2 } from "lucide-react";

import {
  addUsageAPI,
  getUsageAPI,
  deleteUsageAPI,
  getAppliancesAPI,
  addNotificationAPI
} from "../../services/allAPI";

function UsageLog() {

  const {
    appliances,
    setAppliances,
    usageLogs,
    setUsageLogs,
    fetchUser,
    user
  } = useAppContext();

  const [selectedId, setSelectedId] = useState("");
  const [hours, setHours] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [loading, setLoading] = useState(true);

  // LOAD USAGE LOGS
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);

      const token = sessionStorage.getItem("token");

      const reqHeader = {
        Authorization: `Bearer ${token}`
      };

      const result = await getUsageAPI(reqHeader);

      let updatedLogs = usageLogs;

      if (result.status === 200) {
        setUsageLogs(result.data);
        updatedLogs = result.data;
      }

      setLoading(false);
    };

    fetchLogs();
  }, [setUsageLogs]);

  // LOAD APPLIANCES
  useEffect(() => {
    const fetchAppliances = async () => {

      const token = sessionStorage.getItem("token");

      const reqHeader = {
        Authorization: `Bearer ${token}`
      };

      const result = await getAppliancesAPI(reqHeader);

      if (result.status === 200) {
        setAppliances(result.data);
      }
    };

    fetchAppliances();
  }, [setAppliances]);

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedId || !hours) return;

    const appliance = appliances.find(a => a._id === selectedId);
    if (!appliance) return;

    const energy = Number(((appliance.power * Number(hours)) / 1000).toFixed(2));

    const newLog = {
      applianceId: appliance._id,
      applianceName: appliance.name,
      hours: Number(hours),
      power: appliance.power,
      energy: energy,
      date: selectedDate || new Date().toISOString().split("T")[0]
    };

    const token = sessionStorage.getItem("token");

    const reqHeader = {
      Authorization: `Bearer ${token}`
    };

    // RESET FIRST
    setSelectedId("");
    setHours("");
    setSelectedDate("");

    // API CALL
    await addUsageAPI(newLog, reqHeader);

    // refresh usage
    const result = await getUsageAPI(reqHeader);

    let updatedLogs = [];

    if (result.status === 200) {
      setUsageLogs(result.data);
      updatedLogs = result.data;
    }


    // ================= SMART GOAL CHECK =================

    const updatedUser = await fetchUser();
    const userSettings = user?.settings;




    // today's date
    const today = new Date().toISOString().split("T")[0];

    // current month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // calculate today's total usage
    const todayUsage = updatedLogs
      .filter(log => log.date === today)
      .reduce((sum, log) => sum + log.energy, 0);

    // calculate monthly usage
    const monthlyUsage = updatedLogs
      .filter(log => {
        const d = new Date(log.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, log) => sum + log.energy, 0);

    // include current entry
    const updatedTodayUsage = todayUsage + energy;
    const updatedMonthlyUsage = monthlyUsage + energy;

    // flags
    let goalExceeded = false;
    let monthlyExceeded = false;

    // daily goal check
    if (userSettings?.dailyGoal && updatedTodayUsage > userSettings.dailyGoal) {
      goalExceeded = true;
    }

    // monthly limit check
    if (userSettings?.monthlyLimit && updatedMonthlyUsage > userSettings.monthlyLimit) {
      monthlyExceeded = true;
    }

    // send notifications
    if (userSettings?.notifications !== false) {

      if (goalExceeded) {
        await addNotificationAPI(
          {
            message: `Daily Goal Exceeded: You used ${updatedTodayUsage.toFixed(2)} kWh today`,
            date: new Date().toISOString()
          },
          reqHeader
        );
      }

      if (monthlyExceeded) {
        await addNotificationAPI(
          {
            message: `Monthly Limit Exceeded: You used ${updatedMonthlyUsage.toFixed(2)} kWh this month`,
            date: new Date().toISOString()
          },
          reqHeader
        );
      }
    }

    // SMART NOTIFICATION USING SETTINGS

    const energyValue = Number(energy);

    // get user from sessionStorage
    // const userSettings = user?.settings;

    if (userSettings?.notifications !== false) {

      // ENERGY ALERT
      if (energyValue > userSettings.energyThreshold) {
        await addNotificationAPI({
          message: `High Energy Usage: ${appliance.name} used ${energyValue} kWh`,
          date: new Date().toISOString()
        }, reqHeader);
      }


    }
  };



  // DELETE
  const handleDelete = async (id) => {

    const token = sessionStorage.getItem("token");

    const reqHeader = {
      Authorization: `Bearer ${token}`
    };

    await deleteUsageAPI(id, reqHeader);

    const result = await getUsageAPI(reqHeader);


    if (result.status === 200) {
      setUsageLogs(result.data);
    }
  };

  return (
    <div className="space-y-6">

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-xl p-6 shadow-sm"
      >

        <div className="grid md:grid-cols-3 gap-4">

          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            <option value="">Select Appliance</option>

            {appliances.map(a => (
              <option key={a._id} value={a._id}>
                {a.name} ({a.power}W)
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Hours"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
          />

          <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 shadow-sm">
            Add
          </button>

        </div>

        <div className="mt-4">
          <label className="text-sm text-gray-500 dark:text-gray-400">
            Select Date (optional)
          </label>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="mt-1 p-3 border border-gray-200 dark:border-gray-600 rounded-lg w-full bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
          />
        </div>

      </form>

      <div className="grid md:grid-cols-2 gap-6">

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        ) : usageLogs.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No logs yet.</p>
        ) : (
          usageLogs.map(log => (
            <div
              key={log._id}
              className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >

              <h3 className="font-semibold text-gray-800 dark:text-white">
                {log.applianceName}
              </h3>

              <p className="text-gray-500 dark:text-gray-400">
                {Number(log.hours)} hrs × {Number(log.power)}W
              </p>

              <p className="text-blue-600 font-semibold mt-1">
                {log.energy} kWh
              </p>

              <div className="flex justify-between mt-3">

                <span className="text-xs text-gray-400">
                  {new Date(log.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })}
                </span>

                <button
                  onClick={() => handleDelete(log._id)}
                  className="text-red-500 hover:scale-110 transition"
                >
                  <Trash2 size={18} />
                </button>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default UsageLog;