import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from 'react-router-dom';
import './index.css'; // global styles (fonts, background)
import App from "./App.jsx";

const react = window.React || React;
const reactDOM = window.ReactDOM || ReactDOM;

reactDOM.createRoot(document.getElementById("my-react-app")).render(
  <react.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </react.StrictMode>
);


// import React from "react";
// import ReactDOM from "react-dom/client";
// import './index.css'; // global styles (fonts, background)
// import App from "./App.jsx";

// const react = window.React || React;
// const reactDOM = window.ReactDOM || ReactDOM;

// reactDOM.createRoot(document.getElementById("my-react-app")).render(
//   <react.StrictMode>
//     <App />
//   </react.StrictMode>
// );
