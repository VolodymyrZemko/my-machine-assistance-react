import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import './index.css'; // global styles (fonts, background)
import App from "./App.jsx";

const react = window.React || React;
const reactDOM = window.ReactDOM || ReactDOM;

// Dynamically choose basename depending on host path (GitHub Pages vs Nespresso CMS page)
const path = window.location.pathname;
let basename = '/';
if (path.includes('/my-react-cms-app')) {
  basename = '/my-react-cms-app';
} else if (path.includes('/test-page-gwp')) { // Nespresso test page
  // include full path up to page slug so relative routes append correctly
  basename = '/gr/en/test-page-gwp';
}

reactDOM.createRoot(document.getElementById("my-react-app")).render(
  <react.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </react.StrictMode>
);


