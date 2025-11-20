import React from "react";
import ReactDOM from "react-dom/client";
import './index.css'; // global styles (fonts, background)
import App from "./App.jsx";

// Use the standard React & ReactDOM objects directly to avoid any potential
// reassignment attempts on local const aliases that could trigger errors
// like "Assignment to constant variable" during HMR in embedded environments.

ReactDOM.createRoot(document.getElementById("my-react-app")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


