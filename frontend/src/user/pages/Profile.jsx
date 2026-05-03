import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { updateProfileAPI } from "../../services/allAPI";
import {
  User,
  Edit3,
  Save,
  Zap,
  Activity,
  Award,
  Clock
} from "lucide-react";

function Profile() {
  const { appliances, usageLogs, user, setUser } = useAppContext();

  const achievements = user?.achievements || [];


  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (user) setUsername(user.username || "");
  }, [user]);

  const handleSave = async () => {
    try {
      const res = await updateProfileAPI({ username });
      if (res.status === 200) {
        setUser(res.data);
        setEditMode(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // SAFE DATA (no fake numbers)
  const applianceCount = appliances.length;
  const usageCount = usageLogs.length;


  // Recent activity (last 3 logs)
  const recentLogs = usageLogs.slice(-3).reverse();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">

      {/* HERO */}
      <div className="rounded-3xl p-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white shadow-lg">

        <div className="flex justify-between items-center">

          <div className="flex items-center gap-4">

            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <User />
            </div>

            {/* Info */}
            <div>
              {editMode ? (
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-white/20 px-3 py-1 rounded text-lg outline-none"
                />
              ) : (
                <h2 className="text-xl font-bold">{user?.username}</h2>
              )}

              <p className="text-sm opacity-80">{user?.email}</p>
            </div>

          </div>

          <button
            onClick={editMode ? handleSave : () => setEditMode(true)}
            className="bg-white/20 px-4 py-1 rounded-lg flex items-center gap-1 hover:bg-white/30 transition"
          >
            {editMode ? <Save size={16} /> : <Edit3 size={16} />}
            {editMode ? "Save" : "Edit"}
          </button>

        </div>
      </div>

      {/* QUICK SNAPSHOT (NOT DASHBOARD) */}
      <div className="flex flex-wrap gap-3">

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-sm">
          <Zap size={16} />
          {applianceCount} Appliances
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-sm">
          <Activity size={16} />
          {usageCount} Logs
        </div>

      </div>

      {/* ACHIEVEMENTS (BADGES, NOT TEXT BLOCKS) */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow">
        <h3 className="font-semibold mb-4">Achievements</h3>

        {achievements.length === 0 ? (
          <p className="text-sm text-gray-500">No achievements yet</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {achievements.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-2 rounded-full 
          bg-yellow-100 text-yellow-700 
          dark:bg-yellow-900/30 dark:text-yellow-300 text-xs"
              >
                <Award size={14} />
                {item}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RECENT ACTIVITY (THIS MAKES IT FEEL REAL) */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow">

        <h3 className="font-semibold mb-4">Recent Activity</h3>

        {recentLogs.length === 0 ? (
          <p className="text-sm text-gray-500">No activity yet</p>
        ) : (
          <div className="space-y-3">

            {recentLogs.map((log, i) => (
              <div
                key={i}
                className="flex justify-between items-center border-b pb-2 last:border-none"
              >
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={14} />
                  {log.applianceName || "Appliance"}
                </div>

                <span className="text-xs text-gray-500">
                  {log.energy} kWh
                </span>
              </div>
            ))}

          </div>
        )}

      </div>

      {/* APPLIANCES TAGS */}
      <div>
        <h3 className="font-semibold mb-3">Your Appliances</h3>

        <div className="flex flex-wrap gap-2">

          {appliances.map((item, i) => (
            <span
              key={i}
              className="px-3 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-700"
            >
              {item.name}
            </span>
          ))}

        </div>
      </div>

    </div>
  );
}

export default Profile;