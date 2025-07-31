import React from 'react';
import { Search, X } from 'lucide-react';

const DepartmentsFilters = ({ filters, onFilterChange }) => {
  const handleInputChange = (value) => {
    onFilterChange({ search: value });
  };

  const handleReset = () => {
    onFilterChange({ search: '' });
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 mb-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search departments by name or description..."
            value={filters.search}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/95"
          />
        </div>
        <button
          onClick={handleReset}
          className="px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <X className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};

export default DepartmentsFilters;
