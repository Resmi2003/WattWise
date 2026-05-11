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
import Users from "./admin/pages/Users";
import AdminProtect from "./routes/AdminProtect";
import UserProtect from "./routes/UserProtect";
import ApplianceOverview from "./admin/pages/ApplianceOverview";
import AdminAnalytics from "./admin/pages/AdminAnalytics";
import Premium from "./user/pages/Premium";
import PaymentSuccess from "./user/pages/PaymentSuccess";
import PaymentCancel from "./user/pages/PaymentCancel";
import PageNotFound from "./auth/PageNotFound";


function App() {
  return (
    <AppContextProvider>
      <Router>
        <Routes>

          {/* PUBLIC */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />



          {/* USER ROUTES */}
          <Route
            element={
              <UserProtect>
                <MainLayout />
              </UserProtect>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/appliances" element={<Appliances />} />
            <Route path="/usage-log" element={<UsageLog />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/premium" element={<Premium />} />
          </Route>

          {/* ADMIN ROUTES */}
          <Route element={<MainLayout />}>

            <Route
              path="/admin/dashboard"
              element={
                <AdminProtect>
                  <AdminDashboard />
                </AdminProtect>
              }
            />

            <Route
              path="/admin/users"
              element={
                <AdminProtect>
                  <Users />
                </AdminProtect>
              }
            />

            <Route
              path="/admin/appliances"
              element={
                <AdminProtect>
                  <ApplianceOverview />
                </AdminProtect>
              }
            />

            <Route
              path="/admin/analytics"
              element={
                <AdminProtect>
                  <AdminAnalytics />
                </AdminProtect>
              }
            />

          </Route>

          <Route path="*" element={<PageNotFound />} />


        </Routes>
      </Router>
    </AppContextProvider>
  );
}

export default App;