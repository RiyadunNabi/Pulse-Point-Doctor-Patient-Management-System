// client/src/components/PatientDashboard/DoctorsSection/DoctorCard.js

import React from 'react';
import { User, Star, MapPin, Phone, Mail, Calendar, IndianRupee } from 'lucide-react';

const DoctorCard = ({ doctor, onBookAppointment }) => {
  const {
    doctor_id,
    first_name,
    last_name,
    department_name,
    bio,
    consultation_fee,
    avg_rating,
    gender,
    phone_no,
    email,
    address,
    total_appointments
  } = doctor;

  // Safe rating conversion
  const safeRating = avg_rating ? parseFloat(avg_rating) : 0;
  const displayRating = isNaN(safeRating) ? 0 : safeRating;

  const renderStars = (rating) => {
    const stars = [];
    const numericRating = parseFloat(rating) || 0;
    const fullStars = Math.floor(numericRating);
    const hasHalfStar = (numericRating % 1) !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 text-yellow-400 fill-current opacity-50" />
      );
    }

    const remainingStars = 5 - Math.ceil(numericRating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-800">
                Dr. {first_name} {last_name}
              </h3>
              <p className="text-sky-600 text-sm font-medium">{department_name}</p>
            </div>
          </div>
          
          {/* Rating - Fixed */}
          <div className="flex items-center space-x-1">
            {renderStars(displayRating)}
            <span className="text-sm text-slate-600 ml-1">
              ({displayRating.toFixed(1)})
            </span>
          </div>
        </div>

        {/* Bio */}
        {bio && (
          <p className="text-slate-600 text-sm mb-4 line-clamp-2">
            {bio}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <IndianRupee className="w-4 h-4 text-green-600" />
            <div>
              <p className="text-xs text-slate-500">Consultation Fee</p>
              <p className="font-semibold text-slate-800">
                ₹{consultation_fee || 'N/A'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-xs text-slate-500">Experience</p>
              <p className="font-semibold text-slate-800">
                {total_appointments || 0} appointments
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          {phone_no && (
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Phone className="w-4 h-4" />
              <span>{phone_no}</span>
            </div>
          )}
          
          {email && (
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Mail className="w-4 h-4" />
              <span>{email}</span>
            </div>
          )}
          
          {address && (
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{address}</span>
            </div>
          )}
        </div>

        {/* Gender Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            gender === 'male' 
              ? 'bg-blue-100 text-blue-800' 
              : gender === 'female' 
                ? 'bg-pink-100 text-pink-800' 
                : 'bg-gray-100 text-gray-800'
          }`}>
            {gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : 'Not specified'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-6">
        <button
          onClick={() => onBookAppointment(doctor_id)}
          className="w-full py-3 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;



// // client/src/components/PatientDashboard/DoctorsSection/DoctorCard.js

// import React from 'react';
// import { User, Star, MapPin, Phone, Mail, Calendar, IndianRupee } from 'lucide-react';

// const DoctorCard = ({ doctor, onBookAppointment }) => {
//   const {
//     doctor_id,
//     first_name,
//     last_name,
//     department_name,
//     bio,
//     consultation_fee,
//     avg_rating,
//     gender,
//     phone_no,
//     email,
//     address,
//     total_appointments
//   } = doctor;

//   const renderStars = (rating) => {
//     const stars = [];
//     const fullStars = Math.floor(rating || 0);
//     const hasHalfStar = (rating || 0) % 1 !== 0;

//     for (let i = 0; i < fullStars; i++) {
//       stars.push(
//         <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
//       );
//     }

//     if (hasHalfStar) {
//       stars.push(
//         <Star key="half" className="w-4 h-4 text-yellow-400 fill-current opacity-50" />
//       );
//     }

//     const remainingStars = 5 - Math.ceil(rating || 0);
//     for (let i = 0; i < remainingStars; i++) {
//       stars.push(
//         <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
//       );
//     }

//     return stars;
//   };

//   return (
//     <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 overflow-hidden">
//       {/* Header */}
//       <div className="p-6 pb-4">
//         <div className="flex items-start justify-between mb-4">
//           <div className="flex items-center space-x-3">
//             <div className="w-12 h-12 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full flex items-center justify-center">
//               <User className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h3 className="font-semibold text-lg text-slate-800">
//                 Dr. {first_name} {last_name}
//               </h3>
//               <p className="text-sky-600 text-sm font-medium">{department_name}</p>
//             </div>
//           </div>
          
//           {/* Rating */}
//           <div className="flex items-center space-x-1">
//             {renderStars(avg_rating)}
//             <span className="text-sm text-slate-600 ml-1">
//               ({avg_rating ? avg_rating.toFixed(1) : '0.0'})
//             </span>
//           </div>
//         </div>

//         {/* Bio */}
//         {bio && (
//           <p className="text-slate-600 text-sm mb-4 line-clamp-2">
//             {bio}
//           </p>
//         )}

//         {/* Stats */}
//         <div className="grid grid-cols-2 gap-4 mb-4">
//           <div className="flex items-center space-x-2">
//             <IndianRupee className="w-4 h-4 text-green-600" />
//             <div>
//               <p className="text-xs text-slate-500">Consultation Fee</p>
//               <p className="font-semibold text-slate-800">
//                 ₹{consultation_fee || 'N/A'}
//               </p>
//             </div>
//           </div>
          
//           <div className="flex items-center space-x-2">
//             <Calendar className="w-4 h-4 text-blue-600" />
//             <div>
//               <p className="text-xs text-slate-500">Experience</p>
//               <p className="font-semibold text-slate-800">
//                 {total_appointments || 0} appointments
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Contact Info */}
//         <div className="space-y-2 mb-4">
//           {phone_no && (
//             <div className="flex items-center space-x-2 text-sm text-slate-600">
//               <Phone className="w-4 h-4" />
//               <span>{phone_no}</span>
//             </div>
//           )}
          
//           {email && (
//             <div className="flex items-center space-x-2 text-sm text-slate-600">
//               <Mail className="w-4 h-4" />
//               <span>{email}</span>
//             </div>
//           )}
          
//           {address && (
//             <div className="flex items-center space-x-2 text-sm text-slate-600">
//               <MapPin className="w-4 h-4" />
//               <span className="line-clamp-1">{address}</span>
//             </div>
//           )}
//         </div>

//         {/* Gender Badge */}
//         <div className="flex items-center justify-between mb-4">
//           <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//             gender === 'male' 
//               ? 'bg-blue-100 text-blue-800' 
//               : gender === 'female' 
//                 ? 'bg-pink-100 text-pink-800' 
//                 : 'bg-gray-100 text-gray-800'
//           }`}>
//             {gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : 'Not specified'}
//           </span>
//         </div>
//       </div>

//       {/* Actions */}
//       <div className="px-6 pb-6">
//         <button
//           onClick={() => onBookAppointment(doctor_id)}
//           className="w-full py-3 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
//         >
//           Book Appointment
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DoctorCard;











// //components/PatientDashboard/DoctorsSection/DoctorCard.js

// import React from 'react';
// import { User } from 'lucide-react';

// const DoctorCard = ({ doctor, onBookAppointment }) => {
//     // Add handler for book appointment button
//     const handleBookAppointment = () => {
//         onBookAppointment(doctor.doctor_id);
//     };

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
//                     onClick={handleBookAppointment}
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