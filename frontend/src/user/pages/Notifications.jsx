import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import {
  getNotificationAPI,
  updateNotificationAPI,
  markAllAsReadAPI
} from "../../services/allAPI";

function Notifications() {

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const { fetchUnreadCount } = useAppContext();


  // FETCH NOTIFICATIONS
  const fetchNotifications = async () => {
    try {
      const res = await getNotificationAPI();
      setNotifications(Array.isArray(res.data) ? res.data : []);    // stores notification data, checks response is array before storing

    } catch (err) {
      console.log("FETCH ERROR:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // MARK AS READ
  const markAsRead = async (id) => {
    try {
      await updateNotificationAPI(id);

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isRead: true } : item        // update clicked notification
        )
      );



      // Update navbar count
      fetchUnreadCount();

    } catch (err) {
      console.log("MARK ERROR:", err);
    }
  };

  // MARK ALL AS READ
  const markAllAsRead = async () => {
    try {
      await markAllAsReadAPI();


      setNotifications((prev) =>
        prev.map((item) => ({ ...item, isRead: true }))   // update all notifications
      );
      // Update navbar count
      fetchUnreadCount();

    } catch (err) {
      console.log("CLEAR ERROR:", err);
    }
  };

  return (
    <div className="p-6">

      {/* MARK ALL AS READ BUTTON */}
      {notifications.length > 0 && (
        <div className="flex justify-end mb-4">
          <button
            onClick={markAllAsRead}
            className="text-sm px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
          >
            Mark all as read
          </button>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>

        ) : notifications.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No notifications
          </p>

        ) : (
          <div className="space-y-3">

            {notifications.map((item) => (

              <div
                key={item._id}
                onClick={() => markAsRead(item._id)}
                className={`cursor-pointer p-4 rounded-lg transition border
                  ${item.isRead
                    ? "bg-gray-200 dark:bg-gray-700 opacity-60 border-gray-200 dark:border-gray-600"
                    : "bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700"
                  }
                `}
              >

                <p
                  className={`text-sm text-gray-800 dark:text-white ${!item.isRead ? "font-semibold" : ""
                    }`}
                >
                  {item.message}
                </p>

                <span className="text-xs text-gray-400">
                  {new Date(item.createdAt).toLocaleString()}
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