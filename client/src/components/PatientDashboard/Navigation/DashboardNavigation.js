// client/src/components/PatientDashboard/Navigation/DashboardNavigation.js

import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import PulsePointBrand from '../../shared/PulsePointBrand/PulsePointBrand';
import { NAV_TABS } from '../utils/constants';
import NotificationDropdown from '../../shared/NotificationDropdown';

const DashboardNavigation = ({
    activeTab,
    onTabClick,
    onLogout,
    user
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Debug: Log user prop
  console.log('DashboardNavigation user prop:', user);

    const handleTabClick = (tab) => {
        if (tab.route) {
            navigate(tab.route);
        } else if (tab.id === 'appointments') {
            navigate('/patient-appointments'); // Add this line
        } else {
            onTabClick(tab.id);
        }
    };

    const getActiveTab = () => {
        if (location.pathname === '/doctors') return 'doctors';
        if (location.pathname === '/departments') return 'departments';
        if (location.pathname === '/patient-appointments') return 'appointments'; // Add this line
        return activeTab;
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <PulsePointBrand className="w-14 h-14" showText={true} userRole="patient"/>

                    {/* Navigation Tabs */}
                    <div className="hidden md:flex items-center space-x-1">
                        {NAV_TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabClick(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${getActiveTab() === tab.id
                                        ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md'
                                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

            
                    {/* Right Side - Notifications, Profile, Logout */}
                    <div className="flex items-center space-x-2">
                        <NotificationDropdown user={user} />

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

export default DashboardNavigation;
