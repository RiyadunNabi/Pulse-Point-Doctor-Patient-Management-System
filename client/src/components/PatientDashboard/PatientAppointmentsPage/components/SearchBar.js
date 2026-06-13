//client\src\components\PatientDashboard\PatientAppointmentsPage\components\SearchBar.js
import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ searchTerm, onSearchChange }) => {
    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by doctor, department, or reason..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                    />
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
