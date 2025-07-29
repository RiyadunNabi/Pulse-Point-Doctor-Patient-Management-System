// client/src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
//patient
import PatientDashboard from './components/PatientDashboard/PatientDashboard';
import DoctorsPage from './components/PatientDashboard/DoctorsSection/DoctorsPage';
import DepartmentsPage from './components/PatientDashboard/DepartmentsSection/DepartmentsPage';
import PatientAppointmentsPage from './components/PatientDashboard/PatientAppointmentsPage/PatientAppointmentsPage';
import PatientArticlesPage from './components/PatientDashboard/HealthArticlesView/PatientArticlesPage';

//doctor
import DoctorDashboard from './components/DoctorDashboard/DoctorDashboard';
import ManageAppointments from './components/DoctorDashboard/ManageAppointments/ManageAppointments';
import MyPatientsPage from './components/DoctorDashboard/MyPatientsPage/MyPatientsPage';
import HealthArticlesPage from './components/DoctorDashboard/HealthArticlesPage/HealthArticlesPage';
import DoctorRevenuePage from './components/DoctorDashboard/RevenuePage/DoctorRevenuePage';

import './utils/axiosConfig';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Enhanced authentication check on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      console.log('Checking auth status...');
      console.log('Token exists:', !!token);
      console.log('User data exists:', !!userData);

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          console.log('Parsed user data:', parsedUser);

          // Enhanced validation for both roles
          console.log('=== STORED USER DATA DEBUG ===');
          console.log('Stored user object:', parsedUser);
          console.log('User role:', parsedUser?.role);
          console.log('Patient ID:', parsedUser?.patient_id);
          console.log('Doctor ID:', parsedUser?.doctor_id);

          // Validate based on role
          const isValidUser = parsedUser && parsedUser.role && (
            (parsedUser.role === 'patient' && parsedUser.patient_id) ||
            (parsedUser.role === 'doctor' && parsedUser.doctor_id) ||
            parsedUser.role === 'admin'
          );

          if (isValidUser) {
            setUser(parsedUser);
            console.log('User authenticated successfully');
          } else {
            console.log('Invalid user data, clearing localStorage');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        console.log('No authentication data found');
        setUser(null);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('token', localStorage.getItem('token') || '');
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  const handleLogin = (token, userData) => {
    console.log('=== LOGIN RESPONSE DEBUG ===');
    console.log('User object from login:', userData);
    console.log('User patient_id:', userData?.patient_id);
    console.log('User patient_id type:', typeof userData?.patient_id);
    console.log('User patient_id as string:', String(userData?.patient_id));
    console.log('User patient_id JSON:', JSON.stringify(userData?.patient_id));

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // Handle logout
  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          <span className="text-slate-700 font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/auth"
            element={
              user ? (
                // <Navigate to="/dashboard" replace />
                <Navigate to={user.role === 'patient' ? "/dashboard" : "/doctordashboard"} replace />
              ) : (
                <AuthPage onLogin={handleLogin} />
              )
            }
          />

          {/* Patient Routes */}
          <Route
            path="/dashboard"
            element={
              user && user.role === 'patient' ? (
                <PatientDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />

          {/* Patient-specific routes */}
          <Route
            path="/doctors"
            element={
              user && user.role === 'patient' ? (
                <DoctorsPage user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />

          <Route
            path="/departments"
            element={
              user && user.role === 'patient' ? (
                <DepartmentsPage user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />
          {/* Add this route to your App.js */}
          <Route
            path="/patient-appointments"
            element={
              user && user.role === 'patient' ? (
                <PatientAppointmentsPage user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />

          {/* Patient Health Articles Route */}
          <Route
            path="/view-articles"
            element={
              user && user.role === 'patient' ? (
                <PatientArticlesPage user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />



          {/* <Route
            path="/"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          /> */}

          {/* Doctor Routes */}
          <Route
            path="/doctordashboard"
            element={
              user && user.role === 'doctor' ? (
                <DoctorDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />

          <Route
            path="/doctor-appointments"
            element={
              user && user.role === 'doctor' ? (
                <ManageAppointments doctorId={user.doctor_id} user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />

          <Route
            path="/doctor-patients"
            element={
              user && user.role === 'doctor' ? (
                <MyPatientsPage user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />

          <Route
            path="/doctor-revenue"
            element={
              user && user.role === 'doctor' ? (
                <DoctorRevenuePage user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />

          <Route
            path="/doctor-articles"
            element={
              user && user.role === 'doctor' ? (
                <HealthArticlesPage user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />

          <Route
            path="/"
            element={
              user ? (
                <Navigate to={user.role === 'patient' ? "/dashboard" : "/doctordashboard"} replace />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />

          <Route
            path="*"
            element={<Navigate to="/auth" replace />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

