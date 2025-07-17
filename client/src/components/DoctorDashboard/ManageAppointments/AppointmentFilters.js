import React from 'react';
import { Search } from 'lucide-react';

const AppointmentFilters = ({ 
    searchTerm, 
    setSearchTerm, 
    selectedDate, 
    setSelectedDate 
}) => {
    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedDate('');
    };

    return (
        <div className="p-6 border-b border-gray-200 bg-gray-50/50">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by patient name, phone, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        />
                    </div>
                </div>
                <div className="sm:w-48">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                </div>
                <button
                    onClick={handleClearFilters}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    Clear
                </button>
            </div>
        </div>
    );
};

export default AppointmentFilters;
