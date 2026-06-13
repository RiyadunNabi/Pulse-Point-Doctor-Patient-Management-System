import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    User, 
    Phone, 
    Mail, 
    MapPin, 
    Calendar, 
    Heart, 
    Activity,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';
import Modal from '../../../shared/Modal'; // Using your global modal

const PatientDetailsModal = ({ patient, onClose, doctorId, isOpen }) => {
    const [patientDetails, setPatientDetails] = useState(null);
    const [appointmentHistory, setAppointmentHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                setLoading(true);
                // PRIVACY FIX: Include doctorId in endpoint
                const response = await axios.get(`/api/doctor-patients/patient/${patient.patient_id}/doctor/${doctorId}`);
                setPatientDetails(response.data.patient);
                setAppointmentHistory(response.data.appointmentHistory);
            } catch (err) {
                console.error('Error fetching patient details:', err);
                if (err.response?.status === 404) {
                    setError('Patient not found or no appointments with this doctor');
                } else {
                    setError('Failed to load patient details');
                }
            } finally {
                setLoading(false);
            }
        };

        if (patient?.patient_id && doctorId && isOpen) {
            fetchPatientDetails();
        }
    }, [patient?.patient_id, doctorId, isOpen]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
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
            pending: { bg: 'bg-amber-100', text: 'text-amber-800', icon: Clock },
            completed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
            cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
        };

        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                <Icon className="w-3 h-3 mr-1" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`${patient?.first_name} ${patient?.last_name}`}
            subtitle={`Patient Details`}
            size="md"
        >

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
                    <span className="ml-3 text-slate-600">Loading patient details...</span>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                        <p className="text-red-700">{error}</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Patient Information */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Basic Info */}
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                                <User className="w-5 h-5 mr-2 text-blue-600" />
                                Basic Information
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm text-slate-700">
                                        <span className="font-medium">Age:</span> {patientDetails?.age || 'Not specified'} years
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <User className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm text-slate-700">
                                        <span className="font-medium">Gender:</span> {patientDetails?.gender || 'Not specified'}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm text-slate-700">
                                        <span className="font-medium">Date of Birth:</span> {patientDetails?.date_of_birth ? formatDate(patientDetails.date_of_birth) : 'Not specified'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                                <Phone className="w-5 h-5 mr-2 text-green-600" />
                                Contact Information
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <Phone className="w-4 h-4 text-green-500" />
                                    <span className="text-sm text-slate-700">
                                        {patientDetails?.phone_no || 'No phone number'}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Mail className="w-4 h-4 text-green-500" />
                                    <span className="text-sm text-slate-700 truncate">
                                        {patientDetails?.email || 'No email address'}
                                    </span>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <MapPin className="w-4 h-4 text-green-500 mt-0.5" />
                                    <span className="text-sm text-slate-700">
                                        {patientDetails?.address || 'No address provided'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Health Information */}
                    {(patientDetails?.blood_group || patientDetails?.health_condition) && (
                        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-200">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                                <Heart className="w-5 h-5 mr-2 text-red-600" />
                                Health Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {patientDetails?.blood_group && (
                                    <div>
                                        <span className="text-sm font-medium text-red-700">Blood Group:</span>
                                        <span className="ml-2 text-sm text-red-600">{patientDetails.blood_group}</span>
                                    </div>
                                )}
                                {patientDetails?.health_condition && (
                                    <div>
                                        <span className="text-sm font-medium text-red-700">Health Condition:</span>
                                        <span className="ml-2 text-sm text-red-600">{patientDetails.health_condition}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Appointment Statistics */}
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                            <Activity className="w-5 h-5 mr-2 text-purple-600" />
                            Appointment Statistics with You
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center bg-white/60 rounded-lg p-4">
                                <div className="text-2xl font-bold text-purple-600">{patient.total_appointments}</div>
                                <div className="text-sm text-purple-500">Total</div>
                            </div>
                            <div className="text-center bg-white/60 rounded-lg p-4">
                                <div className="text-2xl font-bold text-green-600">{patient.completed_appointments}</div>
                                <div className="text-sm text-green-500">Completed</div>
                            </div>
                            <div className="text-center bg-white/60 rounded-lg p-4">
                                <div className="text-2xl font-bold text-red-600">{patient.cancelled_appointments}</div>
                                <div className="text-sm text-red-500">Cancelled</div>
                            </div>
                            <div className="text-center bg-white/60 rounded-lg p-4">
                                <div className="text-2xl font-bold text-amber-600">{patient.pending_appointments}</div>
                                <div className="text-sm text-amber-500">Pending</div>
                            </div>
                        </div>
                    </div>

                    {/* Appointment History - No inner scroll, uses main page scroll */}
                    <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-6 border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                            <Calendar className="w-5 h-5 mr-2 text-slate-600" />
                            Appointment History with You
                        </h3>
                        {appointmentHistory.length === 0 ? (
                            <p className="text-sm text-slate-500">No appointment history available</p>
                        ) : (
                            <div className="space-y-3">
                                {appointmentHistory.map((appointment) => (
                                    <div key={appointment.appointment_id} className="bg-white rounded-lg p-4 border border-slate-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-sm font-medium text-slate-800">
                                                    {formatDate(appointment.appointment_date)} at {formatTime(appointment.appointment_time)}
                                                </div>
                                                {appointment.reason && (
                                                    <div className="text-sm text-slate-500 mt-1">
                                                        Reason: {appointment.reason}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                {getStatusBadge(appointment.status)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default PatientDetailsModal;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { 
//     X, 
//     User, 
//     Phone, 
//     Mail, 
//     MapPin, 
//     Calendar, 
//     Heart, 
//     Activity,
//     Clock,
//     CheckCircle,
//     XCircle,
//     AlertCircle
// } from 'lucide-react';

// const PatientDetailsModal = ({ patient, onClose, doctorId }) => { // Added doctorId prop for privacy
//     const [patientDetails, setPatientDetails] = useState(null);
//     const [appointmentHistory, setAppointmentHistory] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         const fetchPatientDetails = async () => {
//             try {
//                 setLoading(true);
//                 // PRIVACY FIX: Include doctorId in endpoint
//                 const response = await axios.get(`/api/doctor-patients/patient/${patient.patient_id}/doctor/${doctorId}`);
//                 setPatientDetails(response.data.patient);
//                 setAppointmentHistory(response.data.appointmentHistory);
//             } catch (err) {
//                 console.error('Error fetching patient details:', err);
//                 if (err.response?.status === 404) {
//                     setError('Patient not found or no appointments with this doctor');
//                 } else {
//                     setError('Failed to load patient details');
//                 }
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (patient?.patient_id && doctorId) {
//             fetchPatientDetails();
//         }
//     }, [patient.patient_id, doctorId]);

//     const formatDate = (dateString) => {
//         return new Date(dateString).toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric'
//         });
//     };

//     const formatTime = (timeString) => {
//         return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
//             hour: 'numeric',
//             minute: '2-digit',
//             hour12: true
//         });
//     };

//     const getStatusBadge = (status) => {
//         const statusConfig = {
//             pending: { bg: 'bg-amber-100', text: 'text-amber-800', icon: Clock },
//             completed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
//             cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
//         };

//         const config = statusConfig[status] || statusConfig.pending;
//         const Icon = config.icon;

//         return (
//             <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
//                 <Icon className="w-3 h-3 mr-1" />
//                 {status.charAt(0).toUpperCase() + status.slice(1)}
//             </span>
//         );
//     };

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//             {/* Background overlay */}
//             <div
//                 className="fixed inset-0 bg-black/60 backdrop-blur-sm"
//                 onClick={onClose}
//                 aria-hidden="true"
//             />

//             {/* Modal content */}
//             <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] mx-auto">
//                 {/* Header */}
//                 <div className="flex-shrink-0 px-6 py-4 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-t-2xl">
//                     <div className="flex items-start justify-between">
//                         <div className="flex items-center space-x-4">
//                             <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
//                                 <User className="w-8 h-8 text-white" />
//                             </div>
//                             <div>
//                                 <h2 className="text-2xl font-bold text-white tracking-wide">
//                                     {patient.first_name} {patient.last_name}
//                                 </h2>
//                                 <p className="text-sky-100">
//                                     Patient ID: {patient.patient_id}
//                                 </p>
//                             </div>
//                         </div>
//                         <button
//                             onClick={onClose}
//                             className="p-2 -mr-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
//                             aria-label="Close modal"
//                         >
//                             <X className="w-6 h-6" />
//                         </button>
//                     </div>
//                 </div>

//                 {/* Content - MODIFIED: Single scrollable container for entire content */}
//                 <div className="p-6 overflow-y-auto flex-1">
//                     {loading ? (
//                         <div className="flex items-center justify-center py-12">
//                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
//                             <span className="ml-3 text-slate-600">Loading patient details...</span>
//                         </div>
//                     ) : error ? (
//                         <div className="bg-red-50 border border-red-200 rounded-xl p-4">
//                             <div className="flex items-center">
//                                 <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
//                                 <p className="text-red-700">{error}</p>
//                             </div>
//                         </div>
//                     ) : (
//                         <div className="space-y-8">
//                             {/* Patient Information */}
//                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                                 {/* Basic Info */}
//                                 <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
//                                     <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
//                                         <User className="w-5 h-5 mr-2 text-blue-600" />
//                                         Basic Information
//                                     </h3>
//                                     <div className="space-y-3">
//                                         <div className="flex items-center space-x-3">
//                                             <Calendar className="w-4 h-4 text-blue-500" />
//                                             <span className="text-sm text-slate-700">
//                                                 <span className="font-medium">Age:</span> {patientDetails?.age || 'Not specified'} years
//                                             </span>
//                                         </div>
//                                         <div className="flex items-center space-x-3">
//                                             <User className="w-4 h-4 text-blue-500" />
//                                             <span className="text-sm text-slate-700">
//                                                 <span className="font-medium">Gender:</span> {patientDetails?.gender || 'Not specified'}
//                                             </span>
//                                         </div>
//                                         <div className="flex items-center space-x-3">
//                                             <Calendar className="w-4 h-4 text-blue-500" />
//                                             <span className="text-sm text-slate-700">
//                                                 <span className="font-medium">Date of Birth:</span> {patientDetails?.date_of_birth ? formatDate(patientDetails.date_of_birth) : 'Not specified'}
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Contact Info */}
//                                 <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
//                                     <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
//                                         <Phone className="w-5 h-5 mr-2 text-green-600" />
//                                         Contact Information
//                                     </h3>
//                                     <div className="space-y-3">
//                                         <div className="flex items-center space-x-3">
//                                             <Phone className="w-4 h-4 text-green-500" />
//                                             <span className="text-sm text-slate-700">
//                                                 {patientDetails?.phone_no || 'No phone number'}
//                                             </span>
//                                         </div>
//                                         <div className="flex items-center space-x-3">
//                                             <Mail className="w-4 h-4 text-green-500" />
//                                             <span className="text-sm text-slate-700 truncate">
//                                                 {patientDetails?.email || 'No email address'}
//                                             </span>
//                                         </div>
//                                         <div className="flex items-start space-x-3">
//                                             <MapPin className="w-4 h-4 text-green-500 mt-0.5" />
//                                             <span className="text-sm text-slate-700">
//                                                 {patientDetails?.address || 'No address provided'}
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Health Information */}
//                             {(patientDetails?.blood_group || patientDetails?.health_condition) && (
//                                 <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-200">
//                                     <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
//                                         <Heart className="w-5 h-5 mr-2 text-red-600" />
//                                         Health Information
//                                     </h3>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         {patientDetails?.blood_group && (
//                                             <div>
//                                                 <span className="text-sm font-medium text-red-700">Blood Group:</span>
//                                                 <span className="ml-2 text-sm text-red-600">{patientDetails.blood_group}</span>
//                                             </div>
//                                         )}
//                                         {patientDetails?.health_condition && (
//                                             <div>
//                                                 <span className="text-sm font-medium text-red-700">Health Condition:</span>
//                                                 <span className="ml-2 text-sm text-red-600">{patientDetails.health_condition}</span>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Appointment Statistics */}
//                             <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
//                                 <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
//                                     <Activity className="w-5 h-5 mr-2 text-purple-600" />
//                                     Appointment Statistics with You
//                                 </h3>
//                                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                                     <div className="text-center bg-white/60 rounded-lg p-4">
//                                         <div className="text-2xl font-bold text-purple-600">{patient.total_appointments}</div>
//                                         <div className="text-sm text-purple-500">Total</div>
//                                     </div>
//                                     <div className="text-center bg-white/60 rounded-lg p-4">
//                                         <div className="text-2xl font-bold text-green-600">{patient.completed_appointments}</div>
//                                         <div className="text-sm text-green-500">Completed</div>
//                                     </div>
//                                     <div className="text-center bg-white/60 rounded-lg p-4">
//                                         <div className="text-2xl font-bold text-red-600">{patient.cancelled_appointments}</div>
//                                         <div className="text-sm text-red-500">Cancelled</div>
//                                     </div>
//                                     <div className="text-center bg-white/60 rounded-lg p-4">
//                                         <div className="text-2xl font-bold text-amber-600">{patient.pending_appointments}</div>
//                                         <div className="text-sm text-amber-500">Pending</div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Appointment History - MODIFIED: Removed inner scroll, uses main page scroll */}
//                             <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-6 border border-slate-200">
//                                 <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
//                                     <Calendar className="w-5 h-5 mr-2 text-slate-600" />
//                                     Appointment History with You
//                                 </h3>
//                                 {appointmentHistory.length === 0 ? (
//                                     <p className="text-sm text-slate-500">No appointment history available</p>
//                                 ) : (
//                                     <div className="space-y-3">
//                                         {appointmentHistory.map((appointment) => (
//                                             <div key={appointment.appointment_id} className="bg-white rounded-lg p-4 border border-slate-200">
//                                                 <div className="flex items-center justify-between">
//                                                     <div>
//                                                         <div className="text-sm font-medium text-slate-800">
//                                                             {formatDate(appointment.appointment_date)} at {formatTime(appointment.appointment_time)}
//                                                         </div>
//                                                         {appointment.reason && (
//                                                             <div className="text-sm text-slate-500 mt-1">
//                                                                 Reason: {appointment.reason}
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                     <div>
//                                                         {getStatusBadge(appointment.status)}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PatientDetailsModal;
