// client/src/components/DoctorDashboard/Navigation/DoctorNavigation.js

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Stethoscope, DollarSign } from 'lucide-react';
import PulsePointBrand from '../../shared/PulsePointBrand/PulsePointBrand';
import NotificationDropdown from '../../shared/NotificationDropdown';

const DoctorNavigation = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navTabs = [
    { id: 'dashboard', label: 'Dashboard', path: '/doctordashboard' },
    { id: 'appointments', label: 'Appointments', path: '/doctor-appointments' },
    { id: 'patients', label: 'My Patients', path: '/doctor-patients' },
    { id: 'revenue', label: 'Revenue', path: '/doctor-revenue', icon: DollarSign },
    { id: 'articles', label: 'Health Articles', path: '/doctor-articles' },
  ];

  const handleTabClick = (tab) => {
    navigate(tab.path);
  };

  const isTabActive = (path) => {
    if (path === '/doctordashboard') {
      return location.pathname === '/doctordashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-gradient-to-r from-emerald-50 to-teal-50/30 backdrop-blur-sm border-b border-emerald-200/60 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 transform hover:scale-105 transition-transform duration-200">
            <PulsePointBrand 
              className="w-12 h-12" 
              showText={true} 
              userRole="doctor" 
            />
          </div>

          {/* Navigation Tabs */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              {navTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  className={`
                    relative flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium 
                    transition-all duration-300 ease-in-out transform hover:scale-105
                    ${isTabActive(tab.path)
                      ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/25 scale-105'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-white/60 hover:shadow-md backdrop-blur-sm'
                    }
                    active:scale-95
                  `}
                >
                  {tab.icon && <tab.icon className="w-4 h-4" />}
                  <span className="relative z-10">{tab.label}</span>
                  {isTabActive(tab.path) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-xl opacity-20 animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <div className="relative">
              <NotificationDropdown user={user} />
            </div>

            {/* Doctor Profile */}
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-200">
              <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-slate-700">
                  {user?.username || 'Doctor'}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="
                flex items-center space-x-2 px-4 py-2.5 rounded-xl
                text-sm font-medium text-red-600 
                bg-red-50/80 hover:bg-red-100/80 
                backdrop-blur-sm border border-red-200/50
                transition-all duration-200 
                hover:scale-105 active:scale-95
                hover:shadow-md hover:shadow-red-500/10
              "
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-emerald-200/60 bg-white/50 backdrop-blur-sm">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`
                flex items-center space-x-2 w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200
                ${isTabActive(tab.path)
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-white/80'
                }
              `}
            >
              {tab.icon && <tab.icon className="w-4 h-4" />}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default DoctorNavigation;
