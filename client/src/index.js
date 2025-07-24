// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

//==========================================================================================================
// // src/index.js

// import React from 'react';
// import ReactDOM from 'react-dom/client';

// import axios from 'axios';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// // ────────────────────────────────────────────────────────────────
// // 1) Point Axios at your Express API
// axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// // 2) If there's a stored JWT, send it on every request
// const token = localStorage.getItem('token');
// if (token) {
//   axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
// }
// // ────────────────────────────────────────────────────────────────

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // Optional: measure performance
// reportWebVitals();


//==========================================================
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// 1) Point Axios at your Express API
import axios from 'axios';
import './utils/axiosConfig';  // ← this just runs the interceptor setup
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
