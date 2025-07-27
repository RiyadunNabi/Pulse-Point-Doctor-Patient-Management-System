// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Calendar, Bell, LogOut, Stethoscope } from 'lucide-react';
// import AppointmentCard from './AppointmentCard';
// import AppointmentFilters from './AppointmentFilters';
// import AppointmentTabs from './AppointmentTabs';
// import PatientDetailsModal from './PatientDetailsModal/PatientDetailsModal';

// // PulsePointLogo component
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

// const ManageAppointments = ({ doctorId, user, onLogout }) => {
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
//     const [selectedPatient, setSelectedPatient] = useState(null);
//     const [showPatientModal, setShowPatientModal] = useState(false);

//     // Navigation tabs
//     const navTabs = [
//         { id: 'dashboard', label: 'Dashboard', path: '/doctordashboard', active: false },
//         { id: 'appointments', label: 'Appointments', path: '/doctor-appointments', active: true },
//         { id: 'patients', label: 'My Patients', path: '/doctor-patients', active: false },
//         { id: 'schedule', label: 'Schedule', path: '/doctor-schedule', active: false },
//         { id: 'articles', label: 'Health Articles', path: '/doctor-articles', active: false },
//     ];

//     // Handle tab navigation
//     const handleTabClick = (tab) => {
//         if (tab.id === 'dashboard') {
//             navigate('/doctordashboard');
//         } else if (tab.id === 'appointments') {
//             navigate('/doctor-appointments');
//         }
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

//     // Fetch status counts
//     const fetchStatusCounts = async () => {
//         try {
//             const { data } = await axios.get(`/api/appointments/doctor/${doctorId}/stats`);
//             setStatusCounts({
//                 pending: data.pending_count,
//                 completed: data.completed_count,
//                 cancelled: data.cancelled_count
//             });
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     useEffect(() => {
//         if (doctorId) {
//             fetchAppointments(activeTab);
//             fetchStatusCounts();
//         }
//     }, [activeTab, doctorId]);

//     // Handle appointment status update
//     const handleStatusUpdate = async (appointmentId, newStatus) => {
//         try {
//             await axios.patch(`/api/appointments/${appointmentId}`, { status: newStatus });
//             await fetchAppointments(activeTab);
//             await fetchStatusCounts();
//         } catch (error) {
//             console.error('Error updating appointment status:', error);
//         }
//     };

//     // Handle patient details view
//     const handleViewPatientDetails = (appointment) => {
//         setSelectedPatient(appointment);
//         setShowPatientModal(true);
//     };

//     // Filter appointments
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

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
//             {/* Background Decorative Elements */}
//             <div className="absolute inset-0 overflow-hidden pointer-events-none">
//                 <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-sky-200/20 to-cyan-200/20 rounded-full blur-3xl"></div>
//                 <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-sky-200/20 rounded-full blur-3xl"></div>
//             </div>

//             {/* Top Navigation Bar */}
//             <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="flex justify-between items-center h-16">
//                         {/* Logo and Brand */}
//                         <div className="flex items-center space-x-3">
//                             <PulsePointLogo className="w-10 h-10" />
//                             <div>
//                                 <h1 className="text-xl font-bold text-slate-800">Pulse Point</h1>
//                                 <p className="text-xs text-slate-500">Doctor Portal</p>
//                             </div>
//                         </div>

//                         {/* Navigation Tabs */}
//                         <div className="hidden md:flex items-center space-x-1">
//                             {navTabs.map((tab) => (
//                                 <button
//                                     key={tab.id}
//                                     onClick={() => handleTabClick(tab)}
//                                     className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
//                                         tab.active
//                                             ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md'
//                                             : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
//                                     }`}
//                                 >
//                                     {tab.label}
//                                 </button>
//                             ))}
//                         </div>

//                         {/* Right Side - Notifications, Profile, Logout */}
//                         <div className="flex items-center space-x-4">
//                             <button className="relative p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
//                                 <Bell className="w-5 h-5" />
//                                 {notifications > 0 && (
//                                     <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                                         {notifications}
//                                     </span>
//                                 )}
//                             </button>

//                             <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full flex items-center justify-center">
//                                 <Stethoscope className="w-5 h-5 text-white" />
//                             </div>

//                             <button
//                                 onClick={onLogout}
//                                 className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                             >
//                                 <LogOut className="w-4 h-4" />
//                                 <span className="text-sm font-medium">Logout</span>
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </nav>

//             {/* Main Content */}
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
//                 {/* Page Header */}
//                 <div className="mb-8">
//                     <h1 className="text-3xl font-bold text-slate-800 mb-2">Manage Appointments</h1>
//                     <p className="text-slate-600">View and manage your patient appointments</p>
//                 </div>

//                 {/* Main Content Card */}
//                 <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
//                     {/* Appointment Tabs */}
//                     <AppointmentTabs 
//                         activeTab={activeTab}
//                         setActiveTab={setActiveTab}
//                         statusCounts={statusCounts}
//                     />

//                     {/* Filters */}
//                     <AppointmentFilters
//                         searchTerm={searchTerm}
//                         setSearchTerm={setSearchTerm}
//                         selectedDate={selectedDate}
//                         setSelectedDate={setSelectedDate}
//                     />

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
//                                         onViewPatientDetails={handleViewPatientDetails}
//                                         currentStatus={activeTab}
//                                     />
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Patient Details Modal */}
//             {showPatientModal && selectedPatient && (
//                 <PatientDetailsModal
//                     patient={selectedPatient}
//                     onClose={() => {
//                         setShowPatientModal(false);
//                         setSelectedPatient(null);
//                     }}
//                 />
//             )}
//         </div>
//     );
// };

// export default ManageAppointments;



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Bell, LogOut, Stethoscope, TestTube, CreditCard } from 'lucide-react';
import AppointmentCard from './AppointmentCard';
import AppointmentFilters from './AppointmentFilters';
import AppointmentTabs from './AppointmentTabs';
import PatientDetailsModal from './PatientDetailsModal/PatientDetailsModal';
import InvestigationReportModal from './InvestigationReportModal/InvestigationReportModal';
import PaymentTabs from './PaymentManagement/PaymentTabs';
import PaymentAppointmentCard from './PaymentManagement/PaymentAppointmentCard';

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
    const [activePaymentTab, setActivePaymentTab] = useState('paid');
    const [appointments, setAppointments] = useState([]);
    const [investigationReportAppointments, setInvestigationReportAppointments] = useState([]);
    const [paymentAppointments, setPaymentAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [statusCounts, setStatusCounts] = useState({
        pending: 0,
        completed: 0,
        cancelled: 0,
        investigation_reports: 0,
        paid: 0,
        unpaid: 0
    });
    // const [paymentCounts, setPaymentCounts] = useState({
    //     paid: 0,
    //     unpaid: 0
    // });
    const [notifications] = useState(5);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showPatientModal, setShowPatientModal] = useState(false);
    const [showInvestigationModal, setShowInvestigationModal] = useState(false);
    const [selectedInvestigationAppointment, setSelectedInvestigationAppointment] = useState(null);

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
        if (status === 'investigation-reports') {
            setLoading(true);
            try {
                const { data } = await axios.get(
                    `/api/appointments/doctor/${doctorId}/investigation-reports`
                );
                setInvestigationReportAppointments(data);
            } catch (err) {
                console.error('Error fetching investigation report appointments:', err);
                setInvestigationReportAppointments([]);
            } finally {
                setLoading(false);
            }
            return;
        }

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

    // Fetch appointments with investigation reports
    const fetchInvestigationReportAppointments = async () => {
        setLoading(true);
        try {
            const appointmentsResponse = await axios.get(`/api/appointments/doctor/${doctorId}/status/completed`);
            const completedAppointments = appointmentsResponse.data;

            const appointmentsWithReports = [];
            for (const appointment of completedAppointments) {
                try {
                    const prescriptionResponse = await axios.get(`/api/prescriptions/appointment/${appointment.appointment_id}`);
                    if (prescriptionResponse.data?.prescription_id) {
                        const reportsResponse = await axios.get(`/api/investigation-reports/prescription/${prescriptionResponse.data.prescription_id}`);
                        if (reportsResponse.data && reportsResponse.data.length > 0) {
                            appointmentsWithReports.push({
                                ...appointment,
                                investigation_count: reportsResponse.data.length
                            });
                        }
                    }
                } catch (error) {
                    continue;
                }
            }

            setInvestigationReportAppointments(appointmentsWithReports);
        } catch (error) {
            console.error('Error fetching investigation report appointments:', error);
            setInvestigationReportAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    // FIXED: Use the aggregated backend endpoint
    const fetchPaymentAppointments = async (paymentStatus) => {
        setLoading(true);
        try {
            const { data } = await axios.get(
                `/api/payments/doctor/${doctorId}/appointments/${paymentStatus}`
            );
            // data is an array of appointment + payment columns
            setPaymentAppointments(data);
        } catch (error) {
            console.error('Error fetching payment appointments:', error);
            setPaymentAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    // // FIXED: Use the aggregated backend endpoint
    // const fetchPaymentCounts = async () => {
    //     try {
    //         const { data } = await axios.get(
    //             `/api/payments/doctor/${doctorId}/counts`
    //         );
    //         // data === { paid: X, unpaid: Y }
    //         setPaymentCounts({ paid: data.paid, unpaid: data.unpaid });
    //         setStatusCounts(prev => ({
    //             ...prev,
    //             paid: data.paid,
    //             unpaid: data.unpaid,
    //         }));
    //     } catch (error) {
    //         console.error('Error fetching payment counts:', error);
    //     }
    // };


    // // Fetch status counts
    // const fetchStatusCounts = async () => {
    //     try {
    //         const { data } = await axios.get(`/api/appointments/doctor/${doctorId}/stats`);

    //         const completedResponse = await axios.get(`/api/appointments/doctor/${doctorId}/status/completed`);
    //         let investigationReportsCount = 0;

    //         for (const appointment of completedResponse.data) {
    //             try {
    //                 const prescriptionResponse = await axios.get(`/api/prescriptions/appointment/${appointment.appointment_id}`);
    //                 if (prescriptionResponse.data?.prescription_id) {
    //                     const reportsResponse = await axios.get(`/api/investigation-reports/prescription/${prescriptionResponse.data.prescription_id}`);
    //                     if (reportsResponse.data && reportsResponse.data.length > 0) {
    //                         investigationReportsCount++;
    //                     }
    //                 }
    //             } catch (error) {
    //                 continue;
    //             }
    //         }

    //         setStatusCounts(prev => ({
    //             ...prev,
    //             pending: data.pending_count,
    //             completed: data.completed_count,
    //             cancelled: data.cancelled_count,
    //             investigation_reports: investigationReportsCount,
    //         }));
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };


    const fetchStatusCounts = async () => {
        try {
            const { data } = await axios.get(
                `/api/appointments/doctor/${doctorId}/stats`
            );
            // data.pending_count, data.completed_count, etc.
            setStatusCounts({
                pending: data.pending_count,
                completed: data.completed_count,
                cancelled: data.cancelled_count,
                paid: data.paid_count,
                unpaid: data.unpaid_count,
                investigation_reports: data.investigation_reports_count
            });
        } catch (err) {
            console.error('Error fetching status counts:', err);
        }
    };


    useEffect(() => {
        if (!doctorId) return;

        if (activeTab === 'payments') {
            fetchPaymentAppointments(activePaymentTab);
        } else {
            fetchAppointments(activeTab);
        }
        fetchStatusCounts();
    }, [activeTab, activePaymentTab, doctorId]);

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

    // Handle investigation reports view
    const handleViewInvestigationReports = (appointment) => {
        setSelectedInvestigationAppointment(appointment);
        setShowInvestigationModal(true);
    };

    // Get current appointments based on active tab
    const getCurrentAppointments = () => {
        if (activeTab === 'investigation-reports') {
            return investigationReportAppointments;
        } else if (activeTab === 'payments') {
            return paymentAppointments;
        }
        return appointments;
    };

    // Filter appointments
    const filteredAppointments = getCurrentAppointments().filter(appointment => {
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

                    {/* Payment Subtabs - Show only when payments tab is active */}
                    {activeTab === 'payments' && (
                        <PaymentTabs
                            activePaymentTab={activePaymentTab}
                            setActivePaymentTab={setActivePaymentTab}
                            paidCount={statusCounts.paid}
                            unpaidCount={statusCounts.unpaid}
                        />
                    )}

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
                        ) : activeTab === 'payments' ? (
                            // Payment appointments view
                            paymentAppointments.length === 0 ? (
                                <div className="text-center py-12">
                                    <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No {activePaymentTab} appointments found
                                    </h3>
                                    <p className="text-gray-500">
                                        {searchTerm || selectedDate
                                            ? 'Try adjusting your search filters'
                                            : `No ${activePaymentTab} appointments available.`
                                        }
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {paymentAppointments.map((appointment) => (
                                        <PaymentAppointmentCard
                                            key={appointment.appointment_id}
                                            appointment={appointment}
                                            paymentInfo={appointment.paymentInfo}
                                        />
                                    ))}
                                </div>
                            )
                        ) : (
                            // Regular appointments view
                            filteredAppointments.length === 0 ? (
                                <div className="text-center py-12">
                                    {activeTab === 'investigation-reports' ? (
                                        <>
                                            <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                No investigation reports found
                                            </h3>
                                            <p className="text-gray-500">
                                                {searchTerm || selectedDate
                                                    ? 'Try adjusting your search filters'
                                                    : `No patients have uploaded investigation reports yet.`
                                                }
                                            </p>
                                        </>
                                    ) : (
                                        <>
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
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredAppointments.map((appointment) => (
                                        <AppointmentCard
                                            key={appointment.appointment_id}
                                            appointment={appointment}
                                            onStatusUpdate={handleStatusUpdate}
                                            onViewPatientDetails={handleViewPatientDetails}
                                            onViewInvestigationReports={handleViewInvestigationReports}
                                            currentStatus={activeTab}
                                            showInvestigationButton={activeTab === 'investigation-reports'}
                                        />
                                    ))}
                                </div>
                            )
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

            {/* Investigation Report Modal */}
            {showInvestigationModal && selectedInvestigationAppointment && (
                <InvestigationReportModal
                    isOpen={showInvestigationModal}
                    onClose={() => {
                        setShowInvestigationModal(false);
                        setSelectedInvestigationAppointment(null);
                    }}
                    appointment={selectedInvestigationAppointment}
                />
            )}
        </div>
    );
};

export default ManageAppointments;
