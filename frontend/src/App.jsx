import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppContextProvider from "./context/AppContext";
import MainLayout from "./layout/MainLayout";
import Login from "./auth/pages/Login";
import Register from "./auth/pages/Register";
import Landing from "./auth/pages/Landing";
import Dashboard from "./user/pages/Dashboard";
import Appliances from "./user/pages/Appliances";
import Analytics from "./user/pages/Analytics";
import Notifications from "./user/pages/Notifications";
import Profile from "./user/pages/Profile";
import UsageLog from "./user/pages/UsageLog";
import Settings from "./user/pages/Settings";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminProtect from "./routes/AdminProtect";



function App() {
  return (
    <AppContextProvider>
      <Router>
        <Routes>

          {/* Public Pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />



          <Route element={<MainLayout />}>

            {/* USER */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/appliances" element={<Appliances />} />
            <Route path="/usage-log" element={<UsageLog />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />

            {/* ADMIN */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminProtect>
                  <AdminDashboard />
                </AdminProtect>
              }
            />
            <Route path="/admin/profile" element={<Profile />} />
            <Route path="/admin/settings" element={<Settings />} />

          </Route>

        </Routes>
      </Router>
    </AppContextProvider>
  );
}

export default App;