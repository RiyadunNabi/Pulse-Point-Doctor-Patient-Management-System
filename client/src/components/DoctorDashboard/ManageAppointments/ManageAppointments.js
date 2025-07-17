import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Bell, LogOut, Stethoscope } from 'lucide-react';
import AppointmentCard from './AppointmentCard';
import AppointmentFilters from './AppointmentFilters';
import AppointmentTabs from './AppointmentTabs';
import PatientDetailsModal from './PatientDetailsModal/PatientDetailsModal';

// PulsePointLogo component
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

const ManageAppointments = ({ doctorId, user, onLogout }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('pending');
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [statusCounts, setStatusCounts] = useState({
        pending: 0,
        completed: 0,
        cancelled: 0
    });
    const [notifications] = useState(5);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showPatientModal, setShowPatientModal] = useState(false);

    // Navigation tabs
    const navTabs = [
        { id: 'dashboard', label: 'Dashboard', path: '/doctordashboard', active: false },
        { id: 'appointments', label: 'Appointments', path: '/doctor-appointments', active: true },
        { id: 'patients', label: 'My Patients', path: '/doctor-patients', active: false },
        { id: 'schedule', label: 'Schedule', path: '/doctor-schedule', active: false },
        { id: 'articles', label: 'Health Articles', path: '/doctor-articles', active: false },
    ];

    // Handle tab navigation
    const handleTabClick = (tab) => {
        if (tab.id === 'dashboard') {
            navigate('/doctordashboard');
        } else if (tab.id === 'appointments') {
            navigate('/doctor-appointments');
        }
    };

    // Fetch appointments by status
    const fetchAppointments = async (status) => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/appointments/doctor/${doctorId}/status/${status}`);
            setAppointments(response.data);
        } catch (error) {
            console.error(`Error fetching ${status} appointments:`, error);
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch status counts
    const fetchStatusCounts = async () => {
        try {
            const { data } = await axios.get(`/api/appointments/doctor/${doctorId}/stats`);
            setStatusCounts({
                pending: data.pending_count,
                completed: data.completed_count,
                cancelled: data.cancelled_count
            });
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (doctorId) {
            fetchAppointments(activeTab);
            fetchStatusCounts();
        }
    }, [activeTab, doctorId]);

    // Handle appointment status update
    const handleStatusUpdate = async (appointmentId, newStatus) => {
        try {
            await axios.patch(`/api/appointments/${appointmentId}`, { status: newStatus });
            await fetchAppointments(activeTab);
            await fetchStatusCounts();
        } catch (error) {
            console.error('Error updating appointment status:', error);
        }
    };

    // Handle patient details view
    const handleViewPatientDetails = (appointment) => {
        setSelectedPatient(appointment);
        setShowPatientModal(true);
    };

    // Filter appointments
    const filteredAppointments = appointments.filter(appointment => {
        const matchesSearch = searchTerm === '' ||
            `${appointment.patient_first_name} ${appointment.patient_last_name}`
                .toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.patient_phone?.includes(searchTerm) ||
            appointment.patient_email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDate = selectedDate === '' ||
            appointment.appointment_date === selectedDate;

        return matchesSearch && matchesDate;
    });

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
                                <p className="text-xs text-slate-500">Doctor Portal</p>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabClick(tab)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        tab.active
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
                                <Stethoscope className="w-5 h-5 text-white" />
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
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Manage Appointments</h1>
                    <p className="text-slate-600">View and manage your patient appointments</p>
                </div>

                {/* Main Content Card */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
                    {/* Appointment Tabs */}
                    <AppointmentTabs 
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        statusCounts={statusCounts}
                    />

                    {/* Filters */}
                    <AppointmentFilters
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                    />

                    {/* Appointments List */}
                    <div className="p-6">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
                                <span className="ml-3 text-slate-600">Loading appointments...</span>
                            </div>
                        ) : filteredAppointments.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No {activeTab} appointments found
                                </h3>
                                <p className="text-gray-500">
                                    {searchTerm || selectedDate
                                        ? 'Try adjusting your search filters'
                                        : `You don't have any ${activeTab} appointments yet.`
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredAppointments.map((appointment) => (
                                    <AppointmentCard
                                        key={appointment.appointment_id}
                                        appointment={appointment}
                                        onStatusUpdate={handleStatusUpdate}
                                        onViewPatientDetails={handleViewPatientDetails}
                                        currentStatus={activeTab}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Patient Details Modal */}
            {showPatientModal && selectedPatient && (
                <PatientDetailsModal
                    patient={selectedPatient}
                    onClose={() => {
                        setShowPatientModal(false);
                        setSelectedPatient(null);
                    }}
                />
            )}
        </div>
    );
};

export default ManageAppointments;


// // client\src\components\DoctorDashboard\ManageAppointments.js
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//     Calendar,
//     Clock,
//     User,
//     Phone,
//     Mail,
//     ArrowLeft,
//     Filter,
//     Search,
//     Bell,
//     LogOut,
//     Stethoscope
// } from 'lucide-react';

// // Import your PulsePointLogo component
// const PulsePointLogo = ({ className = "w-8 h-8" }) => (
//     <div className={`${className} flex items-center justify-center`}>
//         <svg viewBox="0 0 100 100" className="w-full h-full">
//             <defs>
//                 <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
//                     <stop offset="0%" stopColor="#38bdf8" />
//                     <stop offset="100%" stopColor="#22d3ee" />
//                 </linearGradient>
//             </defs>
//             <circle cx="50" cy="50" r="45" fill="url(#pulseGradient)" />
//             <path
//                 d="M25 50 L35 50 L40 35 L45 65 L50 40 L55 60 L60 45 L65 50 L75 50"
//                 stroke="white"
//                 strokeWidth="3"
//                 fill="none"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//             />
//             <circle cx="50" cy="50" r="4" fill="white" />
//         </svg>
//     </div>
// );

// const ManageAppointments = ({ doctorId, onBack }) => {
//     const navigate = useNavigate();
//     const [activeTab, setActiveTab] = useState('pending');
//     const [appointments, setAppointments] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [selectedDate, setSelectedDate] = useState('');
//     const [statusCounts, setStatusCounts] = useState({
//         pending: 0,
//         completed: 0,
//         cancelled: 0
//     });
//     const [notifications] = useState(5);

//     // Navigation tabs
//     const navTabs = [
//         { id: 'dashboard', label: 'Dashboard', path: '/doctordashboard', active: false },
//         { id: 'appointments', label: 'Appointments', path: '/doctor-appointments', active: true },
//         { id: 'patients', label: 'My Patients', path: '/doctor-patients', active: false },
//         { id: 'schedule', label: 'Schedule', path: '/doctor-schedule', active: false },
//         { id: 'articles', label: 'Health Articles', path: '/doctor-articles', active: false },
//     ];

//     const tabs = [
//         { id: 'pending', label: 'Pending', color: 'from-amber-500 to-orange-500' },
//         { id: 'completed', label: 'Completed', color: 'from-green-500 to-emerald-500' },
//         { id: 'cancelled', label: 'Cancelled', color: 'from-red-500 to-rose-500' }
//     ];

//     // Handle tab navigation
//     const handleTabClick = (tab) => {
//         if (tab.id === 'dashboard') {
//             navigate('/doctordashboard');
//         } else if (tab.id === 'appointments') {
//             navigate('/doctor-appointments');
//         }
//         // Add other tab navigations as needed
//     };

//     // Fetch appointments by status
//     const fetchAppointments = async (status) => {
//         setLoading(true);
//         try {
//             const response = await axios.get(`/api/appointments/doctor/${doctorId}/status/${status}`);
//             setAppointments(response.data);
//         } catch (error) {
//             console.error(`Error fetching ${status} appointments:`, error);
//             setAppointments([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (doctorId) {
//             fetchAppointments(activeTab);
//         }
//     }, [activeTab, doctorId]);

//     useEffect(() => {
//         const fetchCounts = async () => {
//             try {
//                 const { data } = await axios.get(
//                     `/api/appointments/doctor/${doctorId}/stats`
//                 );
//                 setStatusCounts({
//                     pending: data.pending_count,
//                     completed: data.completed_count,
//                     cancelled: data.cancelled_count
//                 });
//             } catch (err) {
//                 console.error(err);
//             }
//         };
//         if (doctorId) fetchCounts();
//     }, [doctorId]);

//     // Handle appointment status update
//     const handleStatusUpdate = async (appointmentId, newStatus) => {
//         try {
//             await axios.patch(`/api/appointments/${appointmentId}`, { status: newStatus });
//             fetchAppointments(activeTab);

//             // Refresh status counts
//             const { data } = await axios.get(`/api/appointments/doctor/${doctorId}/stats`);
//             setStatusCounts({
//                 pending: data.pending_count,
//                 completed: data.completed_count,
//                 cancelled: data.cancelled_count
//             });
//         } catch (error) {
//             console.error('Error updating appointment status:', error);
//         }
//     };

//     // Filter appointments based on search and date
//     const filteredAppointments = appointments.filter(appointment => {
//         const matchesSearch = searchTerm === '' ||
//             `${appointment.patient_first_name} ${appointment.patient_last_name}`
//                 .toLowerCase().includes(searchTerm.toLowerCase()) ||
//             appointment.patient_phone?.includes(searchTerm) ||
//             appointment.patient_email?.toLowerCase().includes(searchTerm.toLowerCase());

//         const matchesDate = selectedDate === '' ||
//             appointment.appointment_date === selectedDate;

//         return matchesSearch && matchesDate;
//     });

//     const formatDate = (dateString) => {
//         return new Date(dateString).toLocaleDateString('en-US', {
//             weekday: 'short',
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric'
//         });
//     };

//     const formatTime = (timeString) => {
//         return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
//             hour: 'numeric',
//             minute: '2-digit',
//             hour12: true
//         });
//     };

//     const getStatusBadge = (status) => {
//         const statusConfig = {
//             pending: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Pending' },
//             completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
//             cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' }
//         };

//         const config = statusConfig[status] || statusConfig.pending;
//         return (
//             <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
//                 {config.label}
//             </span>
//         );
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
//             {/* Header */}
//             <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-4">
//                             <button
//                                 onClick={onBack}
//                                 className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
//                             >
//                                 <ArrowLeft className="w-5 h-5" />
//                             </button>
//                             <div>
//                                 <h1 className="text-2xl font-bold text-slate-800">Manage Appointments</h1>
//                                 <p className="text-slate-600">View and manage your patient appointments</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 {/* Tabs */}
//                 <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
//                     <div className="border-b border-gray-200">
//                         <nav className="flex space-x-8 px-6">
//                             {tabs.map((tab) => (
//                                 <button
//                                     key={tab.id}
//                                     onClick={() => setActiveTab(tab.id)}
//                                     className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
//                                         ? 'border-sky-500 text-sky-600'
//                                         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                                         }`}
//                                 >
//                                     {tab.label}
//                                     <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
//                                         {statusCounts[tab.id] || 0}
//                                     </span>
//                                 </button>
//                             ))}
//                         </nav>
//                     </div>

//                     {/* Filters */}
//                     <div className="p-6 border-b border-gray-200 bg-gray-50/50">
//                         <div className="flex flex-col sm:flex-row gap-4">
//                             <div className="flex-1">
//                                 <div className="relative">
//                                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                                     <input
//                                         type="text"
//                                         placeholder="Search by patient name, phone, or email..."
//                                         value={searchTerm}
//                                         onChange={(e) => setSearchTerm(e.target.value)}
//                                         className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
//                                     />
//                                 </div>
//                             </div>
//                             <div className="sm:w-48">
//                                 <input
//                                     type="date"
//                                     value={selectedDate}
//                                     onChange={(e) => setSelectedDate(e.target.value)}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
//                                 />
//                             </div>
//                             <button
//                                 onClick={() => {
//                                     setSearchTerm('');
//                                     setSelectedDate('');
//                                 }}
//                                 className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
//                             >
//                                 Clear
//                             </button>
//                         </div>
//                     </div>

//                     {/* Appointments List */}
//                     <div className="p-6">
//                         {loading ? (
//                             <div className="flex items-center justify-center py-12">
//                                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
//                                 <span className="ml-3 text-slate-600">Loading appointments...</span>
//                             </div>
//                         ) : filteredAppointments.length === 0 ? (
//                             <div className="text-center py-12">
//                                 <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                                 <h3 className="text-lg font-medium text-gray-900 mb-2">
//                                     No {activeTab} appointments found
//                                 </h3>
//                                 <p className="text-gray-500">
//                                     {searchTerm || selectedDate
//                                         ? 'Try adjusting your search filters'
//                                         : `You don't have any ${activeTab} appointments yet.`
//                                     }
//                                 </p>
//                             </div>
//                         ) : (
//                             <div className="space-y-4">
//                                 {filteredAppointments.map((appointment) => (
//                                     <AppointmentCard
//                                         key={appointment.appointment_id}
//                                         appointment={appointment}
//                                         onStatusUpdate={handleStatusUpdate}
//                                         currentStatus={activeTab}
//                                     />
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // Individual Appointment Card Component
// const AppointmentCard = ({ appointment, onStatusUpdate, currentStatus }) => {
//     const [showDetails, setShowDetails] = useState(false);

//     const getActionButtons = () => {
//         const buttons = [];

//         if (currentStatus === 'pending') {
//             buttons.push(
//                 <button
//                     key="complete"
//                     onClick={() => onStatusUpdate(appointment.appointment_id, 'completed')}
//                     className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors"
//                 >
//                     Mark Complete
//                 </button>
//             );
//             buttons.push(
//                 <button
//                     key="cancel"
//                     onClick={() => onStatusUpdate(appointment.appointment_id, 'cancelled')}
//                     className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-colors"
//                 >
//                     Cancel
//                 </button>
//             );
//         }

//         return buttons;
//     };

//     return (
//         <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
//             <div className="p-6">
//                 <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                         <div className="flex items-center space-x-3 mb-3">
//                             <div className="w-10 h-10 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full flex items-center justify-center">
//                                 <User className="w-5 h-5 text-white" />
//                             </div>
//                             <div>
//                                 <h3 className="font-semibold text-slate-800">
//                                     {appointment.patient_first_name} {appointment.patient_last_name}
//                                 </h3>
//                                 <div className="flex items-center space-x-4 text-sm text-slate-600">
//                                     <span className="flex items-center">
//                                         <Calendar className="w-4 h-4 mr-1" />
//                                         {formatDate(appointment.appointment_date)}
//                                     </span>
//                                     <span className="flex items-center">
//                                         <Clock className="w-4 h-4 mr-1" />
//                                         {formatTime(appointment.appointment_time)}
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>

//                         {appointment.reason && (
//                             <p className="text-sm text-slate-600 mb-3">
//                                 <strong>Reason:</strong> {appointment.reason}
//                             </p>
//                         )}

//                         <div className="flex items-center space-x-2 text-sm text-slate-600">
//                             <Phone className="w-4 h-4" />
//                             <span>{appointment.patient_phone || 'No phone'}</span>
//                             <Mail className="w-4 h-4 ml-4" />
//                             <span>{appointment.patient_email || 'No email'}</span>
//                         </div>
//                     </div>

//                     <div className="flex flex-col items-end space-y-2">
//                         {getStatusBadge(appointment.status)}
//                         <div className="flex space-x-2">
//                             <button
//                                 onClick={() => setShowDetails(!showDetails)}
//                                 className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
//                                 title="View Profile"
//                             >
//                                 <Eye className="w-4 h-4" />
//                             </button>
//                             <button
//                                 className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
//                                 title="Create Prescription"
//                             >
//                                 <FileText className="w-4 h-4" />
//                             </button>
//                         </div>
//                         <div className="flex space-x-2">
//                             {getActionButtons()}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Expanded Details */}
//                 {showDetails && (
//                     <div className="mt-4 pt-4 border-t border-gray-200">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                             <div>
//                                 <strong className="text-slate-700">Patient ID:</strong>
//                                 <span className="ml-2 text-slate-600">{appointment.patient_id}</span>
//                             </div>
//                             <div>
//                                 <strong className="text-slate-700">Gender:</strong>
//                                 <span className="ml-2 text-slate-600">{appointment.patient_gender || 'Not specified'}</span>
//                             </div>
//                             <div>
//                                 <strong className="text-slate-700">Date of Birth:</strong>
//                                 <span className="ml-2 text-slate-600">
//                                     {appointment.date_of_birth ? formatDate(appointment.date_of_birth) : 'Not specified'}
//                                 </span>
//                             </div>
//                             <div>
//                                 <strong className="text-slate-700">Appointment Created:</strong>
//                                 <span className="ml-2 text-slate-600">{formatDate(appointment.created_at)}</span>
//                             </div>
//                             {appointment.patient_address && (
//                                 <div className="md:col-span-2">
//                                     <strong className="text-slate-700">Address:</strong>
//                                     <span className="ml-2 text-slate-600">{appointment.patient_address}</span>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// const getStatusBadge = (status) => {
//     const statusConfig = {
//         pending: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Pending' },
//         completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
//         cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' }
//     };

//     const config = statusConfig[status] || statusConfig.pending;
//     return (
//         <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
//             {config.label}
//         </span>
//     );
// };

// const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//         weekday: 'short',
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//     });
// };

// const formatTime = (timeString) => {
//     return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
//         hour: 'numeric',
//         minute: '2-digit',
//         hour12: true
//     });
// };

// export default ManageAppointments;
