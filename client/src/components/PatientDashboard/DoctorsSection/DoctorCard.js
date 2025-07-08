//components/PatientDashboard/DoctorsSection/DoctorCard.js

import React from 'react';
import { User } from 'lucide-react';

const DoctorCard = ({ doctor, onBookAppointment }) => {
    // Add handler for book appointment button
    const handleBookAppointment = () => {
        onBookAppointment(doctor.doctor_id);
    };

    return (
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-sky-300">
            {/* Doctor Avatar */}
            <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full flex items-center justify-center mr-4">
                    <User className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                        Dr. {doctor.first_name} {doctor.last_name}
                    </h3>
                    <p className="text-sm text-slate-600">{doctor.department_name}</p>
                </div>
            </div>

            {/* Doctor Info */}
            <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-slate-600">
                    <span className="font-medium">Email:</span>
                    <span className="ml-2">{doctor.email}</span>
                </div>
                
                {typeof doctor.avg_rating === 'number' || !isNaN(parseFloat(doctor.avg_rating)) ? (
                    <div className="flex items-center text-sm text-slate-600">
                        <span className="font-medium">Rating:</span>
                        <div className="ml-2 flex items-center">
                            <span className="text-yellow-500">★</span>
                            <span className="ml-1">{parseFloat(doctor.avg_rating).toFixed(1)}</span>
                        </div>
                    </div>
                ) : null}

                <div className="flex items-center text-sm">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        doctor.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                    }`}>
                        {doctor.is_active ? 'Available' : 'Unavailable'}
                    </span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
                <button
                    onClick={handleBookAppointment}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!doctor.is_active}
                >
                    Book Appointment
                </button>
                <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                    View Details
                </button>
            </div>
        </div>
    );
};

export default DoctorCard;



// import React from 'react';
// import { User } from 'lucide-react';

// const DoctorCard = ({ doctor }) => {
//     return (
//         <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-sky-300">
//             {/* Doctor Avatar */}
//             <div className="flex items-center mb-4">
//                 <div className="w-16 h-16 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full flex items-center justify-center mr-4">
//                     <User className="w-8 h-8 text-white" />
//                 </div>
//                 <div>
//                     <h3 className="text-lg font-semibold text-slate-800">
//                         Dr. {doctor.first_name} {doctor.last_name}
//                     </h3>
//                     <p className="text-sm text-slate-600">{doctor.department_name}</p>
//                 </div>
//             </div>

//             {/* Doctor Info */}
//             <div className="space-y-2 mb-4">
//                 <div className="flex items-center text-sm text-slate-600">
//                     <span className="font-medium">Email:</span>
//                     <span className="ml-2">{doctor.email}</span>
//                 </div>
                
//                 {typeof doctor.avg_rating === 'number' || !isNaN(parseFloat(doctor.avg_rating)) ? (
//                     <div className="flex items-center text-sm text-slate-600">
//                         <span className="font-medium">Rating:</span>
//                         <div className="ml-2 flex items-center">
//                             <span className="text-yellow-500">★</span>
//                             <span className="ml-1">{parseFloat(doctor.avg_rating).toFixed(1)}</span>
//                         </div>
//                     </div>
//                 ) : null}

//                 <div className="flex items-center text-sm">
//                     <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//                         doctor.is_active
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-red-100 text-red-800'
//                     }`}>
//                         {doctor.is_active ? 'Available' : 'Unavailable'}
//                     </span>
//                 </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex space-x-2">
//                 <button
//                     className="flex-1 px-4 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                     disabled={!doctor.is_active}
//                 >
//                     Book Appointment
//                 </button>
//                 <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
//                     View Details
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default DoctorCard;
