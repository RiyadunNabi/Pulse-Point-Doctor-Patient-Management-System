//client\src\components\PatientDashboard\PatientAppointmentsPage\components\TabNavigation.js
import React from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const TabNavigation = ({ activeTab, onTabChange, appointments }) => {
    const tabs = [
        { id: 'pending', label: 'Pending', icon: AlertCircle },
        { id: 'completed', label: 'Completed', icon: CheckCircle },
        { id: 'cancelled', label: 'Cancelled', icon: XCircle }
    ];

    return (
        <div className="border-b border-slate-200">
            <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    const count = appointments.filter(apt => apt.status === tab.id).length;
                    
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center space-x-2 ${
                                isActive
                                    ? 'border-sky-500 text-sky-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                            <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full ${
                                isActive ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-600'
                            }`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default TabNavigation;
