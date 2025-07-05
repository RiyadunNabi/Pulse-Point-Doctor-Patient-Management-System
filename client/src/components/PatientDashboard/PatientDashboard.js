import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Bell, LogOut, User } from 'lucide-react';
import ProfileCard from './ProfileCard';
import HealthLogSection from './HealthLogSection';
import GraphSection from './GraphSection';
import MedicalDocumentsSection from './MedicalDocumentsSection';

// Pulse Point Logo Component
const PulsePointLogo = ({ className = "w-8 h-8" }) => (
    <div className={`${className} flex items-center justify-center`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
                <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="url(#pulseGradient)" />
            <path
                d="M25 50 L35 50 L40 35 L45 65 L50 40 L55 60 L60 45 L65 50 L75 50"
                stroke="white"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="50" cy="50" r="4" fill="white" />
        </svg>
    </div>
);

function PatientDashboard({ user, onLogout }) {
    // ✅ ALL HOOKS DECLARED FIRST - No conditional calls
    const [patient, setPatient] = useState(null);
    const [healthLogs, setHealthLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notifications] = useState(3);

    // Navigation tabs
    const navTabs = [
        { id: 'dashboard', label: 'Dashboard', active: true },
        { id: 'doctors', label: 'Doctors', active: false },
        { id: 'departments', label: 'Departments', active: false },
        { id: 'appointments', label: 'Book Appointment', active: false },
        { id: 'articles', label: 'Health Articles', active: false },
    ];

    // ✅ User validation with useEffect instead of early return
    useEffect(() => {
        if (!user || !user.patient_id) {
            console.error('Invalid user data:', user);
            setError('Invalid user session. Please log in again.');
            if (onLogout) {
                onLogout();
            }
            return;
        }
    }, [user, onLogout]);

    // ✅ Enhanced fetchPatientData with proper error handling
    // ✅ Enhanced fetchPatientData - Don't treat missing data as error
    const fetchPatientData = useCallback(async () => {
        if (!user?.patient_id) {
            console.error('No patient_id available');
            setError('Patient ID not found. Please log in again.');
            return;
        }

        try {
            console.log('Fetching patient data for ID:', user.patient_id);
            const response = await axios.get(`/api/patients/${user.patient_id}`);
            console.log('Patient data received:', response.data);
            setPatient(response.data);
            setError(''); // Clear any previous errors
        } catch (error) {
            console.error('Error fetching patient data:', error);
            if (error.response?.status === 404) {
                // Instead of error, create a basic patient object from user data
                console.log('Patient profile not found, creating basic profile from user data');
                const basicPatient = {
                    patient_id: user.patient_id,
                    user_id: user.user_id,
                    first_name: user.username || 'Patient',
                    last_name: '',
                    gender: null,
                    date_of_birth: null,
                    phone_no: null,
                    address: null,
                    blood_group: null,
                    health_condition: null,
                    email: user.email,
                    is_active: true,
                    // Flag to indicate this is incomplete
                    isIncomplete: true
                };
                setPatient(basicPatient);
                setError(''); // Don't show error
            } else if (error.response?.status === 401) {
                setError('Session expired. Please log in again.');
                onLogout();
            } else {
                setError('Failed to load patient information. Please try refreshing the page.');
            }
        }
    }, [user?.patient_id, user?.username, user?.email, user?.user_id, onLogout]);


    // ✅ Enhanced fetchHealthLogs with proper error handling
    const fetchHealthLogs = useCallback(async () => {
        if (!user?.patient_id) {
            console.error('No patient_id available for health logs');
            return;
        }

        try {
            console.log('Fetching health logs for patient ID:', user.patient_id);
            const response = await axios.get(`/api/health-logs/patient/${user.patient_id}`);
            console.log('Health logs received:', response.data);
            setHealthLogs(response.data);
        } catch (error) {
            console.error('Error fetching health logs:', error);
            // Don't set error for health logs as it's not critical
        } finally {
            setLoading(false);
        }
    }, [user?.patient_id]);

    // ✅ Enhanced useEffect with proper dependency management
    useEffect(() => {
        if (user?.patient_id) {
            fetchPatientData();
            fetchHealthLogs();
        } else {
            setLoading(false);
        }
    }, [fetchPatientData, fetchHealthLogs, user?.patient_id]);

    // ✅ Enhanced handlePatientUpdate with validation
    const handlePatientUpdate = (updatedPatient) => {
        if (updatedPatient && updatedPatient.patient_id) {
            console.log('Patient updated successfully:', updatedPatient);
            setPatient(updatedPatient);
        } else {
            console.error('Invalid patient update data:', updatedPatient);
        }
    };

    // ✅ CONDITIONAL RENDERING AFTER ALL HOOKS
    // User validation check
    if (!user || !user.patient_id) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center">
                <div className="text-center bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Session Error</h2>
                    <p className="text-red-600 mb-6">Invalid user session. Please log in again.</p>
                    <button
                        onClick={onLogout}
                        className="px-6 py-3 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white rounded-lg"
                    >
                        Return to Login
                    </button>
                </div>
            </div>
        );
    }

    // Enhanced error state handling
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center">
                <div className="max-w-md mx-auto text-center bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-8">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Dashboard Error</h2>
                    <p className="text-red-600 mb-6">{error}</p>
                    <div className="space-y-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full px-4 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white rounded-lg transition-all duration-200"
                        >
                            Refresh Page
                        </button>
                        <button
                            onClick={onLogout}
                            className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                        >
                            Return to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Enhanced loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
                        <span className="text-slate-700 font-medium">Loading your dashboard...</span>
                    </div>
                    <p className="text-sm text-slate-500">
                        {user?.patient_id ? 'Fetching your health data...' : 'Validating session...'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-sky-200/20 to-cyan-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-sky-200/20 rounded-full blur-3xl"></div>
            </div>

            {/* Top Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo and Brand */}
                        <div className="flex items-center space-x-3">
                            <PulsePointLogo className="w-10 h-10" />
                            <div>
                                <h1 className="text-xl font-bold text-slate-800">Pulse Point</h1>
                                <p className="text-xs text-slate-500">Healthcare Portal</p>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${tab.active
                                            ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md'
                                            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Right Side - Notifications, Profile, Logout */}
                        <div className="flex items-center space-x-4">
                            <button className="relative p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
                                <Bell className="w-5 h-5" />
                                {notifications > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {notifications}
                                    </span>
                                )}
                            </button>

                            <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>

                            <button
                                onClick={onLogout}
                                className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="text-sm font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                {/* Enhanced Profile Card with null safety */}
                <ProfileCard
                    patient={patient}
                    onPatientUpdate={handlePatientUpdate}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    {/* Health Log Section */}
                    <div className="lg:col-span-1">
                        <HealthLogSection
                            healthLogs={healthLogs}
                            onUpdate={fetchHealthLogs}
                            patientId={user?.patient_id}
                        />
                    </div>

                    {/* Graph Section */}
                    <div className="lg:col-span-2">
                        <GraphSection healthLogs={healthLogs} />
                    </div>
                </div>

                {/* Medical Documents Section */}
                <MedicalDocumentsSection />
            </div>
        </div>
    );
}

export default PatientDashboard;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Bell, LogOut, User } from 'lucide-react';
// import ProfileCard from './ProfileCard';
// import HealthLogSection from './HealthLogSection';
// import GraphSection from './GraphSection';
// import MedicalDocumentsSection from './MedicalDocumentsSection';

// // Pulse Point Logo Component
// const PulsePointLogo = ({ className = "w-8 h-8" }) => (
//   <div className={`${className} flex items-center justify-center`}>
//     <svg viewBox="0 0 100 100" className="w-full h-full">
//       <defs>
//         <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
//           <stop offset="0%" stopColor="#38bdf8" />
//           <stop offset="100%" stopColor="#22d3ee" />
//         </linearGradient>
//       </defs>
//       <circle cx="50" cy="50" r="45" fill="url(#pulseGradient)" />
//       <path
//         d="M25 50 L35 50 L40 35 L45 65 L50 40 L55 60 L60 45 L65 50 L75 50"
//         stroke="white"
//         strokeWidth="3"
//         fill="none"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <circle cx="50" cy="50" r="4" fill="white" />
//     </svg>
//   </div>
// );

// function PatientDashboard({ user, onLogout }) {
//   const [patient, setPatient] = useState(null);
//   const [healthLogs, setHealthLogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [notifications] = useState(3);

//   // Navigation tabs
//   const navTabs = [
//     { id: 'dashboard', label: 'Dashboard', active: true },
//     { id: 'doctors', label: 'Doctors', active: false },
//     { id: 'departments', label: 'Departments', active: false },
//     { id: 'appointments', label: 'Book Appointment', active: false },
//     { id: 'articles', label: 'Health Articles', active: false },
//   ];

//   useEffect(() => {
//     fetchPatientData();
//     fetchHealthLogs();
//     // eslint-disable-next-line
//   }, []);

//   const fetchPatientData = async () => {
//     try {
//       const response = await axios.get(`/api/patients/${user.patient_id}`);
//       setPatient(response.data);
//     } catch (error) {
//       console.error('Error fetching patient data:', error);
//     }
//   };

//   const fetchHealthLogs = async () => {
//     try {
//       const response = await axios.get(`/api/health-logs/patient/${user.patient_id}`);
//       setHealthLogs(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching health logs:', error);
//       setLoading(false);
//     }
//   };

//   // Called by ProfileCard after successful edit
//   const handlePatientUpdate = (updatedPatient) => {
//     setPatient(updatedPatient);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center">
//         <div className="flex items-center space-x-3">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
//           <span className="text-slate-700 font-medium">Loading your dashboard...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
//       {/* Background Decorative Elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-sky-200/20 to-cyan-200/20 rounded-full blur-3xl"></div>
//         <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-sky-200/20 rounded-full blur-3xl"></div>
//       </div>

//       {/* Top Navigation Bar */}
//       <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             {/* Logo and Brand */}
//             <div className="flex items-center space-x-3">
//               <PulsePointLogo className="w-10 h-10" />
//               <div>
//                 <h1 className="text-xl font-bold text-slate-800">Pulse Point</h1>
//                 <p className="text-xs text-slate-500">Healthcare Portal</p>
//               </div>
//             </div>

//             {/* Navigation Tabs */}
//             <div className="hidden md:flex items-center space-x-1">
//               {navTabs.map((tab) => (
//                 <button
//                   key={tab.id}
//                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
//                     tab.active
//                       ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md'
//                       : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
//                   }`}
//                 >
//                   {tab.label}
//                 </button>
//               ))}
//             </div>

//             {/* Right Side - Notifications, Profile, Logout */}
//             <div className="flex items-center space-x-4">
//               <button className="relative p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
//                 <Bell className="w-5 h-5" />
//                 {notifications > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                     {notifications}
//                   </span>
//                 )}
//               </button>

//               <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full flex items-center justify-center">
//                 <User className="w-5 h-5 text-white" />
//               </div>

//               <button
//                 onClick={onLogout}
//                 className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//               >
//                 <LogOut className="w-4 h-4" />
//                 <span className="text-sm font-medium">Logout</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
//         {/* Profile Card (edit support) */}
//         <ProfileCard patient={patient} onPatientUpdate={handlePatientUpdate} />

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
//           {/* Health Log Section */}
//           <div className="lg:col-span-1">
//             <HealthLogSection healthLogs={healthLogs} onUpdate={fetchHealthLogs} />
//           </div>

//           {/* Graph Section */}
//           <div className="lg:col-span-2">
//             <GraphSection healthLogs={healthLogs} />
//           </div>
//         </div>

//         {/* Medical Documents Section */}
//         <MedicalDocumentsSection />
//       </div>
//     </div>
//   );
// }

// export default PatientDashboard;
