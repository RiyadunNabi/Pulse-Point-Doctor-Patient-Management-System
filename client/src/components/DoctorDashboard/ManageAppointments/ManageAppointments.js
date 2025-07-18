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
