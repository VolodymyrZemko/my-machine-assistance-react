import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css"; // global styles (root, body, fonts)
import "./App.css"; // app layout & component styles

const react = window.React || React;
const reactDOM = window.ReactDOM || ReactDOM;

reactDOM.createRoot(document.getElementById("my-react-app")).render(
  <react.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </react.StrictMode>
);
