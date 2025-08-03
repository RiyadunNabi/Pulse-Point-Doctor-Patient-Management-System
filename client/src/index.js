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
