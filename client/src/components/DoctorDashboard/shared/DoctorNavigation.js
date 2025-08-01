// client/src/components/DoctorDashboard/Navigation/DoctorNavigation.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Stethoscope, Currency } from 'lucide-react';
import PulsePointBrand from '../../shared/PulsePointBrand/PulsePointBrand';
import NotificationDropdown from '../../shared/NotificationDropdown';

const DoctorNavigation = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Navigation tabs with active state detection
    const navTabs = [
        { id: 'dashboard', label: 'Dashboard', path: '/doctordashboard' },
        { id: 'appointments', label: 'Appointments', path: '/doctor-appointments' },
        { id: 'patients', label: 'My Patients', path: '/doctor-patients' },
        { id: 'revenue', label: 'Revenue', path: '/doctor-revenue', icon: Currency },    
        // { id: 'schedule', label: 'Schedule', path: '/doctor-schedule' },
        { id: 'articles', label: 'Health Articles', path: '/doctor-articles' },
    ];

    // Handle tab navigation
    const handleTabClick = (tab) => {
        navigate(tab.path);
    };

    // Check if tab is active based on current location
    const isTabActive = (path) => {
        if (path === '/doctordashboard') {
            return location.pathname === '/doctordashboard';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and Brand */}
                    <PulsePointBrand className="w-14 h-14" showText={true} userRole="doctor"/>

                    {/* Navigation Tabs */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabClick(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    isTabActive(tab.path)
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
                        {/* Replace the old notification bell with NotificationDropdown */}
                        <NotificationDropdown user={user} />

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
    );
};

export default DoctorNavigation;
