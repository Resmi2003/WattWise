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

// ================NOTIFICATION==================
export const addNotificationAPI = (data, headers) => {
  return commonAPI("POST", "/notification/add", data, headers);
};

export const getNotificationAPI = (headers) => {
  return commonAPI("GET", "/notification/get", "", headers);
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

