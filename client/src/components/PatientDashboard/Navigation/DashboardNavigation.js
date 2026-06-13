// // client/src/components/PatientDashboard/Navigation/DashboardNavigation.js

// import React from 'react';
// import { LogOut } from 'lucide-react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import PulsePointBrand from '../../shared/PulsePointBrand/PulsePointBrand';
// import { NAV_TABS } from '../utils/constants';
// import NotificationDropdown from '../../shared/NotificationDropdown';

// const DashboardNavigation = ({
//     activeTab,
//     onTabClick,
//     onLogout,
//     user
// }) => {
//     const navigate = useNavigate();
//     const location = useLocation();

//     // Debug: Log user prop
//   console.log('DashboardNavigation user prop:', user);

//     const handleTabClick = (tab) => {
//         if (tab.route) {
//             navigate(tab.route);
//         } else if (tab.id === 'appointments') {
//             navigate('/patient-appointments'); // Add this line
//         } else {
//             onTabClick(tab.id);
//         }
//     };

//     const getActiveTab = () => {
//         if (location.pathname === '/doctors') return 'doctors';
//         if (location.pathname === '/departments') return 'departments';
//         if (location.pathname === '/patient-appointments') return 'appointments'; // Add this line
//         return activeTab;
//     };

//     return (
//         <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex justify-between items-center h-16">
//                     <PulsePointBrand className="w-14 h-14" showText={true} userRole="patient"/>

//                     {/* Navigation Tabs */}
//                     <div className="hidden md:flex items-center space-x-1">
//                         {NAV_TABS.map((tab) => (
//                             <button
//                                 key={tab.id}
//                                 onClick={() => handleTabClick(tab)}
//                                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${getActiveTab() === tab.id
//                                         ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md'
//                                         : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
//                                     }`}
//                             >
//                                 {tab.label}
//                             </button>
//                         ))}
//                     </div>

            
//                     {/* Right Side - Notifications, Profile, Logout */}
//                     <div className="flex items-center space-x-2">
//                         <NotificationDropdown user={user} />

//                         <button
//                             onClick={onLogout}
//                             className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                         >
//                             <LogOut className="w-4 h-4" />
//                             <span className="text-sm font-medium">Logout</span>
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default DashboardNavigation;



// client/src/components/PatientDashboard/Navigation/DashboardNavigation.js

import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import PulsePointBrand from '../../shared/PulsePointBrand/PulsePointBrand';
import { NAV_TABS } from '../utils/constants';
import NotificationDropdown from '../../shared/NotificationDropdown';
// import './DashboardNavigation.css';

const DashboardNavigation = ({
  activeTab,
  onTabClick,
  onLogout,
  user
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabClick = (tab) => {
    if (tab.route) {
      navigate(tab.route);
    } else if (tab.id === 'appointments') {
      navigate('/patient-appointments');
    } else {
      onTabClick(tab.id);
    }
  };

  const getActiveTab = () => {
    if (location.pathname === '/doctors') return 'doctors';
    if (location.pathname === '/departments') return 'departments';
    if (location.pathname === '/patient-appointments') return 'appointments';
    return activeTab;
  };

  return (
    <nav className="bg-gradient-to-r from-slate-50 to-blue-50/30 backdrop-blur-sm border-b border-slate-200/60 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 transform hover:scale-105 transition-transform duration-200">
            <PulsePointBrand 
              className="w-12 h-12" 
              showText={true} 
              userRole="patient" 
            />
          </div>

          {/* Navigation Tabs */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              {NAV_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  className={`
                    relative px-4 py-2.5 rounded-xl text-sm font-medium 
                    transition-all duration-300 ease-in-out transform hover:scale-105
                    ${getActiveTab() === tab.id
                      ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/25 scale-105'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-white/60 hover:shadow-md backdrop-blur-sm'
                    }
                    active:scale-95
                  `}
                >
                  <span className="relative z-10">{tab.label}</span>
                  {getActiveTab() === tab.id && (
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

            {/* User Profile */}
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-200">
              <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md">
                {user?.username?.charAt(0) || 'P'}
              </div>
              <span className="text-sm font-medium text-slate-700 hidden sm:block">
                {user?.username || 'Patient'}
              </span>
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
      <div className="md:hidden border-t border-slate-200/60 bg-white/50 backdrop-blur-sm">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {NAV_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`
                block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200
                ${getActiveTab() === tab.id
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-white/80'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavigation;
