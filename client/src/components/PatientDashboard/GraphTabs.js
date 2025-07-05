import React from 'react';

function GraphTabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex space-x-1 mb-6 bg-slate-100 p-1 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            activeTab === tab.id
              ? 'bg-white text-sky-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default GraphTabs;
