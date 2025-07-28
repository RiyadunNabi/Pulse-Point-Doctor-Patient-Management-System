// // components/PatientDashboard/DoctorsSection/DoctorsList.js

// import React, { useState } from 'react';
// import { User } from 'lucide-react';
// import DoctorCard from './DoctorCard';
// import PatientBookingModal from '../../Booking/PatientBookingModal';

// const DoctorsList = ({ doctors = [], loading, user }) => {
//     // Add state for booking modal
//     const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
//     const [selectedDoctorId, setSelectedDoctorId] = useState(null);

//     // Add handler for booking appointment
//     const handleBookAppointment = (doctorId) => {
//         setSelectedDoctorId(doctorId);
//         setIsBookingModalOpen(true);
//     };

//     // Add handler for successful booking
//     const handleBookingSuccess = (appointment) => {
//         console.log('Appointment booked:', appointment);
//         // Close modal after successful booking
//         setIsBookingModalOpen(false);
//         // You can add success notification here
//         // Example: showNotification('Appointment booked successfully!');
//     };

//     if (loading) {
//         return (
//             <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto mb-4"></div>
//                     <p className="text-slate-600">Loading doctors...</p>
//                 </div>
//             </div>
//         );
//     }

//     // Safe check for doctors array
//     if (!doctors || doctors.length === 0) {
//         return (
//             <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
//                 <div className="text-center">
//                     <User className="w-16 h-16 text-slate-400 mx-auto mb-4" />
//                     <h3 className="text-lg font-semibold text-slate-800 mb-2">No Doctors Available</h3>
//                     <p className="text-slate-600">There are currently no doctors available for consultation.</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <>
//             <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
//                 <div className="flex items-center justify-between mb-6">
//                     <h2 className="text-2xl font-bold text-slate-800">Available Doctors</h2>
//                     <div className="text-sm text-slate-500">
//                         {doctors.length} doctor{doctors.length !== 1 ? 's' : ''} available
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {doctors.map((doctor) => (
//                         <DoctorCard 
//                             key={doctor.doctor_id} 
//                             doctor={doctor} 
//                             onBookAppointment={handleBookAppointment}
//                         />
//                     ))}
//                 </div>
//             </div>

//             {/* Add the PatientBookingModal */}
//             <PatientBookingModal
//                 doctorId={selectedDoctorId}
//                 user={user}
//                 isOpen={isBookingModalOpen}
//                 onClose={() => setIsBookingModalOpen(false)}
//                 onBookingSuccess={handleBookingSuccess}
//             />
//         </>
//     );
// };

// export default DoctorsList;




// components/PatientDashboard/DoctorsSection/DoctorsList.js
import React, { useState } from 'react';
import { User } from 'lucide-react';
import DoctorCard from './DoctorCard';
import PatientBookingModal from '../../Booking/PatientBookingModal';

const DoctorsList = ({ doctors = [], loading, user }) => {
    // Add state for booking modal
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedDoctorId, setSelectedDoctorId] = useState(null);
    const [selectedDoctorName, setSelectedDoctorName] = useState(''); // Add this

    // Updated handler for booking appointment - now accepts both parameters
    const handleBookAppointment = (doctorId, doctorName) => {
        setSelectedDoctorId(doctorId);
        setSelectedDoctorName(doctorName); // Set the doctor name
        setIsBookingModalOpen(true);
    };

    // Add handler for successful booking
    const handleBookingSuccess = (appointment) => {
        console.log('Appointment booked:', appointment);
        // Close modal after successful booking
        setIsBookingModalOpen(false);
        // You can add success notification here
        // Example: showNotification('Appointment booked successfully!');
    };

    // Handle modal close
    const handleModalClose = () => {
        setIsBookingModalOpen(false);
        setSelectedDoctorId(null);
        setSelectedDoctorName(''); // Reset doctor name
    };

    if (loading) {
        return (
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading doctors...</p>
                </div>
            </div>
        );
    }

    // Safe check for doctors array
    if (!doctors || doctors.length === 0) {
        return (
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
                <div className="text-center">
                    <User className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">No Doctors Available</h3>
                    <p className="text-slate-600">There are currently no doctors available for consultation.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Available Doctors</h2>
                    <div className="text-sm text-slate-500">
                        {doctors.length} doctor{doctors.length !== 1 ? 's' : ''} available
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctors.map((doctor) => (
                        <DoctorCard
                            key={doctor.doctor_id}
                            doctor={doctor}
                            onBookAppointment={handleBookAppointment} // Now expects (doctorId, doctorName)
                        />
                    ))}
                </div>
            </div>

            {/* Patient Booking Modal - Only render when open */}
            {isBookingModalOpen && (
                <PatientBookingModal
                    doctorId={selectedDoctorId}
                    doctorName={selectedDoctorName}
                    user={user}
                    isOpen={isBookingModalOpen}
                    onClose={handleModalClose}
                    onBookingSuccess={handleBookingSuccess}
                />
            )}
        </>
    );
};

export default DoctorsList;
