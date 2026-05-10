import { createContext, useContext, useEffect, useState } from "react";
import {
  getAppliancesAPI,
  getUsageAPI,
  getProfileAPI,
  getNotificationAPI
} from "../services/allAPI";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {

  const [appliances, setAppliances] = useState([]);
  const [usageLogs, setUsageLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);


  // Dark Mode
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });


  const [token, setToken] = useState(sessionStorage.getItem("token"));



  const fetchUnreadCount = async () => {
    try {

      const res = await getNotificationAPI();

      const count = res.data.filter(n => !n.isRead).length;

      setUnreadCount(count);

    } catch (err) {
      console.log(err);
    }
  };



  // Fetch Appliances
  const fetchAppliances = async () => {
    try {
      setLoading(true);

      const res = await getAppliancesAPI();

      if (res.status === 200) {
        setAppliances(res.data);
      }

    } catch (err) {
      console.error("Error fetching appliances:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Usage Logs
  const fetchUsage = async () => {
    try {
      const res = await getUsageAPI();

      if (res.status === 200) {
        setUsageLogs(res.data);
      }

    } catch (err) {
      console.error("Error fetching usage:", err);
    }
  };



  const fetchUser = async () => {
    try {
      const res = await getProfileAPI();

      console.log("USER RESPONSE:", res);

      if (res.status === 200) {
        setUser(res.data);
        return res.data;
      }

    } catch (err) {
      console.error("Error fetching user:", err);
      setUser(null);
    } finally {
      setUserLoading(false);
    }
  };



  // LOAD DATA ON FIRST RENDER
  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);   // sync state
      fetchAppliances();
      fetchUsage();
      fetchUser();
    } else {
      setUserLoading(false);
    }
  }, []);

  // LOAD DATA WHEN TOKEN CHANGES (LOGIN CASE)
  useEffect(() => {
    if (token) {
      fetchAppliances();
      fetchUsage();
      fetchUser();
    } else {
      setUser(null);
      setUserLoading(false);
    }
  }, [token]);


  useEffect(() => {
    if (token) {
      fetchUnreadCount();
    }
  }, [token]);


  // LOGOUT
  const logout = () => {
    sessionStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setAppliances([]);
    setUsageLogs([]);
  };




  // APPLY DARK MODE
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);







  return (
    <AppContext.Provider
      value={{
        appliances,
        setAppliances,
        usageLogs,
        setUsageLogs,
        fetchAppliances,
        fetchUsage,
        fetchUser,
        darkMode,
        setDarkMode,
        loading,
        token,
        setToken,
        user,
        setUser,
        userLoading,
        unreadCount,
        fetchUnreadCount,
        logout

      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom Hook
export const useAppContext = () => useContext(AppContext);

export default AppContextProvider;