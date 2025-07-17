// client/src/components/Booking/PatientBookingModal.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, CheckCircle, FileText, Activity, X } from 'lucide-react';
import BookingSuccessModal from './BookingSuccessModal';
import HealthDataSelector from './HealthDataSelector';

const PatientBookingModal = ({ doctorId, user, isOpen, onClose, onBookingSuccess }) => {
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [appointmentResult, setAppointmentResult] = useState(null);
    const [healthData, setHealthData] = useState({});
    const [shareHealthLog, setShareHealthLog] = useState(false);
    const [selectedDocuments, setSelectedDocuments] = useState([]);

    const fetchAvailableSlots = async () => {
        if (!doctorId) return;
        setLoading(true);
        try {
            const startDate = new Date().toISOString().split('T')[0];
            const endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const response = await axios.get(`/api/schedule/available/${doctorId}`, {
                params: { startDate, endDate }
            });
            setAvailableSlots(response.data);
        } catch (error) {
            console.error('Error fetching available slots:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchHealthData = async () => {
        if (!user?.patient_id) return;
        try {
            const response = await axios.get(`/api/appointments/patient-health-data/${user.patient_id}`);
            setHealthData(response.data);
        } catch (error) {
            console.error('Error fetching health data:', error);
        }
    };

    const groupedSlots = availableSlots.reduce((acc, slot) => {
        const date = slot.slot_date;
        if (!acc[date]) acc[date] = [];
        acc[date].push(slot);
        return acc;
    }, {});

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    };

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const handleSlotSelect = (date, slot) => {
        setSelectedSlot({
            date,
            start_time: slot.start_time,
            end_time: slot.end_time,
            max_per_hour: slot.max_per_hour,
            location: slot.location
        });
    };

    const handleBooking = async () => {
        const slot = selectedSlot;
        if (!slot || !reason.trim()) {
            alert('Please select a time slot and provide a reason for the appointment.');
            return;
        }

        setBookingLoading(true);
        try {
            const payload = {
                doctor_id: doctorId,
                patient_id: user.patient_id,
                appointment_date: slot.date,
                start_time: slot.start_time,
                end_time: slot.end_time,
                max_per_hour: slot.max_per_hour,
                reason: reason.trim(),
                shared_health_log_id: shareHealthLog ? healthData.latest_health_log_id : null,
                shared_document_ids: selectedDocuments.length > 0 ? selectedDocuments : null
            };

            const response = await axios.post('/api/appointments', payload);

            if (response.status === 201) {
                setAppointmentResult(response.data);
                setShowSuccessModal(true);
                // onBookingSuccess?.(response.data);
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            alert(error.response?.data?.error || 'Failed to book appointment. Please try again.');
        } finally {
            setBookingLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedSlot(null);
        setReason('');
        setShareHealthLog(false);
        setSelectedDocuments([]);
        onClose();
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        handleClose();
        onBookingSuccess?.(appointmentResult);
    };

    useEffect(() => {
        if (isOpen && doctorId) {
            fetchAvailableSlots();
            fetchHealthData();
        }
    }, [isOpen, doctorId]);

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl">
                    {/* Header */}
                    <div className="flex justify-between items-center p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-slate-800">
                            Book Appointment
                        </h2>
                        <button
                            onClick={handleClose}
                            className="text-slate-500 hover:text-slate-700 text-2xl p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
                                <span className="ml-3 text-slate-600">Loading available slots...</span>
                            </div>
                        ) : (
                            <>
                                {/* Available Slots */}
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                                        <Calendar className="w-5 h-5 mr-2 text-sky-500" />
                                        Available Time Slots
                                    </h3>

                                    {Object.keys(groupedSlots).length === 0 ? (
                                        <div className="text-center py-8 text-slate-500">
                                            No available slots found for the next 3 months.
                                        </div>
                                    ) : (
                                        <div className="space-y-4 max-h-60 overflow-y-auto">
                                            {Object.entries(groupedSlots).map(([date, slots]) => (
                                                <div key={date} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                                    <h4 className="font-medium text-slate-800 mb-3">
                                                        {formatDate(date)}
                                                    </h4>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                                        {slots.filter(slot => slot.available_slots > 0).map((slot, index) => (
                                                            <button
                                                                key={`${date}-${index}`}
                                                                onClick={() => handleSlotSelect(date, slot)}
                                                                className={`p-3 rounded-lg border transition-all ${
                                                                    selectedSlot?.date === date && selectedSlot?.start_time === slot.start_time
                                                                        ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white border-sky-500 shadow-lg'
                                                                        : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-sky-50'
                                                                }`}
                                                            >
                                                                <div className="text-sm font-medium">
                                                                    {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                                                                </div>
                                                                {slot.location && (
                                                                    <div className="text-xs opacity-75 mt-1">
                                                                        {slot.location}
                                                                    </div>
                                                                )}
                                                                <div className="text-xs text-green-600 mt-1">
                                                                    {slot.available_slots} available
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Selected Slot Display */}
                                {selectedSlot && (
                                    <div className="bg-gradient-to-r from-sky-50 to-cyan-50 rounded-xl p-4 border border-sky-200">
                                        <h4 className="font-semibold text-sky-800 mb-2 flex items-center">
                                            <CheckCircle className="w-5 h-5 mr-2" />
                                            Selected Appointment Window
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <p className="text-sky-700">
                                                    <strong>Date:</strong> {formatDate(selectedSlot.date)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sky-700">
                                                    <strong>Time Window:</strong> {formatTime(selectedSlot.start_time)} - {formatTime(selectedSlot.end_time)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sky-700">
                                                    <strong>Your Probable Time:</strong> <span className="font-medium">Will be assigned automatically</span>
                                                </p>
                                            </div>
                                        </div>
                                        {selectedSlot.location && (
                                            <p className="text-sky-700 mt-2">
                                                <strong>Location:</strong> {selectedSlot.location}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Health Data Sharing */}
                                <HealthDataSelector
                                    healthData={healthData}
                                    shareHealthLog={shareHealthLog}
                                    setShareHealthLog={setShareHealthLog}
                                    selectedDocuments={selectedDocuments}
                                    setSelectedDocuments={setSelectedDocuments}
                                />

                                {/* Reason Input */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        <FileText className="w-4 h-4 inline mr-2" />
                                        Reason for Appointment *
                                    </label>
                                    <textarea
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder="Please describe your symptoms or reason for the appointment..."
                                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none bg-white/95"
                                        rows="4"
                                        required
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        onClick={handleClose}
                                        className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleBooking}
                                        disabled={!selectedSlot || !reason.trim() || bookingLoading}
                                        className="px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-lg hover:from-sky-600 hover:to-cyan-600 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all shadow-lg"
                                    >
                                        {bookingLoading ? (
                                            <div className="flex items-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Booking...
                                            </div>
                                        ) : (
                                            'Book Appointment'
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && appointmentResult && (
                <BookingSuccessModal
                    appointmentData={appointmentResult}
                    onClose={handleSuccessClose}
                />
            )}
        </>
    );
};

export default PatientBookingModal;










// // client/src/components/Booking/PatientBookingModal.js

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const PatientBookingModal = ({ doctorId, user, isOpen, onClose, onBookingSuccess }) => {
//     const [availableSlots, setAvailableSlots] = useState([]);
//     const [selectedSlot, setSelectedSlot] = useState(null);
//     const [reason, setReason] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [bookingLoading, setBookingLoading] = useState(false);

//     const fetchAvailableSlots = async () => {
//         if (!doctorId) return;

//         setLoading(true);
//         try {
//             const startDate = new Date().toISOString().split('T')[0];
//             const endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

//             const response = await axios.get(`/api/schedule/available/${doctorId}`, {
//                 params: { startDate, endDate }
//             });
//             setAvailableSlots(response.data);
//         } catch (error) {
//             console.error('Error fetching available slots:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const groupedSlots = availableSlots.reduce((acc, slot) => {
//         const date = slot.slot_date;
//         if (!acc[date]) acc[date] = [];
//         acc[date].push(slot);
//         return acc;
//     }, {});

//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         const today = new Date();
//         const tomorrow = new Date(today);
//         tomorrow.setDate(tomorrow.getDate() + 1);

//         if (date.toDateString() === today.toDateString()) {
//             return 'Today';
//         } else if (date.toDateString() === tomorrow.toDateString()) {
//             return 'Tomorrow';
//         } else {
//             return date.toLocaleDateString('en-US', {
//                 weekday: 'long',
//                 year: 'numeric',
//                 month: 'long',
//                 day: 'numeric'
//             });
//         }
//     };

//     const formatTime = (timeString) => {
//         const [hours, minutes] = timeString.split(':');
//         const hour = parseInt(hours);
//         const ampm = hour >= 12 ? 'PM' : 'AM';
//         const displayHour = hour % 12 || 12;
//         return `${displayHour}:${minutes} ${ampm}`;
//     };

//     const handleSlotSelect = (date, slot) => {
//         setSelectedSlot({
//             date,
//             start_time: slot.start_time,
//             end_time: slot.end_time,
//             max_per_hour: slot.max_per_hour,
//         });
//     };

//     const handleBooking = async () => {
//         const slot = selectedSlot;

//         // if (!selectedSlot || !reason.trim()) {
//         if (!slot || !reason.trim()) {
//             alert('Please select a time slot and provide a reason for the appointment.');
//             return;
//         }

//         setBookingLoading(true);
//         try {
//             // const patientId = localStorage.getItem('userId'); // Adjust based on your auth system
//             // const patientId = user?.patient_id;
//             const payload = {
//                 doctor_id: doctorId,
//                 // patient_id: user?.patient_id,
//                 patient_id: user.patient_id,
//                 appointment_date: slot.date,
//                 // appointment_date: (
//                 //     typeof slot.date === 'string'
//                 //     ? slot.date.split('T')[0]
//                 //     : slot.date.toISOString().split('T')[0]
//                 // ),
//                 start_time: slot.start_time,        // window start
//                 end_time: slot.end_time,          // window end
//                 max_per_hour: slot.max_per_hour,   // slots per hour
//                 reason: reason.trim()
//             };
//             console.log('Booking payload:', payload);

//             // console.log({
//             //     doctor_id: doctorId,
//             //     patient_id: patientId,
//             //     appointment_date: selectedSlot.date
//             // });


//             // const response = await axios.post('/api/appointments', {
//             //     doctor_id: doctorId,
//             //     patient_id: patientId,
//             //     appointment_date: selectedSlot.date,
//             //     appointment_time: selectedSlot.time,
//             //     reason: reason.trim()
//             // });

//             const response = await axios.post('/api/appointments', payload);

//             if (response.status === 201) {
//                 // onBookingSuccess && onBookingSuccess(response.data);
//                 // handleClose();
//                 onBookingSuccess?.(response.data);
//                 handleClose();
//             }
//         } catch (error) {
//             console.error('Error booking appointment:', error);
//             alert(error.response?.data?.error || 'Failed to book appointment. Please try again.');
//         } finally {
//             setBookingLoading(false);
//         }
//     };

//     const handleClose = () => {
//         setSelectedSlot(null);
//         setReason('');
//         onClose();
//     };

//     useEffect(() => {
//         if (isOpen && doctorId) {
//             fetchAvailableSlots();
//         }
//     }, [isOpen, doctorId]);

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
//                 {/* Header */}
//                 <div className="flex justify-between items-center p-6 border-b">
//                     <h2 className="text-xl font-semibold text-gray-800">
//                         Book Appointment
//                     </h2>
//                     <button
//                         onClick={handleClose}
//                         className="text-gray-500 hover:text-gray-700 text-2xl"
//                     >
//                         ×
//                     </button>
//                 </div>

//                 {/* Content */}
//                 <div className="p-6">
//                     {loading ? (
//                         <div className="flex justify-center items-center py-8">
//                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//                             <span className="ml-2 text-gray-600">Loading available slots...</span>
//                         </div>
//                     ) : (
//                         <>
//                             {/* Available Slots */}
//                             <div className="mb-6">
//                                 <h3 className="text-lg font-medium text-gray-800 mb-4">
//                                     Available Time Slots
//                                 </h3>

//                                 {Object.keys(groupedSlots).length === 0 ? (
//                                     <div className="text-center py-8 text-gray-500">
//                                         No available slots found for the next 3 months.
//                                     </div>
//                                 ) : (
//                                     <div className="space-y-4 max-h-60 overflow-y-auto">
//                                         {Object.entries(groupedSlots).map(([date, slots]) => (
//                                             <div key={date} className="border rounded-lg p-4">
//                                                 <h4 className="font-medium text-slate-800 mb-3">
//                                                     {formatDate(date)}
//                                                 </h4>

//                                                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
//                                                     {slots.filter(slot => slot.available_slots > 0).map((slot, index) => (
//                                                         <button
//                                                             key={`${date}-${index}`}
//                                                             onClick={() => handleSlotSelect(date, slot)}
//                                                             className={`p-3 rounded-lg border transition-all ${selectedSlot?.date === date && selectedSlot?.time === slot.start_time
//                                                                 ? 'bg-blue-500 text-white border-blue-500'
//                                                                 : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
//                                                                 }`}
//                                                         >
//                                                             <div className="text-sm font-medium">
//                                                                 {formatTime(slot.start_time)}
//                                                             </div>
//                                                             {slot.location && (
//                                                                 <div className="text-xs text-gray-500 mt-1">
//                                                                     {slot.location}
//                                                                 </div>
//                                                             )}
//                                                             <div className="text-xs text-green-600 mt-1">
//                                                                 {slot.available_slots} available
//                                                             </div>
//                                                         </button>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Selected Slot Display */}
//                             {selectedSlot && (
//                                 <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
//                                     <h4 className="font-medium text-blue-800 mb-2">Selected Appointment</h4>
//                                     <p className="text-blue-700">
//                                         <strong>Date:</strong> {formatDate(selectedSlot.date)}
//                                     </p>
//                                     <p className="text-blue-700">
//                                         <strong>Time:</strong> {formatTime(selectedSlot.start_time)}
//                                     </p>
//                                     {selectedSlot.location && (
//                                         <p className="text-blue-700">
//                                             <strong>Location:</strong> {selectedSlot.location}
//                                         </p>
//                                     )}
//                                 </div>
//                             )}

//                             {/* Reason Input */}
//                             <div className="mb-6">
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Reason for Appointment *
//                                 </label>
//                                 <textarea
//                                     value={reason}
//                                     onChange={(e) => setReason(e.target.value)}
//                                     placeholder="Please describe your symptoms or reason for the appointment..."
//                                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
//                                     rows="4"
//                                     required
//                                 />
//                             </div>

//                             {/* Action Buttons */}
//                             <div className="flex justify-end space-x-3">
//                                 <button
//                                     onClick={handleClose}
//                                     className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     onClick={handleBooking}
//                                     disabled={!selectedSlot || !reason.trim() || bookingLoading}
//                                     className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
//                                 >
//                                     {bookingLoading ? 'Booking...' : 'Book Appointment'}
//                                 </button>
//                             </div>
//                         </>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PatientBookingModal;
