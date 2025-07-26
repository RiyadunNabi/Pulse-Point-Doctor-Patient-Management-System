// import React from 'react';

// const AppointmentTabs = ({ activeTab, setActiveTab, statusCounts }) => {
//     const tabs = [
//         { id: 'pending', label: 'Pending', color: 'from-amber-500 to-orange-500' },
//         { id: 'completed', label: 'Completed', color: 'from-green-500 to-emerald-500' },
//         { id: 'cancelled', label: 'Cancelled', color: 'from-red-500 to-rose-500' }
//     ];

//     return (
//         <div className="border-b border-gray-200">
//             <nav className="flex space-x-8 px-6">
//                 {tabs.map((tab) => (
//                     <button
//                         key={tab.id}
//                         onClick={() => setActiveTab(tab.id)}
//                         className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
//                             activeTab === tab.id
//                                 ? 'border-sky-500 text-sky-600'
//                                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                         }`}
//                     >
//                         {tab.label}
//                         <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
//                             {statusCounts[tab.id] || 0}
//                         </span>
//                     </button>
//                 ))}
//             </nav>
//         </div>
//     );
// };

// export default AppointmentTabs;

import React from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const AppointmentTabs = ({ activeTab, setActiveTab, statusCounts }) => {
    const tabs = [
        { 
            id: 'pending', 
            label: 'Pending', 
            icon: AlertCircle,
            bgActive: 'bg-gradient-to-r from-sky-400 to-blue-500',
            textActive: 'text-white',
            bgInactive: 'hover:bg-sky-50',
            textInactive: 'text-sky-600 hover:text-sky-700'
        },
        { 
            id: 'completed', 
            label: 'Completed',
            icon: CheckCircle,
            bgActive: 'bg-gradient-to-r from-emerald-400 to-teal-500',
            textActive: 'text-white',
            bgInactive: 'hover:bg-emerald-50',
            textInactive: 'text-emerald-600 hover:text-emerald-700'
        },
        { 
            id: 'cancelled', 
            label: 'Cancelled',
            icon: XCircle,
            bgActive: 'bg-gradient-to-r from-pink-400 to-rose-500',
            textActive: 'text-white',
            bgInactive: 'hover:bg-pink-50',
            textInactive: 'text-pink-600 hover:text-pink-700'
        }
    ];

    return (
        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-gray-50">
            <nav className="flex space-x-1 px-3 py-1.5">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative px-2.5 py-1.5 rounded-md font-medium text-xs transition-all duration-200 flex items-center space-x-1.5 shadow-sm hover:shadow-md ${
                                isActive
                                    ? `${tab.bgActive} ${tab.textActive} shadow-md`
                                    : `bg-white ${tab.textInactive} ${tab.bgInactive} border border-slate-200`
                            }`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{tab.label}</span>
                            <span className={`inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold rounded-full min-w-[16px] ${
                                isActive 
                                    ? 'bg-white/20 text-white' 
                                    : 'bg-slate-100 text-slate-600'
                            }`}>
                                {statusCounts[tab.id] || 0}
                            </span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default AppointmentTabs;
