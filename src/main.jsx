import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Mount to #root (matches index.html). Fallback to dynamic globals if provided by host.
const R = window.React || React;
const RD = window.ReactDOM || ReactDOM;

RD.createRoot(document.getElementById("root")).render(
  <R.StrictMode>
    <App />
  </R.StrictMode>
);
