// client/src/components/Booking/components/BookingSummary.js
import React from 'react';
import { CheckCircle, AlertCircle, Users } from 'lucide-react';

const BookingSummary = ({
  selectedSlot,
  selectedDate,
  formatTime,
  handleBooking,
  bookingLoading,
  hasExistingAppointment,
  reason
}) => {
  if (!selectedSlot) return null;

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
      <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
        <CheckCircle className="w-4 h-4 text-amber-600" />
        <span>Appointment Summary</span>
      </h3>
      <div className="bg-white/80 rounded-lg p-3 mb-4 space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-600">Date:</span>
          <span className="font-medium">
            {selectedDate ? selectedDate.toLocaleDateString() : new Date(selectedSlot.date).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Time:</span>
          <span className="font-medium">
            {formatTime(selectedSlot.start_time)} - {formatTime(selectedSlot.end_time)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Location:</span>
          <span className="font-medium">{selectedSlot.location}</span>
        </div>
        {selectedSlot.available_slots && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Available Slots:</span>
            <span className="font-medium flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{selectedSlot.available_slots}</span>
            </span>
          </div>
        )}
      </div>
      
      <button
        onClick={handleBooking}
        disabled={bookingLoading || hasExistingAppointment || !reason.trim()}
        className="w-full bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 disabled:from-gray-300 disabled:to-gray-400 text-white py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {bookingLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
        ) : (
          <>
            <CheckCircle className="w-4 h-4" />
            <span>Book Appointment</span>
          </>
        )}
      </button>
    </div>
  );
};

export default BookingSummary;
