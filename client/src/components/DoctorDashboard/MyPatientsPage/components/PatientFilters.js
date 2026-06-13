import React from 'react';

const PatientFilters = ({ filters, onFilterChange }) => {
    const handleFilterChange = (key, value) => {
        onFilterChange({
            ...filters,
            [key]: value
        });
    };

    const clearFilters = () => {
        onFilterChange({
            gender: '',
            from_date: '',
            to_date: '',
            sort_by: 'last_appointment',
            sort_order: 'desc'
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Gender Filter */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Gender
                </label>
                <select
                    value={filters.gender}
                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 bg-white text-sm"
                >
                    <option value="">All Genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </div>

            {/* From Date */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    From Date
                </label>
                <input
                    type="date"
                    value={filters.from_date}
                    onChange={(e) => handleFilterChange('from_date', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 bg-white text-sm"
                />
            </div>

            {/* To Date */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    To Date
                </label>
                <input
                    type="date"
                    value={filters.to_date}
                    onChange={(e) => handleFilterChange('to_date', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 bg-white text-sm"
                />
            </div>

            {/* Sort By */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Sort By
                </label>
                <select
                    value={filters.sort_by}
                    onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 bg-white text-sm"
                >
                    <option value="last_appointment">Last Appointment</option>
                    <option value="name">Name</option>
                    <option value="total_appointments">Total Appointments</option>
                </select>
            </div>

            {/* Sort Order */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Order
                </label>
                <div className="flex items-center space-x-2">
                    <select
                        value={filters.sort_order}
                        onChange={(e) => handleFilterChange('sort_order', e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 bg-white text-sm"
                    >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                    </select>
                    <button
                        onClick={clearFilters}
                        className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PatientFilters;
