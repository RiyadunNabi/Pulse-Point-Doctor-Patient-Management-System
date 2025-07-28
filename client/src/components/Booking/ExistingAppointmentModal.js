// client/src/components/Booking/ExistingAppointmentModal.js
import React from 'react';
import { X, AlertCircle, Calendar, Clock, CheckCircle } from 'lucide-react';

const ExistingAppointmentModal = ({ isOpen, onClose, doctorName, existingAppointment }) => {
  if (!isOpen) return null;

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

  const formatCreatedDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Safe access to appointment data - handle different possible structures
  const getAppointmentData = () => {
    if (!existingAppointment) return null;
    
    // Check if existingAppointment has an 'appointment' property
    if (existingAppointment.appointment) {
      return existingAppointment.appointment;
    }
    
    // Check if existingAppointment itself is the appointment data
    if (existingAppointment.appointment_date) {
      return existingAppointment;
    }
    
    return null;
  };

  const appointmentData = getAppointmentData();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-red-200 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header - Using colors from second component */}
        <div className="bg-gradient-to-r from-red-500 to-rose-500 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">Appointment Already Exists</h2>
              <p className="text-red-100 text-sm">Cannot book duplicate appointment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Warning Message */}
          <div className="bg-orange-50/80 backdrop-blur-sm border border-orange-200/50 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-orange-500 mt-0.5" size={20} />
              <div>
                <p className="text-slate-800 font-medium">
                  You already have a pending appointment with{' '}
                  <span className="text-orange-600 font-semibold">Dr. {doctorName}</span>.
                </p>
                <p className="text-slate-600 text-sm mt-1">
                  Please wait for your current appointment to be completed before booking a new one.
                </p>
              </div>
            </div>
          </div>

          {/* Existing Appointment Details */}
          {appointmentData ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center">
                <Calendar className="mr-2 text-sky-500" size={18} />
                Your Pending Appointment
              </h3>
              
              <div className="space-y-3">
                {appointmentData.appointment_date && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-sm">Date:</span>
                    <span className="font-medium text-slate-800">
                      {formatDate(appointmentData.appointment_date)}
                    </span>
                  </div>
                )}
                
                {(appointmentData.start_time || appointmentData.appointment_time) && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-sm">Time:</span>
                    <span className="font-medium text-slate-800">
                      {appointmentData.start_time 
                        ? `${formatTime(appointmentData.start_time)} - ${formatTime(appointmentData.end_time)}`
                        : formatTime(appointmentData.appointment_time)
                      }
                    </span>
                  </div>
                )}
                
                {appointmentData.reason && (
                  <div className="flex items-start justify-between">
                    <span className="text-slate-500 text-sm">Reason:</span>
                    <span className="font-medium text-slate-800 text-right max-w-[200px]">
                      {appointmentData.reason}
                    </span>
                  </div>
                )}

                {appointmentData.location && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-sm">Location:</span>
                    <span className="font-medium text-slate-800">
                      {appointmentData.location}
                    </span>
                  </div>
                )}
                
                {appointmentData.created_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-sm">Booked on:</span>
                    <span className="font-medium text-slate-800">
                      {formatCreatedDate(appointmentData.created_at)}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-sm">Status:</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100/80 text-yellow-800">
                    <Clock size={12} className="mr-1" />
                    {appointmentData.status || 'Pending Confirmation'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center">
                <Calendar className="mr-2 text-sky-500" size={18} />
                Your Pending Appointment
              </h3>
              <p className="text-slate-600 text-sm">
                Appointment details are not available at the moment.
              </p>
            </div>
          )}

          {/* What can you do section */}
          <div className="bg-green-50/80 backdrop-blur-sm border border-green-200/50 rounded-xl p-4">
            <h3 className="font-semibold text-slate-800 mb-2 flex items-center">
              <CheckCircle className="mr-2 text-green-500" size={18} />
              What can you do?
            </h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Wait for the doctor to confirm your pending appointment</li>
              <li>• Contact the clinic if you need to reschedule</li>
              <li>• Cancel your current appointment to book a new one</li>
              <li>• Book with a different doctor if urgent</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 font-medium py-3 px-4 rounded-lg transition-colors backdrop-blur-sm"
            >
              Close
            </button>
            <button
              className="flex-1 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              onClick={() => {
                // You can add navigation to appointments page here
                console.log('Navigate to appointments');
                onClose();
              }}
            >
              View Appointments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExistingAppointmentModal;
