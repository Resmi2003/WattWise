import React, { useEffect, useState } from "react";
import { getNotificationAPI } from "../../services/allAPI";
import { FaBell } from "react-icons/fa";

function Notifications() {

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 FETCH NOTIFICATIONS FROM BACKEND
  useEffect(() => {
    const fetchNotifications = async () => {

      setLoading(true);

      const token = sessionStorage.getItem("token");

      const reqHeader = {
        Authorization: `Bearer ${token}`
      };

      const res = await getNotificationAPI(reqHeader);

              console.log("NOTIFICATION DATA:", res.data);


      if (res.status === 200) {
        setNotifications(Array.isArray(res.data) ? res.data : []);
      }

      setLoading(false);
    };

    fetchNotifications();
  }, []);

  return (
    <div className="space-y-6">

      {/* TITLE */}
      <div className="flex items-center gap-2">
        <FaBell className="text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Notifications
        </h2>
      </div>

      {/* CONTENT */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-xl p-6 shadow-sm">

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">
            Loading...
          </p>

        ) : notifications.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No notifications yet.
          </p>

        ) : (
          <div className="space-y-4">

            {notifications.map((item) => (

              <div
                key={item._id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700"
              >

                <p className="text-gray-800 dark:text-white">
                  {item.message}
                </p>

                <span className="text-xs text-gray-400">
                  {new Date(item.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })}
                </span>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Notifications;