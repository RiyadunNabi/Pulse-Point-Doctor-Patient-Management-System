import React from 'react';

const AppointmentTabs = ({ activeTab, setActiveTab, statusCounts }) => {
    const tabs = [
        { id: 'pending', label: 'Pending', color: 'from-amber-500 to-orange-500' },
        { id: 'completed', label: 'Completed', color: 'from-green-500 to-emerald-500' },
        { id: 'cancelled', label: 'Cancelled', color: 'from-red-500 to-rose-500' }
    ];

    return (
        <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === tab.id
                                ? 'border-sky-500 text-sky-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        {tab.label}
                        <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                            {statusCounts[tab.id] || 0}
                        </span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default AppointmentTabs;
