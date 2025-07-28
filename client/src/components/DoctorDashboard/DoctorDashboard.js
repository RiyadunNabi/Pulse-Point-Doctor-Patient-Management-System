import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { Bell, LogOut, User, Stethoscope } from 'lucide-react';
import DoctorProfileCard from './DoctorProfileCard';
import AppointmentStatsSection from './AppointmentStatsSection';
import RevenueSection from './RevenueSection';
import RatingsSection from './RatingsSection';
import ScheduleSection from './ScheduleSection';
import PatientAnalyticsSection from './PatientAnalyticsSection';
import UpcomingAppointmentsSection from './UpcomingAppointmentsSection';
import QuickStatsWidget from './QuickStatsWidget';
import HealthInsightsWidget from './HealthInsightsWidget';
import MedicalInsightsSection from './MedicalInsightsSection';
import ManageAppointments from './ManageAppointments/ManageAppointments';

// Pulse Point Logo Component (reused from PatientDashboard)
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

function DoctorDashboard({ user, onLogout }) {
    const navigate = useNavigate();
    // State management
    const [doctor, setDoctor] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [revenueData, setRevenueData] = useState(null);
    const [ratingsData, setRatingsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notifications] = useState(5);
    const [scheduleData, setScheduleData] = useState([]);
    const [showManageAppointments, setShowManageAppointments] = useState(false);

    // Updated navigation tabs with routing
    const navTabs = [
        { id: 'dashboard', label: 'Dashboard', path: '/doctordashboard', active: true },
        { id: 'appointments', label: 'Appointments', path: '/doctor-appointments', active: false },
        { id: 'patients', label: 'My Patients', path: '/doctor-patients', active: false },
        { id: 'schedule', label: 'Schedule', path: '/doctor-schedule', active: false },
        { id: 'articles', label: 'Health Articles', path: '/doctor-articles', active: false },
    ];

    // Handle tab navigation
    const handleTabClick = (tab) => {
        if (tab.id === 'appointments') {
            navigate('/doctor-appointments');
        } else if (tab.id === 'dashboard') {
            navigate('/doctordashboard');
        } else if (tab.id === 'patients') {
            navigate('/doctor-patients');
        }
        // Add other tab navigations as needed
    };

    // User validation
    useEffect(() => {
        if (!user || !user.doctor_id) {
            console.error('Invalid doctor data:', user);
            setError('Invalid doctor session. Please log in again.');
            if (onLogout) {
                onLogout();
            }
            return;
        }
    }, [user, onLogout]);

    // Fetch doctor profile data
    const fetchDoctorData = useCallback(async () => {
        if (!user?.doctor_id) {
            console.error('No doctor_id available');
            setError('Doctor ID not found. Please log in again.');
            return;
        }

        try {
            console.log('Fetching doctor data for ID:', user.doctor_id);
            const response = await axios.get(`/api/doctors/${user.doctor_id}`);
            console.log('Doctor data received:', response.data);

            setDoctor(response.data);
            setError('');
        } catch (error) {
            console.error('Error fetching doctor data:', error);
            if (error.response?.status === 404) {
                const basicDoctor = {
                    doctor_id: user.doctor_id,
                    user_id: user.user_id,
                    first_name: user.username || 'Doctor',
                    last_name: '',
                    gender: null,
                    bio: null,
                    consultation_fee: null,
                    license_no: null,
                    phone_no: null,
                    address: null,
                    avg_rating: null,
                    department_name: 'Unassigned',
                    email: user.email,
                    is_active: true,
                    isIncomplete: true
                };
                setDoctor(basicDoctor);
                setError('');
            } else if (error.response?.status === 401) {
                setError('Session expired. Please log in again.');
                onLogout();
            } else {
                setError('Failed to load doctor information. Please try refreshing the page.');
            }
        }
    }, [user?.doctor_id, user?.username, user?.email, user?.user_id, onLogout]);

    // Fetch appointments data
    const fetchAppointments = useCallback(async () => {
        if (!user?.doctor_id) {
            console.error('No doctor_id available for appointments');
            return;
        }

        try {
            console.log('Fetching appointments for doctor ID:', user.doctor_id);
            const response = await axios.get(`/api/appointments/doctor/${user.doctor_id}`);
            console.log('Appointments received:', response.data);
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    }, [user?.doctor_id]);

    // Fetch revenue data
    const fetchRevenueData = useCallback(async () => {
        if (!user?.doctor_id) return;

        try {
            const response = await axios.get(`/api/payments/doctor/${user.doctor_id}/revenue`);
            setRevenueData(response.data);
        } catch (error) {
            console.error('Error fetching revenue data:', error);
        }
    }, [user?.doctor_id]);

    // Fetch ratings data
    const fetchRatingsData = useCallback(async () => {
        if (!user?.doctor_id) return;

        try {
            const response = await axios.get(`/api/reviews/doctor/${user.doctor_id}`);
            setRatingsData(response.data);
        } catch (error) {
            console.error('Error fetching ratings data:', error);
        } finally {
            setLoading(false);
        }
    }, [user?.doctor_id]);

    // Fetch schedule data
    const fetchScheduleData = useCallback(async () => {
        if (!user?.doctor_id) return;

        try {
            const response = await axios.get(`/api/schedule/doctor/${user.doctor_id}`);
            setScheduleData(response.data);
        } catch (error) {
            console.error('Error fetching schedule data:', error);
        }
    }, [user?.doctor_id]);

    // Add to your main useEffect
    useEffect(() => {
        if (user?.doctor_id) {
            fetchDoctorData();
            fetchAppointments();
            fetchRevenueData();
            fetchRatingsData();
            fetchScheduleData(); // Add this line
        } else {
            setLoading(false);
        }
    }, [fetchDoctorData, fetchAppointments, fetchRevenueData, fetchRatingsData, fetchScheduleData, user?.doctor_id]);


    // Handle doctor profile update
    const handleDoctorUpdate = (updatedDoctor) => {
        if (updatedDoctor && updatedDoctor.doctor_id) {
            console.log('Doctor updated successfully:', updatedDoctor);
            setDoctor(updatedDoctor);
        } else {
            console.error('Invalid doctor update data:', updatedDoctor);
        }
    };

    const handleNavigateToManageAppointments = () => {
        setShowManageAppointments(true);
    };
    const handleBackFromManageAppointments = () => {
        setShowManageAppointments(false);
    };

    // Error handling
    if (!user || !user.doctor_id) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center">
                <div className="text-center bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Session Error</h2>
                    <p className="text-red-600 mb-6">Invalid doctor session. Please log in again.</p>
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

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center">
                <div className="max-w-md mx-auto text-center bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-8">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Stethoscope className="w-8 h-8 text-red-600" />
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
                        <span className="text-slate-700 font-medium">Loading your dashboard...</span>
                    </div>
                    <p className="text-sm text-slate-500">
                        {user?.doctor_id ? 'Fetching your practice data...' : 'Validating session...'}
                    </p>
                </div>
            </div>
        );
    }
    if (showManageAppointments) {
        return (
            <ManageAppointments
                doctorId={user.doctor_id}
                onBack={handleBackFromManageAppointments}
            />
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
                {/* Doctor Profile Card - Full Width */}
                <DoctorProfileCard
                    doctor={doctor}
                    onDoctorUpdate={handleDoctorUpdate}
                />

                {/* Appointment Overview - Full Width Horizontal Grid */}
                <div className="mt-8">
                    <AppointmentStatsSection
                        appointments={appointments}
                        onUpdate={fetchAppointments}
                        doctorId={user?.doctor_id}
                        layout="horizontal"
                        onNavigateToManage={() => navigate('/doctor-appointments')}
                    />
                </div>

                {/* Upcoming Appointments & Schedule Management */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    {/* Left: Upcoming Appointments */}
                    <div>
                        <UpcomingAppointmentsSection
                            appointments={appointments}
                            doctorId={user?.doctor_id}
                        />
                    </div>

                    {/* Right: Schedule Management */}
                    <div>
                        <ScheduleSection
                            doctorId={user?.doctor_id}
                        />
                    </div>
                </div>

                {/* Revenue Analytics with Side Widget */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
                    {/* Left: Quick Stats Widget (1/4 width) */}
                    <div className="lg:col-span-1">
                        <QuickStatsWidget
                            doctorId={user?.doctor_id}
                        />
                    </div>

                    {/* Right: Revenue Analytics with Charts (3/4 width) */}
                    <div className="lg:col-span-3">
                        <RevenueSection
                            revenueData={revenueData}
                            doctorId={user?.doctor_id}
                            layout="expanded" // New prop for larger chart area
                        />
                    </div>
                </div>

                {/* Patient Analytics with Side Widget */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
                    {/* Left: Health Insights Widget (1/4 width) */}
                    <div className="lg:col-span-1">
                        <HealthInsightsWidget
                            doctorId={user?.doctor_id}
                        />
                    </div>

                    {/* Right: Patient Analytics with Charts (3/4 width) */}
                    <div className="lg:col-span-3">
                        <PatientAnalyticsSection
                            doctorId={user?.doctor_id}
                            layout="expanded" // New prop for chart display
                        />
                    </div>
                </div>

                {/* Bottom Row - Reviews & Additional Feature */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    {/* Left: Ratings and Reviews (Half Width) */}
                    <RatingsSection
                        ratingsData={ratingsData}
                        doctorId={user?.doctor_id}
                    />

                    {/* Right: Medical Insights Dashboard (Half Width) */}
                    <MedicalInsightsSection
                        doctorId={user?.doctor_id}
                    />
                </div>
            </div>
        </div>
    );
}

export default DoctorDashboard;


/*
{Bottom Row - Reviews & Additional Feature }
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Left: Ratings and Reviews (Half Width)}
        <RatingsSection 
            ratingsData={ratingsData} 
            doctorId={user?.doctor_id}
        />

        {/* Right: Medical Insights Dashboard (Half Width) }
        <MedicalInsightsSection 
            doctorId={user?.doctor_id}
        />
    </div>
*/