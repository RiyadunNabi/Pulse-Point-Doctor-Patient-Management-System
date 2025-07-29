// client/src/components/DoctorDashboard/RevenuePage/components/DateRangeFilter.js
import React, { useState } from 'react';
import { Calendar, Filter } from 'lucide-react';

function DateRangeFilter({ selectedRange, customRange, onRangeChange }) {
  const [showCustom, setShowCustom] = useState(false);

  const predefinedRanges = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'Last 7 Days' },
    { id: 'month', label: 'This Month' },
    { id: 'year', label: 'This Year' }
  ];

  const handleRangeSelect = (rangeId) => {
    if (rangeId === 'custom') {
      setShowCustom(true);
    } else {
      setShowCustom(false);
      onRangeChange(rangeId);
    }
  };

  const handleCustomDateSubmit = () => {
    if (customRange.startDate && customRange.endDate) {
      onRangeChange('custom', customRange);
      setShowCustom(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-800">Date Range</h3>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        {predefinedRanges.map((range) => (
          <button
            key={range.id}
            onClick={() => handleRangeSelect(range.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedRange === range.id
                ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {range.label}
          </button>
        ))}
        
        <button
          onClick={() => handleRangeSelect('custom')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
            selectedRange === 'custom'
              ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Custom Range</span>
        </button>
      </div>

      {showCustom && (
        <div className="border-t border-slate-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={customRange.startDate}
                onChange={(e) => onRangeChange('custom', {
                  ...customRange,
                  startDate: e.target.value
                })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={customRange.endDate}
                onChange={(e) => onRangeChange('custom', {
                  ...customRange,
                  endDate: e.target.value
                })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={handleCustomDateSubmit}
              disabled={!customRange.startDate || !customRange.endDate}
              className="px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DateRangeFilter;
