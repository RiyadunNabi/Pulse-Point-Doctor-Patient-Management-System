// client/src/components/PatientDashboard/Navigation/DashboardNavigation.js

import React from 'react';
import { Bell, LogOut, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import PulsePointLogo from './PulsePointLogo';
import { NAV_TABS } from '../utils/constants';

const DashboardNavigation = ({ 
    activeTab, 
    onTabClick, 
    notifications, 
    onLogout 
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleTabClick = (tab) => {
        if (tab.route) {
            navigate(tab.route);
        } else {
            onTabClick(tab.id);
        }
    };

    const getActiveTab = () => {
        if (location.pathname === '/doctors') return 'doctors';
        if (location.pathname === '/departments') return 'departments';
        return activeTab;
    };

    return (
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
                        {NAV_TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabClick(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    getActiveTab() === tab.id
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
    );
};

export default DashboardNavigation;





// // client/src/components/PatientDashboard/Navigation/DashboardNavigation.js
// import React from 'react';
// import { Bell, LogOut, User } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import PulsePointLogo from './PulsePointLogo';
// import { NAV_TABS } from '../utils/constants';

// const DashboardNavigation = ({ 
//     activeTab, 
//     onTabClick, 
//     notifications, 
//     onLogout 
// }) => {
//     const navigate = useNavigate();

//     const handleTabClick = (tabId) => {
//         if (tabId === 'doctors') {
//             navigate('/doctors');
//         } else {
//             onTabClick(tabId);
//         }
//     };

//     return (
//         <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex justify-between items-center h-16">
//                     {/* Logo and Brand */}
//                     <div className="flex items-center space-x-3">
//                         <PulsePointLogo className="w-10 h-10" />
//                         <div>
//                             <h1 className="text-xl font-bold text-slate-800">Pulse Point</h1>
//                             <p className="text-xs text-slate-500">Healthcare Portal</p>
//                         </div>
//                     </div>

//                     {/* Navigation Tabs */}
//                     <div className="hidden md:flex items-center space-x-1">
//                         {NAV_TABS.map((tab) => (
//                             <button
//                                 key={tab.id}
//                                 onClick={() => handleTabClick(tab.id)}
//                                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
//                                     activeTab === tab.id
//                                         ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md'
//                                         : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
//                                 }`}
//                             >
//                                 {tab.label}
//                             </button>
//                         ))}
//                     </div>

//                     {/* Right Side - Notifications, Profile, Logout */}
//                     <div className="flex items-center space-x-4">
//                         <button className="relative p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
//                             <Bell className="w-5 h-5" />
//                             {notifications > 0 && (
//                                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                                     {notifications}
//                                 </span>
//                             )}
//                         </button>

//                         <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full flex items-center justify-center">
//                             <User className="w-5 h-5 text-white" />
//                         </div>

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






















// // components/PatientDashboard/Navigation/DashboardNavigation.js
// import React from 'react';
// import { Bell, LogOut, User } from 'lucide-react';
// import PulsePointLogo from './PulsePointLogo';
// import { NAV_TABS } from '../utils/constants';

// const DashboardNavigation = ({ 
//     activeTab, 
//     onTabClick, 
//     notifications, 
//     onLogout 
// }) => {
//     return (
//         <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex justify-between items-center h-16">
//                     {/* Logo and Brand */}
//                     <div className="flex items-center space-x-3">
//                         <PulsePointLogo className="w-10 h-10" />
//                         <div>
//                             <h1 className="text-xl font-bold text-slate-800">Pulse Point</h1>
//                             <p className="text-xs text-slate-500">Healthcare Portal</p>
//                         </div>
//                     </div>

//                     {/* Navigation Tabs */}
//                     <div className="hidden md:flex items-center space-x-1">
//                         {NAV_TABS.map((tab) => (
//                             <button
//                                 key={tab.id}
//                                 onClick={() => onTabClick(tab.id)}
//                                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
//                                     activeTab === tab.id
//                                         ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md'
//                                         : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
//                                 }`}
//                             >
//                                 {tab.label}
//                             </button>
//                         ))}
//                     </div>

//                     {/* Right Side - Notifications, Profile, Logout */}
//                     <div className="flex items-center space-x-4">
//                         <button className="relative p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
//                             <Bell className="w-5 h-5" />
//                             {notifications > 0 && (
//                                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                                     {notifications}
//                                 </span>
//                             )}
//                         </button>

//                         <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full flex items-center justify-center">
//                             <User className="w-5 h-5 text-white" />
//                         </div>

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
