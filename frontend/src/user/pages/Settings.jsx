import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import {
  Sun,
  Moon,
  LogOut,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Info
} from "lucide-react";

import {
  changePasswordAPI,
  deleteMyAccountAPI,
  getProfileAPI,
  updateProfileAPI
} from "../../services/allAPI";

import { validatePassword } from "../../utils/passwordValidator";

function Settings() {

  const { darkMode, setDarkMode, logout, user } = useAppContext();
  const navigate = useNavigate();

  const [showPasswordBox, setShowPasswordBox] = useState(false);

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [toast, setToast] = useState(null);

  const [settings, setSettings] = useState({
    notifications: true,
    energyThreshold: 5,
  });

  const [hasChanges, setHasChanges] = useState(false);

  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const passwordCheck = validatePassword(newPass);
  const showValidation = newPass.length > 0;
  const isPasswordMatch = newPass === confirmPass;
  const isDifferentFromOld = newPass !== oldPass;

  const isFormValid =
    oldPass &&
    newPass &&
    confirmPass &&
    isPasswordMatch &&
    isDifferentFromOld &&
    passwordCheck.isValid;

  // LOAD SETTINGS
  useEffect(() => {
    const fetchSettings = async () => {
      try {

        const res = await getProfileAPI();

        if (res.status === 200 && res.data.settings) {
          setSettings(res.data.settings);
        }

      } catch (err) {
        console.log(err);
      }
    };

    fetchSettings();

  }, []);



  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasChanges]);



  // CHANGE PASSWORD
  const handlePasswordChange = async () => {
    try {

      const res = await changePasswordAPI({
        oldPassword: oldPass,
        newPassword: newPass
      });

      if (res.status === 200) {

        showToast("Password updated successfully", "success");

        setOldPass("");
        setNewPass("");
        setConfirmPass("");
        setShowPasswordBox(false);
      }

    } catch (err) {
      showToast("Password update failed", "error");
    }

  };

  // SAVE SETTINGS
  const handleSaveSettings = async () => {
    try {

      const res = await updateProfileAPI({ settings });

      if (res.status === 200) {

        // update global user
        const updatedUser = res.data;

        // update context user
        if (updatedUser) {
          showToast("Settings updated successfully", "success");
        }

        setHasChanges(false);
      }

    } catch (err) {
      showToast("Update failed", "error");
    }

  };

  // LOGOUT
  const handleLogout = () => {

    logout();
    sessionStorage.removeItem("token");

    setTimeout(() => {
      navigate("/login", { replace: true });
      window.location.reload();
    }, 100);

  };

  // DELETE ACCOUNT
  const handleDelete = async () => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (!confirmDelete) return;

    try {

      const res = await deleteMyAccountAPI();

      if (res.status === 200) {
        logout();
        sessionStorage.removeItem("token");
        navigate("/register");
      }

    } catch (err) {
      showToast("Delete failed", "error");
    }

  };

  return (
    <div className="space-y-8 relative">

      {toast && (
        <div className={`fixed top-5 right-5 flex items-center gap-2 px-4 py-2 rounded-lg text-sm shadow-lg z-50
      ${toast.type === "success"
            ? "bg-green-600 text-white"
            : toast.type === "error"
              ? "bg-red-600 text-white"
              : "bg-gray-800 text-white"
          }
    `}>
          {toast.type === "success" ? <CheckCircle size={16} /> :
            toast.type === "error" ? <XCircle size={16} /> :
              <Info size={16} />}
          {toast.msg}
        </div>
      )}

      {/* ACCOUNT */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Account
        </h2>

        <p className="text-sm text-gray-600 dark:text-gray-300">
          Name: {user?.username}
        </p>

        <p className="text-sm text-gray-600 dark:text-gray-300">
          Email: {user?.email}
        </p>
      </div>

      {/* SECURITY */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Security
        </h2>

        <button
          onClick={() => setShowPasswordBox(!showPasswordBox)}
          className="text-sm text-blue-600 font-medium"
        >
          Change Password
        </button>

        {showPasswordBox && (
          <div className="mt-4 space-y-3">

            {/* OLD PASSWORD */}
            <div className="relative">
              <input
                type={showOld ? "text" : "password"}
                placeholder="Current password"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
              />
              <span onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-3 cursor-pointer">
                {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {/* NEW PASSWORD */}
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                placeholder="New password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
              />
              <span onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-3 cursor-pointer">
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
              />
              <span onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 cursor-pointer">
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {/* VALIDATION */}
            {showValidation && (
              <div className="text-xs space-y-1">

                <p className={passwordCheck.rules.minLength ? "text-green-500" : "text-red-500"}>
                  • At least 8 characters
                </p>

                <p className={passwordCheck.rules.hasUpper ? "text-green-500" : "text-red-500"}>
                  • One uppercase letter
                </p>

                <p className={passwordCheck.rules.hasLower ? "text-green-500" : "text-red-500"}>
                  • One lowercase letter
                </p>

                <p className={passwordCheck.rules.hasNumber ? "text-green-500" : "text-red-500"}>
                  • One number
                </p>

                <p className={passwordCheck.rules.hasSpecial ? "text-green-500" : "text-red-500"}>
                  • One special character
                </p>

                {!isPasswordMatch && confirmPass && (
                  <p className="text-red-500">Passwords do not match</p>
                )}

                {!isDifferentFromOld && newPass && (
                  <p className="text-red-500">New password must be different</p>
                )}

                {passwordCheck.isValid && isPasswordMatch && (
                  <p className="text-green-500">Strong password ready</p>
                )}

              </div>
            )}

            <button
              disabled={!isFormValid}
              onClick={handlePasswordChange}
              className={`text-sm font-medium ${isFormValid ? "text-blue-600" : "text-gray-400 cursor-not-allowed"
                }`}
            >
              Update Password
            </button>

          </div>
        )}
      </div>

      {/* APPEARANCE */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Appearance
        </h2>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center gap-2 text-sm text-gray-700 dark:text-white"
        >
          {darkMode ? <Moon size={16} /> : <Sun size={16} />}
          Toggle Theme
        </button>
      </div>

      {/* SMART PREFERENCES */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Smart Preferences
        </h2>

        <div className="space-y-3">

          <label className="flex justify-between items-center">
            <span className="text-sm">Enable Notifications</span>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={() => {
                setSettings(prev => ({
                  ...prev,
                  notifications: !prev.notifications
                }));
                setHasChanges(true);
              }}
            />
          </label>

          <div>
            <p className="text-sm">Energy Alert Threshold (kWh)</p>
            <input
              type="number"
              min="0"
              value={settings.energyThreshold}
              onChange={(e) => {
                setSettings(prev => ({
                  ...prev,
                  energyThreshold: e.target.value
                    ? Math.max(0, Number(e.target.value))
                    : ""
                }));
                setHasChanges(true);
              }}
              className="w-full p-2 mt-1 rounded bg-gray-50 dark:bg-gray-700"
            />
          </div>

        </div>
      </div>




      {hasChanges && (
        <p className="text-sm text-yellow-500 flex items-center gap-2">
          <Info size={14} /> You have unsaved changes
        </p>
      )}
      <button
        onClick={handleSaveSettings}
        disabled={!hasChanges}
        className={`mt-4 px-4 py-2 rounded-lg text-white 
    ${hasChanges ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
      >
        Save Preferences
      </button>

      {/* LOGOUT */}
      <div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-700 dark:text-white"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {/* DELETE */}
      <div>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 text-sm text-red-500"
        >
          <Trash2 size={16} />
          Delete Account
        </button>
      </div>

    </div>

  );
}

export default Settings;