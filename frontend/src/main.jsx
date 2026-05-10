import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { GoogleOAuthProvider } from "@react-oauth/google";

const theme = localStorage.getItem("theme");

if (theme === "dark") {
  document.documentElement.classList.add("dark");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
    >
      <App />

      <ToastContainer
        position="top-right"
        autoClose={2000}
      />
    </GoogleOAuthProvider>

  </React.StrictMode>
);