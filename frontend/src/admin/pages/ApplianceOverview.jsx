import React, { useEffect, useState } from "react";
import axios from "axios";
import { server_url } from "../../services/server_url";
import { Trash2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

function ApplianceOverview() {
  const [appliances, setAppliances] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchAppliances();

    // 🔥 REAL-TIME SIMULATION (polling)
    const interval = setInterval(() => {
      fetchAppliances();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchAppliances = async () => {
    const token = sessionStorage.getItem("token");

    try {
      const res = await axios.get(
        `${server_url}/api/admin/appliances`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAppliances(res.data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.log("Error fetching appliances", err);
    }
  };

  const handleDelete = async (id) => {
    const token = sessionStorage.getItem("token");

    await axios.delete(
      `${server_url}/api/admin/appliances/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setAppliances((prev) => prev.filter((a) => a._id !== id));
  };

  const getStatusColor = (power) => {
    if (power > 1500) return "bg-red-500";
    if (power > 800) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStatusText = (power) => {
    if (power > 1500) return "High Load";
    if (power > 800) return "Moderate";
    return "Normal";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Appliance Activity Overview
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Live monitoring system
          </p>
        </div>

        <div className="text-right text-xs text-gray-500 dark:text-gray-400">
          <p>Last Updated</p>
          <p className="font-medium">{lastUpdated || "Loading..."}</p>
        </div>

      </div>

      {/* TIMELINE */}
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-gray-300 dark:bg-gray-700"></div>

        <div className="space-y-6">

          {appliances.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
              No appliances found
            </p>
          ) : (

            appliances.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                className="relative flex items-start gap-4"
              >

                {/* DOT */}
                <div className="w-8 flex justify-center">
                  <div className="relative mt-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(item.power)}`}></div>
                    <span className="absolute inset-0 rounded-full animate-ping opacity-30 bg-indigo-500"></span>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="flex-1">

                  <div className="flex items-center justify-between">

                    {/* LEFT */}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </p>

                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        User: {item.userId?.username || "N/A"}
                      </p>

                      {/* DYNAMIC STATUS */}
                      <p className="text-xs mt-1">
                        Status:{" "}
                        <span className="font-semibold">
                          {getStatusText(item.power)}
                        </span>
                      </p>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-4">

                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {item.power} W
                        </p>
                      </div>

                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 p-2 rounded-lg transition"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </div>

                  <div className="mt-3 border-b border-gray-200 dark:border-gray-700"></div>

                </div>

              </motion.div>
            ))
          )}

        </div>
      </div>
    </div>
  );
}

export default ApplianceOverview;