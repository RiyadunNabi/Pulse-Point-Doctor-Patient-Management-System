// import React from 'react';
// import { Search } from 'lucide-react';

// const AppointmentFilters = ({ 
//     searchTerm, 
//     setSearchTerm, 
//     selectedDate, 
//     setSelectedDate 
// }) => {
//     const handleClearFilters = () => {
//         setSearchTerm('');
//         setSelectedDate('');
//     };

//     return (
//         <div className="p-6 border-b border-gray-200 bg-gray-50/50">
//             <div className="flex flex-col sm:flex-row gap-4">
//                 <div className="flex-1">
//                     <div className="relative">
//                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                         <input
//                             type="text"
//                             placeholder="Search by patient name, phone, or email..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
//                         />
//                     </div>
//                 </div>
//                 <div className="sm:w-48">
//                     <input
//                         type="date"
//                         value={selectedDate}
//                         onChange={(e) => setSelectedDate(e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
//                     />
//                 </div>
//                 <button
//                     onClick={handleClearFilters}
//                     className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
//                 >
//                     Clear
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default AppointmentFilters;


import React from 'react';
import { Search, Calendar, Filter } from 'lucide-react';

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
        <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-blue-50/50 via-indigo-50/50 to-purple-50/50">
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Input */}
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by patient name, phone, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white/80 backdrop-blur-sm text-slate-700 placeholder-slate-400 text-sm"
                        />
                    </div>
                </div>
                
                {/* Date Filter */}
                <div className="sm:w-48">
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white/80 backdrop-blur-sm text-slate-700 text-sm"
                        />
                    </div>
                </div>
                
                {/* Clear Button */}
                <button
                    onClick={handleClearFilters}
                    className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-slate-500 to-gray-500 hover:from-slate-600 hover:to-gray-600 text-white rounded-lg transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
                >
                    <Filter className="w-4 h-4" />
                    <span>Clear</span>
                </button>
            </div>
        </div>
    );
};

export default AppointmentFilters;
