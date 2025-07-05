import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import PatientDashboard from './components/PatientDashboard/PatientDashboard';

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
          
          // Validate that user has required fields
          if (parsedUser && parsedUser.role && parsedUser.patient_id) {
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

  // Handle successful login
  // const handleLogin = (token, userData) => {
  //   console.log('Login successful:', userData);
  //   console.log('=== LOGIN DEBUG ===');
  // console.log('Token:', token);
  // console.log('User data received:', userData);
  // console.log('Patient ID:', userData?.patient_id);
    
  //   localStorage.setItem('token', token);
  //   localStorage.setItem('user', JSON.stringify(userData));
  //   setUser(userData);
  // };
  // Simplify handleLogin
const handleLogin = (token, userData) => {
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
                <Navigate to="/dashboard" replace />
              ) : (
                <AuthPage onLogin={handleLogin} />
              )
            } 
          />
          
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
          
          <Route 
            path="/" 
            element={
              user && user.role === 'patient' && user.patient_id ? (
                <Navigate to="/dashboard" replace />
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



// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import AuthPage from './components/AuthPage';
// import PatientDashboard from './components/PatientDashboard/PatientDashboard';
// import ProtectedRoute from './components/ProtectedRoute';

// function App() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Check for existing authentication on app load
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userData = localStorage.getItem('user');

//     if (token && userData) {
//       try {
//         const parsedUser = JSON.parse(userData);
//         setUser(parsedUser);
//       } catch (error) {
//         console.error('Error parsing user data:', error);
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//       }
//     }
//     setLoading(false);
//   }, []);

//   // Handle successful login
//   const handleLogin = (token, userData) => {
//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(userData));
//     setUser(userData);
//   };

//   // Handle logout
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null);
//   };

//   // Loading screen while checking authentication
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center">
//         <div className="flex items-center space-x-3">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
//           <span className="text-slate-700 font-medium">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           {/* Public Route - Authentication */}
//           <Route
//             path="/auth"
//             element={
//               user ? (
//                 <Navigate to="/dashboard" replace />
//               ) : (
//                 <AuthPage onLogin={handleLogin} />
//               )
//             }
//           />

//           {/* Protected Route - Patient Dashboard */}
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute user={user} requiredRole="patient">
//                 <PatientDashboard user={user} onLogout={handleLogout} />
//               </ProtectedRoute>
//             }
//           />


//           {/* Default Route - Redirect based on authentication */}
//           <Route
//             path="/"
//             element={
//               user ? (
//                 <Navigate to="/dashboard" replace />
//               ) : (
//                 <Navigate to="/auth" replace />
//               )
//             }
//           />

//           {/* Catch all other routes */}
//           <Route
//             path="*"
//             element={
//               user ? (
//                 <Navigate to="/dashboard" replace />
//               ) : (
//                 <Navigate to="/auth" replace />
//               )
//             }
//           />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;




// import React, { useState } from 'react';
// import DoctorsList from './components/DoctorsList';
// import AuthPage from './components/AuthPage';

// function App() {
//   const [token, setToken] = useState('');
//   const [user, setUser] = useState(null);

//   return (
//     <div>
//       {!token ? (
//         <AuthPage onLogin={(jwt, userObj) => { setToken(jwt); setUser(userObj); }} />
//       ) : (
//         <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-400 flex flex-col items-center p-8">
//           <h1 className="text-4xl font-bold text-blue-800 mb-8 text-center drop-shadow-lg">
//             PulsePoint Doctor-Patient Management System
//           </h1>
//           <div className="w-full max-w-xl">
//             <DoctorsList token={token} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;



// import React, { useState } from 'react';
// import DoctorsList from './components/DoctorsList';
// import LoginForm from './components/LoginForm';

// function App() {
//   const [token, setToken] = useState('');

//   return (
//     <div>
//       {!token ? (
//         <LoginForm onLogin={setToken} />
//       ) : (
//         <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-400 flex flex-col items-center p-8">
//           <h1 className="text-4xl font-bold text-blue-800 mb-8 text-center drop-shadow-lg">
//             PulsePoint Doctor-Patient Management System
//           </h1>
//           <div className="w-full max-w-xl">
//             <DoctorsList token={token} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;
