// import React, { useState } from 'react';
// import { Calendar, Clock, User, Phone, Mail, Eye, FileText, Stethoscope, ClipboardList } from 'lucide-react';
// import PrescriptionModal from './PrescriptionModal';

// // Helper functions (keep existing ones)
// const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//         weekday: 'short',
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//     });
// };

// const formatTime = (timeString) => {
//     return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
//         hour: 'numeric',
//         minute: '2-digit',
//         hour12: true
//     });
// };

// const getStatusBadge = (status) => {
//     const statusConfig = {
//         pending: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Pending' },
//         completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
//         cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' }
//     };

//     const config = statusConfig[status] || statusConfig.pending;
//     return (
//         <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
//             {config.label}
//         </span>
//     );
// };

// const AppointmentCard = ({ 
//     appointment, 
//     onStatusUpdate, 
//     onViewPatientDetails,
//     currentStatus 
// }) => {
//     const [showDetails, setShowDetails] = useState(false);
//     const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

//     const getActionButtons = () => {
//         const buttons = [];

//         if (currentStatus === 'pending') {
//             buttons.push(
//                 <button
//                     key="complete"
//                     onClick={() => onStatusUpdate(appointment.appointment_id, 'completed')}
//                     className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors"
//                 >
//                     Mark Complete
//                 </button>
//             );
//             buttons.push(
//                 <button
//                     key="cancel"
//                     onClick={() => onStatusUpdate(appointment.appointment_id, 'cancelled')}
//                     className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-colors"
//                 >
//                     Cancel
//                 </button>
//             );
//         }

//         return buttons;
//     };

//     return (
//         <>
//             <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
//                 <div className="p-6">
//                     <div className="flex items-start justify-between">
//                         <div className="flex-1">
//                             <div className="flex items-center space-x-3 mb-3">
//                                 <div className="w-10 h-10 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full flex items-center justify-center">
//                                     <User className="w-5 h-5 text-white" />
//                                 </div>
//                                 <div>
//                                     <h3 className="font-semibold text-slate-800">
//                                         {appointment.patient_first_name} {appointment.patient_last_name}
//                                     </h3>
//                                     <div className="flex items-center space-x-4 text-sm text-slate-600">
//                                         <span className="flex items-center">
//                                             <Calendar className="w-4 h-4 mr-1" />
//                                             {formatDate(appointment.appointment_date)}
//                                         </span>
//                                         <span className="flex items-center">
//                                             <Clock className="w-4 h-4 mr-1" />
//                                             {formatTime(appointment.appointment_time)}
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>

//                             {appointment.reason && (
//                                 <p className="text-sm text-slate-600 mb-3">
//                                     <strong>Reason:</strong> {appointment.reason}
//                                 </p>
//                             )}

//                             <div className="flex items-center space-x-2 text-sm text-slate-600">
//                                 <Phone className="w-4 h-4" />
//                                 <span>{appointment.patient_phone || 'No phone'}</span>
//                                 <Mail className="w-4 h-4 ml-4" />
//                                 <span>{appointment.patient_email || 'No email'}</span>
//                             </div>
//                         </div>

//                         <div className="flex flex-col items-end space-y-2">
//                             {getStatusBadge(appointment.status)}
//                             <div className="flex space-x-2">
//                                 <button
//                                     onClick={() => setShowDetails(!showDetails)}
//                                     className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
//                                     title="Toggle Details"
//                                 >
//                                     <Eye className="w-4 h-4" />
//                                 </button>
//                                 <button
//                                     onClick={() => onViewPatientDetails(appointment)}
//                                     className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
//                                     title="View Patient Details"
//                                 >
//                                     <Stethoscope className="w-4 h-4" />
//                                 </button>
//                                 <button
//                                     onClick={() => setShowPrescriptionModal(true)}
//                                     className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
//                                     title="Create Prescription"
//                                 >
//                                     <FileText className="w-4 h-4" />
//                                 </button>
//                                 <button
//                                     className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors"
//                                     title="View Investigation Reports"
//                                 >
//                                     <ClipboardList className="w-4 h-4" />
//                                 </button>
//                             </div>
//                             <div className="flex space-x-2">
//                                 {getActionButtons()}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Expanded Details */}
//                     {showDetails && (
//                         <div className="mt-4 pt-4 border-t border-gray-200">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                                 <div>
//                                     <strong className="text-slate-700">Patient ID:</strong>
//                                     <span className="ml-2 text-slate-600">{appointment.patient_id}</span>
//                                 </div>
//                                 <div>
//                                     <strong className="text-slate-700">Gender:</strong>
//                                     <span className="ml-2 text-slate-600">{appointment.patient_gender || 'Not specified'}</span>
//                                 </div>
//                                 <div>
//                                     <strong className="text-slate-700">Date of Birth:</strong>
//                                     <span className="ml-2 text-slate-600">
//                                         {appointment.date_of_birth ? formatDate(appointment.date_of_birth) : 'Not specified'}
//                                     </span>
//                                 </div>
//                                 <div>
//                                     <strong className="text-slate-700">Appointment Created:</strong>
//                                     <span className="ml-2 text-slate-600">{formatDate(appointment.created_at)}</span>
//                                 </div>
//                                 {appointment.patient_address && (
//                                     <div className="md:col-span-2">
//                                         <strong className="text-slate-700">Address:</strong>
//                                         <span className="ml-2 text-slate-600">{appointment.patient_address}</span>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Prescription Modal */}
//             <PrescriptionModal
//                 isOpen={showPrescriptionModal}
//                 onClose={() => setShowPrescriptionModal(false)}
//                 appointment={appointment}
//             />
//         </>
//     );
// };

// export default AppointmentCard;


// import React, { useState } from 'react';  
// import { Calendar, Clock, User, Phone, Mail, Eye, FileText, Stethoscope, ClipboardList } from 'lucide-react';  
// import PrescriptionModal from './PrescriptionModal';  

// // Helper functions (keep existing ones)  
// const formatDate = (dateString) => {  
//     return new Date(dateString).toLocaleDateString('en-US', {  
//         weekday: 'short',  
//         year: 'numeric',  
//         month: 'short',  
//         day: 'numeric'  
//     });  
// };  

// const formatTime = (timeString) => {  
//     return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {  
//         hour: 'numeric',  
//         minute: '2-digit',  
//         hour12: true  
//     });  
// };  

// const getStatusBadge = (status) => {  
//     const statusConfig = {  
//         pending: { bg: 'bg-gradient-to-r from-amber-100 to-orange-100', text: 'text-amber-700', border: 'border-amber-200', label: 'Pending' },  
//         completed: { bg: 'bg-gradient-to-r from-green-100 to-emerald-100', text: 'text-green-700', border: 'border-green-200', label: 'Completed' },  
//         cancelled: { bg: 'bg-gradient-to-r from-red-100 to-rose-100', text: 'text-red-700', border: 'border-red-200', label: 'Cancelled' }  
//     };  

//     const config = statusConfig[status] || statusConfig.pending;  
//     return (  
//         <span className={`px-2.5 py-1.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>  
//             {config.label}  
//         </span>  
//     );  
// };  

// const AppointmentCard = ({   
//     appointment,   
//     onStatusUpdate,   
//     onViewPatientDetails,  
//     currentStatus   
// }) => {  
//     const [showDetails, setShowDetails] = useState(false);  
//     const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);  

//     const getActionButtons = () => {  
//         const buttons = [];  

//         if (currentStatus === 'pending') {  
//             buttons.push(  
//                 <button  
//                     key="complete"  
//                     onClick={() => onStatusUpdate(appointment.appointment_id, 'completed')}  
//                     className="px-2.5 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-xs font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"  
//                 >  
//                     Complete  
//                 </button>  
//             );  
//             buttons.push(  
//                 <button  
//                     key="cancel"  
//                     onClick={() => onStatusUpdate(appointment.appointment_id, 'cancelled')}  
//                     className="px-2.5 py-1.5 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white text-xs font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"  
//                 >  
//                     Cancel  
//                 </button>  
//             );  
//         }  

//         return buttons;  
//     };  

//     return (  
//         <>  
//             <div className="bg-gradient-to-br from-sky-50 to-cyan-50 rounded-xl border border-sky-200 shadow-sm hover:shadow-lg hover:border-sky-300 transform hover:-translate-y-1 transition-all duration-300">  
//                 <div className="p-4">  
//                     <div className="flex items-start justify-between">  
//                         <div className="flex-1">  
//                             <div className="flex items-center space-x-3 mb-3">  
//                                 <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">  
//                                     <User className="w-5 h-5 text-white" />  
//                                 </div>  
//                                 <div>  
//                                     <h3 className="text-base font-semibold text-slate-800">  
//                                         {appointment.patient_first_name} {appointment.patient_last_name}  
//                                     </h3>  
//                                     <div className="flex items-center space-x-4 text-xs text-slate-600">  
//                                         <span className="flex items-center">  
//                                             <Calendar className="w-4 h-4 mr-1 text-blue-500" />  
//                                             {formatDate(appointment.appointment_date)}  
//                                         </span>  
//                                         <span className="flex items-center">  
//                                             <Clock className="w-4 h-4 mr-1 text-purple-500" />  
//                                             {formatTime(appointment.appointment_time)}  
//                                         </span>  
//                                     </div>  
//                                 </div>  
//                             </div>  

//                             {appointment.reason && (  
//                                 <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 mb-3 border border-cyan-200">  
//                                     <p className="text-sm text-slate-700">  
//                                         <span className="font-medium text-slate-800">Reason:</span> {appointment.reason}  
//                                     </p>  
//                                 </div>  
//                             )}  

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600">  
//                                 <div className="flex items-center space-x-2">  
//                                     <Phone className="w-4 h-4 text-green-500" />  
//                                     <span>{appointment.patient_phone || 'No phone'}</span>  
//                                 </div>  
//                                 <div className="flex items-center space-x-2">  
//                                     <Mail className="w-4 h-4 text-blue-500" />  
//                                     <span>{appointment.patient_email || 'No email'}</span>  
//                                 </div>  
//                             </div>  
//                         </div>  

//                         <div className="flex flex-col items-end space-y-3">  
//                             {getStatusBadge(appointment.status)}  

//                             <div className="grid grid-cols-2 gap-2">  
//                                 <button  
//                                     onClick={() => setShowDetails(!showDetails)}  
//                                     className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-slate-200 hover:border-blue-300"  
//                                     title="Toggle Details"  
//                                 >  
//                                     <Eye className="w-4 h-4" />  
//                                 </button>  
//                                 <button  
//                                     onClick={() => onViewPatientDetails(appointment)}  
//                                     className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-300"  
//                                     title="View Patient Details"  
//                                 >  
//                                     <Stethoscope className="w-4 h-4" />  
//                                 </button>  
//                                 <button  
//                                     onClick={() => setShowPrescriptionModal(true)}  
//                                     className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all duration-200 border border-emerald-200 hover:border-emerald-300"  
//                                     title="Create Prescription"  
//                                 >  
//                                     <FileText className="w-4 h-4" />  
//                                 </button>  
//                                 <button  
//                                     className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200 border border-purple-200 hover:border-purple-300"  
//                                     title="View Investigation Reports"  
//                                 >  
//                                     <ClipboardList className="w-4 h-4" />  
//                                 </button>  
//                             </div>  

//                             {getActionButtons().length > 0 && (  
//                                 <div className="flex space-x-2">  
//                                     {getActionButtons()}  
//                                 </div>  
//                             )}  
//                         </div>  
//                     </div>  

//                     {/* Expanded Details */}  
//                     {showDetails && (  
//                         <div className="mt-4 pt-4 border-t border-cyan-200">  
//                             <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-cyan-200">  
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">  
//                                     <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3">  
//                                         <span className="font-medium text-slate-800">Patient ID:</span>  
//                                         <span className="ml-2 text-slate-600">{appointment.patient_id}</span>  
//                                     </div>  
//                                     <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3">  
//                                         <span className="font-medium text-slate-800">Gender:</span>  
//                                         <span className="ml-2 text-slate-600">{appointment.patient_gender || 'Not specified'}</span>  
//                                     </div>  
//                                     <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3">  
//                                         <span className="font-medium text-slate-800">Date of Birth:</span>  
//                                         <span className="ml-2 text-slate-600">  
//                                             {appointment.date_of_birth ? formatDate(appointment.date_of_birth) : 'Not specified'}  
//                                         </span>  
//                                     </div>  
//                                     <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-3">  
//                                         <span className="font-medium text-slate-800">Created:</span>  
//                                         <span className="ml-2 text-slate-600">{formatDate(appointment.created_at)}</span>  
//                                     </div>  
//                                     {appointment.patient_address && (  
//                                         <div className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3">  
//                                             <span className="font-medium text-slate-800">Address:</span>  
//                                             <span className="ml-2 text-slate-600">{appointment.patient_address}</span>  
//                                         </div>  
//                                     )}  
//                                 </div>  
//                             </div>  
//                         </div>  
//                     )}  
//                 </div>  
//             </div>  

//             {/* Prescription Modal */}  
//             <PrescriptionModal  
//                 isOpen={showPrescriptionModal}  
//                 onClose={() => setShowPrescriptionModal(false)}  
//                 appointment={appointment}  
//             />  
//         </>  
//     );  
// };  

// export default AppointmentCard;  




// import React, { useState } from 'react';
// import { Calendar, Clock, User, Phone, Mail, Eye, FileText, Stethoscope, ClipboardList, MapPin, Hash, Cake, UserCheck } from 'lucide-react';
// import PrescriptionModal from './PrescriptionModal';

// // Helper functions (keep existing ones)
// const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//         weekday: 'short',
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//     });
// };

// const formatTime = (timeString) => {
//     return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
//         hour: 'numeric',
//         minute: '2-digit',
//         hour12: true
//     });
// };

// const getStatusBadge = (status) => {
//     const statusConfig = {
//         pending: { 
//             bg: 'bg-gradient-to-r from-amber-100 to-orange-100', 
//             text: 'text-amber-800', 
//             border: 'border-amber-200',
//             icon: '⏳',
//             label: 'Pending' 
//         },
//         completed: { 
//             bg: 'bg-gradient-to-r from-green-100 to-emerald-100', 
//             text: 'text-green-800', 
//             border: 'border-green-200',
//             icon: '✅',
//             label: 'Completed' 
//         },
//         cancelled: { 
//             bg: 'bg-gradient-to-r from-red-100 to-rose-100', 
//             text: 'text-red-800', 
//             border: 'border-red-200',
//             icon: '❌',
//             label: 'Cancelled' 
//         }
//     };

//     const config = statusConfig[status] || statusConfig.pending;
//     return (
//         <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border} shadow-sm`}>
//             <span className="mr-1.5">{config.icon}</span>
//             {config.label}
//         </span>
//     );
// };

// const AppointmentCard = ({ 
//     appointment, 
//     onStatusUpdate, 
//     onViewPatientDetails,
//     currentStatus 
// }) => {
//     const [showDetails, setShowDetails] = useState(false);
//     const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

//     // Get card gradient based on status
//     const getCardGradient = () => {
//         switch (currentStatus) {
//             case 'pending':
//                 return 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-amber-200 hover:border-amber-300';
//             case 'completed':
//                 return 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-300';
//             case 'cancelled':
//                 return 'bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 border-red-200 hover:border-red-300';
//             default:
//                 return 'bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 border-slate-200 hover:border-slate-300';
//         }
//     };

//     const getActionButtons = () => {
//         const buttons = [];

//         if (currentStatus === 'pending') {
//             buttons.push(
//                 <button
//                     key="complete"
//                     onClick={() => onStatusUpdate(appointment.appointment_id, 'completed')}
//                     className="flex items-center space-x-1.5 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-xs font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
//                 >
//                     <UserCheck className="w-3 h-3" />
//                     <span>Mark Complete</span>
//                 </button>
//             );
//             buttons.push(
//                 <button
//                     key="cancel"
//                     onClick={() => onStatusUpdate(appointment.appointment_id, 'cancelled')}
//                     className="flex items-center space-x-1.5 px-3 py-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white text-xs font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
//                 >
//                     <span>❌</span>
//                     <span>Cancel</span>
//                 </button>
//             );
//         }

//         return buttons;
//     };

//     return (
//         <>
//             <div className={`${getCardGradient()} rounded-xl border p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm`}>
//                 {/* Header with Patient Info and Action Buttons */}
//                 <div className="flex justify-between items-start mb-5">
//                     {/* Patient Info */}
//                     <div className="flex items-center space-x-4 flex-1">
//                         <div className="w-14 h-14 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center shadow-lg">
//                             <User className="w-7 h-7 text-white" />
//                         </div>
//                         <div>
//                             <h3 className="text-lg font-bold text-slate-800 flex items-center">
//                                 {appointment.patient_first_name} {appointment.patient_last_name}
//                             </h3>
//                             <div className="flex items-center space-x-4 text-sm text-slate-600 mt-1">
//                                 <div className="flex items-center space-x-1 bg-white/60 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
//                                     <Calendar className="w-3.5 h-3.5 text-blue-500" />
//                                     <span className="font-medium">{formatDate(appointment.appointment_date)}</span>
//                                 </div>
//                                 <div className="flex items-center space-x-1 bg-white/60 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
//                                     <Clock className="w-3.5 h-3.5 text-green-500" />
//                                     <span className="font-medium">{formatTime(appointment.appointment_time)}</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Status and Quick Actions */}
//                     <div className="flex flex-col items-end space-y-3 ml-4">
//                         {getStatusBadge(appointment.status)}
//                         <div className="flex space-x-2">
//                             <button
//                                 onClick={() => setShowDetails(!showDetails)}
//                                 className="p-2.5 text-slate-600 hover:text-slate-800 hover:bg-white/70 backdrop-blur-sm rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
//                                 title="Toggle Details"
//                             >
//                                 <Eye className="w-4 h-4" />
//                             </button>
//                             <button
//                                 onClick={() => onViewPatientDetails(appointment)}
//                                 className="p-2.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
//                                 title="View Patient Details"
//                             >
//                                 <Stethoscope className="w-4 h-4" />
//                             </button>
//                             <button
//                                 onClick={() => setShowPrescriptionModal(true)}
//                                 className="p-2.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
//                                 title="Create Prescription"
//                             >
//                                 <FileText className="w-4 h-4" />
//                             </button>
//                             <button
//                                 className="p-2.5 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
//                                 title="View Investigation Reports"
//                             >
//                                 <ClipboardList className="w-4 h-4" />
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Appointment Reason */}
//                 {appointment.reason && (
//                     <div className="mb-4">
//                         <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-white/40 shadow-sm">
//                             <p className="text-sm text-slate-700">
//                                 <span className="font-semibold text-purple-600">Reason:</span>{' '}
//                                 <span className="text-slate-600">{appointment.reason}</span>
//                             </p>
//                         </div>
//                     </div>
//                 )}

//                 {/* Contact Information */}
//                 <div className="flex items-center space-x-6 mb-4">
//                     <div className="flex items-center space-x-2 text-slate-700 bg-white/60 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
//                         <Phone className="w-4 h-4 text-green-500" />
//                         <span className="text-sm font-medium">{appointment.patient_phone || 'No phone'}</span>
//                     </div>
//                     <div className="flex items-center space-x-2 text-slate-700 bg-white/60 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
//                         <Mail className="w-4 h-4 text-blue-500" />
//                         <span className="text-sm font-medium">{appointment.patient_email || 'No email'}</span>
//                     </div>
//                 </div>

//                 {/* Action Buttons */}
//                 {currentStatus === 'pending' && (
//                     <div className="flex space-x-3 mb-4">
//                         {getActionButtons()}
//                     </div>
//                 )}

//                 {/* Expanded Details */}
//                 {showDetails && (
//                     <div className="mt-6 pt-5 border-t border-white/40">
//                         <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200 shadow-sm">
//                             <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center">
//                                 <User className="w-4 h-4 mr-2 text-indigo-600" />
//                                 Patient Details
//                             </h4>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-indigo-300">
//                                     <div className="flex items-center space-x-2 text-sm">
//                                         <Hash className="w-3.5 h-3.5 text-indigo-500" />
//                                         <span className="font-medium text-slate-700">Patient ID:</span>
//                                         <span className="text-slate-600">{appointment.patient_id}</span>
//                                     </div>
//                                 </div>
//                                 <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-indigo-300">
//                                     <div className="flex items-center space-x-2 text-sm">
//                                         <User className="w-3.5 h-3.5 text-indigo-500" />
//                                         <span className="font-medium text-slate-700">Gender:</span>
//                                         <span className="text-slate-600">{appointment.patient_gender || 'Not specified'}</span>
//                                     </div>
//                                 </div>
//                                 <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-indigo-300">
//                                     <div className="flex items-center space-x-2 text-sm">
//                                         <Cake className="w-3.5 h-3.5 text-indigo-500" />
//                                         <span className="font-medium text-slate-700">Date of Birth:</span>
//                                         <span className="text-slate-600">
//                                             {appointment.date_of_birth ? formatDate(appointment.date_of_birth) : 'Not specified'}
//                                         </span>
//                                     </div>
//                                 </div>
//                                 <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-indigo-300">
//                                     <div className="flex items-center space-x-2 text-sm">
//                                         <Calendar className="w-3.5 h-3.5 text-indigo-500" />
//                                         <span className="font-medium text-slate-700">Created:</span>
//                                         <span className="text-slate-600">{formatDate(appointment.created_at)}</span>
//                                     </div>
//                                 </div>
//                                 {appointment.patient_address && (
//                                     <div className="md:col-span-2 bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-indigo-300">
//                                         <div className="flex items-start space-x-2 text-sm">
//                                             <MapPin className="w-3.5 h-3.5 text-indigo-500 mt-0.5" />
//                                             <div>
//                                                 <span className="font-medium text-slate-700">Address:</span>
//                                                 <span className="ml-2 text-slate-600">{appointment.patient_address}</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Prescription Modal */}
//             <PrescriptionModal
//                 isOpen={showPrescriptionModal}
//                 onClose={() => setShowPrescriptionModal(false)}
//                 appointment={appointment}
//             />
//         </>
//     );
// };

// export default AppointmentCard;


import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    User,
    Phone,
    Mail,
    Eye,
    FileText,
    Stethoscope,
    DollarSign,
    TestTube,
} from 'lucide-react';
import axios from 'axios';
import PrescriptionModal from './PrescriptionModal';

// Helper functions (keep existing ones)
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

const getStatusBadge = (status) => {
    const statusConfig = {
        pending: {
            bg: 'bg-gradient-to-r from-amber-100 to-orange-100',
            text: 'text-amber-800',
            border: 'border-amber-200',
            label: 'Pending',
            icon: '⏳'
        },
        completed: {
            bg: 'bg-gradient-to-r from-green-100 to-emerald-100',
            text: 'text-green-800',
            border: 'border-green-200',
            label: 'Completed',
            icon: '✅'
        },
        cancelled: {
            bg: 'bg-gradient-to-r from-red-100 to-rose-100',
            text: 'text-red-800',
            border: 'border-red-200',
            label: 'Cancelled',
            icon: '❌'
        }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
            <span className="mr-1">{config.icon}</span>
            {config.label}
        </span>
    );
};

const AppointmentCard = ({
    appointment,
    onStatusUpdate,
    onViewPatientDetails,
    onViewInvestigationReports,
    currentStatus,
    showInvestigationButton = false
}) => {
    const [showDetails, setShowDetails] = useState(false);
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('pending');
    const [paymentLoading, setPaymentLoading] = useState(true);

    // Fetch payment status ONLY for completed appointments
    useEffect(() => {
        const fetchPaymentStatus = async () => {
            if (currentStatus === 'completed' && appointment.appointment_id) {
                try {
                    setPaymentLoading(true);
                    const response = await axios.get(`/api/payments/appointment/${appointment.appointment_id}`);
                    if (response.data && response.data.length > 0) {
                        setPaymentStatus(response.data[0].payment_status || 'pending');
                    } else {
                        setPaymentStatus('unpaid');
                    }
                } catch (error) {
                    console.error('Error fetching payment status:', error);
                    setPaymentStatus('unknown');
                } finally {
                    setPaymentLoading(false);
                }
            } else {
                setPaymentLoading(false);
            }
        };

        fetchPaymentStatus();
    }, [currentStatus, appointment.appointment_id]);

    // Get payment status badge
    const getPaymentStatusBadge = (status) => {
        const statusConfig = {
            paid: { color: 'bg-green-50 text-green-700 border-green-200', label: 'Paid', icon: '✅' },
            // pending: { color: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Pending', icon: '⏳' },
            // failed: { color: 'bg-red-50 text-red-700 border-red-200', label: 'Failed', icon: '❌' },
            unpaid: { color: 'bg-slate-50 text-slate-700 border-slate-200', label: 'Unpaid', icon: '💳' },
            unknown: { color: 'bg-gray-50 text-gray-600 border-gray-200', label: 'Unknown', icon: '❓' }
        };

        const config = statusConfig[status] || statusConfig.unknown;
        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
                <span className="mr-1">{config.icon}</span>
                {config.label}
            </span>
        );
    };

    // Get card gradient based on status
    const getCardGradient = () => {
        switch (currentStatus) {
            case 'pending':
                return 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-amber-200 hover:border-amber-300';
            case 'completed':
                return 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-300';
            case 'cancelled':
                return 'bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 border-red-200 hover:border-red-300';
            default:
                return 'bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 border-slate-200 hover:border-slate-300';
        }
    };

    const getActionButtons = () => {
        const buttons = [];

        if (currentStatus === 'pending') {
            buttons.push(
                <button
                    key="complete"
                    onClick={() => onStatusUpdate(appointment.appointment_id, 'completed')}
                    className="flex items-center space-x-1 px-2.5 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                    <span>✓</span>
                    <span>Complete</span>
                </button>
            );
            buttons.push(
                <button
                    key="cancel"
                    onClick={() => onStatusUpdate(appointment.appointment_id, 'cancelled')}
                    className="flex items-center space-x-1 px-2.5 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                    <span>✕</span>
                    <span>Cancel</span>
                </button>
            );
        }

        return buttons;
    };

    // Get prescription button text based on status
    const getPrescriptionButtonText = () => {
        return currentStatus === 'pending' ? 'Create Prescription' : 'Edit Prescription';
    };

    return (
        <>
            <div className={`${getCardGradient()} rounded-xl border p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm`}>
                {/* Header with Patient Info and Action Buttons */}
                <div className="flex justify-between items-start mb-4">
                    {/* Patient Info */}
                    <div className="flex items-center space-x-3 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-sm">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-800 flex items-center">
                                <User className="w-4 h-4 mr-1 text-blue-500" />
                                {appointment.patient_first_name} {appointment.patient_last_name}
                            </h3>
                            <p className="text-sm text-slate-600 flex items-center mt-0.5">
                                <span className="text-purple-500">Patient</span>
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons - Upper Right */}
                    <div className="flex flex-col items-end space-y-2 ml-4">
                        {getStatusBadge(appointment.status)}

                        {/* Action Buttons - Patient Colors */}
                        <div className="flex flex-wrap gap-1.5">
                            <button
                                onClick={() => setShowDetails(!showDetails)}
                                className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-500 hover:bg-slate-600 text-white rounded-lg text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                                title="Toggle Details"
                            >
                                <Eye className="w-3 h-3" />
                                <span>Toggle Details</span>
                            </button>
                            <button
                                onClick={() => onViewPatientDetails(appointment)}
                                className="flex items-center space-x-1 px-2.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                                title="Patient Details"
                            >
                                <Stethoscope className="w-3 h-3" />
                                <span>Patient Details</span>
                            </button>
                            {(currentStatus === 'pending' || currentStatus === 'completed' || showInvestigationButton) && (
                                <button
                                    onClick={() => setShowPrescriptionModal(true)}
                                    className="flex items-center space-x-1 px-2.5 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                                    title={getPrescriptionButtonText()}
                                >
                                    <FileText className="w-3 h-3" />
                                    <span>{getPrescriptionButtonText()}</span>
                                </button>
                            )}

                            {/* In your button section, add this new button for investigation reports */}
                            {showInvestigationButton && (
                                <button
                                    className="flex items-center space-x-1 px-2.5 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                                    onClick={() => onViewInvestigationReports(appointment)}
                                    title="View Investigation Reports"
                                >
                                    <TestTube className="w-3 h-3" />
                                    <span>View Reports ({appointment.investigation_count || 0})</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Appointment Details */}
                <div className="space-y-3 mb-4">
                    {/* Date and Time - Side by Side */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-slate-700 bg-white/70 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium">{formatDate(appointment.appointment_date)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-700 bg-white/70 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm">
                            <Clock className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium">{formatTime(appointment.appointment_time)}</span>
                        </div>
                    </div>

                    {/* Reason */}
                    {appointment.reason && (
                        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 shadow-sm">
                            <p className="text-sm text-slate-700">
                                <span className="font-medium text-purple-600">Reason:</span>{' '}
                                <span className="text-slate-600">{appointment.reason}</span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Contact Info and Action Buttons Row */}
                <div className="flex items-center justify-between text-xs text-slate-600">
                    {/* Contact Info - Left Side */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 bg-white/70 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm">
                            <Phone className="w-3 h-3 text-indigo-500" />
                            <span className="font-medium">{appointment.patient_phone || 'No phone'}</span>
                        </div>
                        <div className="flex items-center space-x-1 bg-white/70 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm">
                            <Mail className="w-3 h-3 text-cyan-500" />
                            <span className="font-medium">{appointment.patient_email || 'No email'}</span>
                        </div>
                    </div>

                    {/* Payment Status and Action Buttons - Bottom Right */}
                    <div className="flex items-center space-x-2">
                        {/* Payment Status - ONLY for completed appointments */}
                        {currentStatus === 'completed' && (
                            <div className="flex items-center space-x-1 bg-white/70 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm">
                                <DollarSign className="w-3 h-3 text-green-500" />
                                <span className="font-medium text-slate-600">Payment:</span>
                                {paymentLoading ? (
                                    <span className="inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                                        <div className="animate-spin rounded-full h-2 w-2 border-b border-gray-600 mr-1"></div>
                                        Loading...
                                    </span>
                                ) : (
                                    getPaymentStatusBadge(paymentStatus)
                                )}
                            </div>
                        )}

                        {/* Status Action Buttons */}
                        {getActionButtons()}
                    </div>
                </div>

                {/* Expanded Details */}
                {showDetails && (
                    <div className="mt-4 pt-4 border-t border-white/40">
                        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-slate-200 shadow-sm">
                            <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center">
                                <User className="w-4 h-4 mr-2 text-indigo-500" />
                                Patient Details
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="font-medium text-slate-700">Gender:</span>
                                    <span className="text-slate-600">{appointment.patient_gender || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-slate-700">Date of Birth:</span>
                                    <span className="text-slate-600">
                                        {appointment.date_of_birth ? formatDate(appointment.date_of_birth) : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-slate-700">Appointment Created:</span>
                                    <span className="text-slate-600">{formatDate(appointment.created_at)}</span>
                                </div>
                                {appointment.patient_address && (
                                    <div className="md:col-span-2 flex justify-between">
                                        <span className="font-medium text-slate-700">Address:</span>
                                        <span className="text-slate-600 text-right max-w-xs">{appointment.patient_address}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Prescription Modal */}
            <PrescriptionModal
                isOpen={showPrescriptionModal}
                onClose={() => setShowPrescriptionModal(false)}
                appointment={appointment}
            />
        </>
    );
};

export default AppointmentCard;
