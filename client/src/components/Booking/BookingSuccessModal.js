// client/src/components/Booking/BookingSuccessModal.js
import React from 'react';
import { CheckCircle, Calendar, Clock, MapPin, X } from 'lucide-react';

const BookingSuccessModal = ({ appointmentData, onClose }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60]">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl max-w-md w-full mx-4 border border-white/20 shadow-2xl">
                <div className="p-6">
                    {/* Success Icon */}
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    {/* Success Message */}
                    <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">
                            Appointment Booked Successfully!
                        </h3>
                        <p className="text-slate-600">
                            Your appointment has been confirmed. Here are the details:
                        </p>
                    </div>

                    {/* Appointment Details */}
                    <div className="space-y-4 mb-6">
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <div className="flex items-center mb-2">
                                <Calendar className="w-5 h-5 text-sky-500 mr-2" />
                                <span className="font-medium text-slate-800">Date</span>
                            </div>
                            <p className="text-slate-600 ml-7">
                                {formatDate(appointmentData.appointment_date)}
                            </p>
                        </div>

                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <div className="flex items-center mb-2">
                                <Clock className="w-5 h-5 text-sky-500 mr-2" />
                                <span className="font-medium text-slate-800">Time Details</span>
                            </div>
                            <div className="ml-7 space-y-1">
                                <p className="text-slate-600">
                                    <strong>Your Appointment Time:</strong> {formatTime(appointmentData.predicted_time)}
                                </p>
                                <p className="text-slate-500 text-sm">
                                    Slot Window: {formatTime(appointmentData.slot_window_start)} - {formatTime(appointmentData.slot_window_end)}
                                </p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-sky-50 to-cyan-50 rounded-lg p-4 border border-sky-200">
                            <div className="flex items-center mb-2">
                                <MapPin className="w-5 h-5 text-sky-500 mr-2" />
                                <span className="font-medium text-sky-800">Status</span>
                            </div>
                            <p className="text-sky-700 ml-7">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                    Pending Confirmation
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-lg hover:from-sky-600 hover:to-cyan-600 transition-all shadow-lg font-medium"
                        >
                            Got it, Thanks!
                        </button>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default BookingSuccessModal;
