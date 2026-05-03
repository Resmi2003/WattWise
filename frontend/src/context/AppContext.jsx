import { createContext, useContext, useEffect, useState } from "react";
import {
  getAppliancesAPI,
  getUsageAPI,
  getProfileAPI
} from "../services/allAPI";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {

  const [appliances, setAppliances] = useState([]);
  const [usageLogs, setUsageLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);


  // Dark Mode
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  // const [darkMode, setDarkMode] = useState(false);

  // Token (sessionStorage)
  const [token, setToken] = useState(sessionStorage.getItem("token"));

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

  // const fetchUser = async () => {
  //   try {
  //     const res = await getProfileAPI();

  //     console.log("USER RESPONSE:", res);

  //     if (res.status === 200) {
  //       setUser(res.data);
  //       return res.data;
  //     }

  //   } catch (err) {
  //     console.error("Error fetching user:", err);
  //   }
  // };

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
    } else{
      setUserLoading(false);
    }
  }, []);

  // LOAD DATA WHEN TOKEN CHANGES (LOGIN CASE)
  useEffect(() => {
    if (token) {
      fetchAppliances();
      fetchUsage();
      fetchUser();
    } else{
      setUser(null);
      setUserLoading(false);
    }
  }, [token]);

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

  // useEffect(() => {
  //   if (!token) return; // only after login

  //   if (darkMode) {
  //     document.documentElement.classList.add("dark");
  //     localStorage.setItem("theme", "dark");
  //   } else {
  //     document.documentElement.classList.remove("dark");
  //     localStorage.setItem("theme", "light");
  //   }
  // }, [darkMode, token]);





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
        userLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// ✅ Custom Hook (UNCHANGED)
export const useAppContext = () => useContext(AppContext);

export default AppContextProvider;