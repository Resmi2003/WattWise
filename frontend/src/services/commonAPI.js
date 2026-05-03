import axios from "axios";

const commonAPI = async (httpMethod, url, reqBody, reqHeader) => {

  const token = sessionStorage.getItem("token");

  const reqConfig = {
    method: httpMethod,
    url,
    data: reqBody,
    headers: {
      "Content-Type": "application/json",
      ...reqHeader,
      Authorization: token ? `Bearer ${token}` : ""
    }
  };

  try {
    const res = await axios(reqConfig);
    return res;
  } catch (err) {

    if (err.response && err.response.status === 401) {
      sessionStorage.removeItem("token");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    throw err;
  }
};

export default commonAPI;