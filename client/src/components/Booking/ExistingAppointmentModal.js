import React from 'react';
import { X, AlertCircle, Calendar, Clock, FileText, CheckCircle } from 'lucide-react';

const ExistingAppointmentModal = ({ 
  isOpen, 
  onClose, 
  doctorName, 
  appointmentData 
}) => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-2 rounded-full">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Appointment Already Exists
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              You already have a pending appointment with{' '}
              <span className="font-semibold text-blue-600">Dr. {doctorName}</span>.
              Please wait for your current appointment to be completed before booking a new one.
            </p>
          </div>

          {/* Existing Appointment Details */}
          {appointmentData && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                Your Current Appointment
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">
                    <span className="font-medium">Date:</span> {formatDate(appointmentData.appointment_date)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">
                    <span className="font-medium">Time:</span> {formatTime(appointmentData.appointment_time)}
                  </span>
                </div>
                
                {appointmentData.reason && (
                  <div className="flex items-start space-x-3">
                    <FileText className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span className="text-gray-700">
                      <span className="font-medium">Reason:</span> {appointmentData.reason}
                    </span>
                  </div>
                )}
                
                <div className="text-sm text-gray-500 pt-2 border-t border-blue-200">
                  Booked on {formatCreatedDate(appointmentData.created_at)}
                </div>
              </div>
            </div>
          )}

          {/* Info Message */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="bg-yellow-100 p-1 rounded-full flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">What can you do?</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Wait for your current appointment to be completed</li>
                  <li>Contact the doctor if you need to reschedule</li>
                  <li>Book with a different doctor if urgent</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExistingAppointmentModal;
