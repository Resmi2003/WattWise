import commonAPI from "./commonAPI";
import { server_url } from "./server_url";

// ================= AUTH =================

// register
export const registerAPI = async (reqBody) => {
  return await commonAPI("POST", `${server_url}/api/register`, reqBody);
};

// login
export const loginAPI = async (reqBody) => {
  return await commonAPI("POST", `${server_url}/api/login`, reqBody);
};

// google login
export const googleLoginAPI = async (reqBody) => {
  return await commonAPI("POST", `${server_url}/api/user/google-login`, reqBody);
};

// ================= APPLIANCES =================

// add appliance
export const addApplianceAPI = async (reqBody) => {
  return await commonAPI("POST", `${server_url}/api/appliances`, reqBody);
};

// get all appliances
export const getAppliancesAPI = async () => {
  return await commonAPI("GET", `${server_url}/api/appliances`, {});
};

// delete appliance
export const deleteApplianceAPI = async (id) => {
  return await commonAPI("DELETE", `${server_url}/api/appliances/${id}`, {});
};

// update appliance
export const updateApplianceAPI = async (id, reqBody) => {
  return await commonAPI("PUT", `${server_url}/api/appliances/${id}`, reqBody);
};

// ================= USAGE =================

// add usage
export const addUsageAPI = async (reqBody) => {
  return await commonAPI("POST", `${server_url}/api/usage`, reqBody);
};

// get usage
export const getUsageAPI = async () => {
  return await commonAPI("GET", `${server_url}/api/usage`, {});
};

// delete usage
export const deleteUsageAPI = async (id) => {
  return await commonAPI("DELETE", `${server_url}/api/usage/${id}`, {});
};





// ==============================NOTIFICATIONS================================

// CREATE
export const addNotificationAPI = (data, headers) => {
  return commonAPI("POST", `${server_url}/api/notifications`, data, headers);
};

// GET
export const getNotificationAPI = (headers) => {
  return commonAPI("GET", `${server_url}/api/notifications`, "", headers);
};

// MARK ONE AS READ
export const updateNotificationAPI = (id, headers) => {
  return commonAPI("PUT", `${server_url}/api/notifications/${id}`, {}, headers);
};

// MARK ALL AS READ
export const markAllAsReadAPI = (headers) => {
  return commonAPI("PUT", `${server_url}/api/notifications/clear-all`, {}, headers);
};


// ====================PROFILE===========================

// Get Logged-in User Profile
export const getProfileAPI = async () => {
  return await commonAPI("GET", `${server_url}/api/profile`, {});
};

// Update Profile
export const updateProfileAPI = async (reqBody) => {
  return await commonAPI("PUT", `${server_url}/api/profile`, reqBody);
};

// upload profile image
export const uploadProfileImageAPI = async (reqBody, reqHeader) => {
  return await commonAPI(
    "PUT",
    `${server_url}/api/profile-image`,
    reqBody,
    reqHeader
  );
};



// ================= SETTINGS / SECURITY =================

// change password
export const changePasswordAPI = async (reqBody) => {
  return await commonAPI("PUT", `${server_url}/api/change-password`, reqBody);
};

// delete own account (better than admin delete)
export const deleteMyAccountAPI = async () => {
  return await commonAPI("DELETE", `${server_url}/api/profile`, {});
};






// ================= ADMIN =================

// get all users
export const getAllUsersAPI = async () => {
  return await commonAPI("GET", `${server_url}/api/admin/users`, {});
};

// delete user
export const deleteUserAPI = async (id) => {
  return await commonAPI("DELETE", `${server_url}/api/admin/user/${id}`, {});
};

// block / unblock user
export const toggleBlockUserAPI = async (id) => {
  return await commonAPI("PUT", `${server_url}/api/admin/user/block/${id}`, {});
};


// ================= ADMIN DASHBOARD =================

// get admin stats
export const getAdminStatsAPI = async () => {
  return await commonAPI("GET", `${server_url}/api/admin/stats`, {});
};




// =============== ADMIN ANALYTICS ==================

// admin insights
export const getAdminInsightsAPI = async () => {
  return await commonAPI("GET", `${server_url}/api/admin/insights`, {});
};


// admin leaderboard
export const getAdminLeaderboardAPI = async () => {
  return await commonAPI("GET", `${server_url}/api/admin/leaderboard`, {});
};


// admin alert
export const getAdminAlertsAPI = async () => {
  return await commonAPI("GET", `${server_url}/api/admin/alerts`, {});
};


// admin usage logs
export const getAdminUsageLogsAPI = async () => {
  return await commonAPI(
    "GET",
    `${server_url}/api/admin/usage-logs`,
    {}
  );
};


// admin energy trend
export const getAdminEnergyTrendAPI = async () => {
  return await commonAPI(
    "GET",
    `${server_url}/api/admin/energy-trend`,
    {}
  );
};

// get admin appliances
export const getAdminAppliancesAPI = async () => {
  return await commonAPI(
    "GET",
    `${server_url}/api/admin/appliances`,
    {}
  );
};

// delete admin appliance
export const deleteAdminApplianceAPI = async (id) => {
  return await commonAPI(
    "DELETE",
    `${server_url}/api/admin/appliances/${id}`,
    {}
  );
};