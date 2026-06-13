// client/src/components/Booking/components/ScrollableSlotsList.js
import React from 'react';
import { Clock, Users } from 'lucide-react';

const ScrollableSlotsList = ({
  groupedSlots,
  formatDate,
  formatTime,
  selectedSlot,
  handleSlotSelect,
  hasExistingAppointment,
  loading
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-sky-500 border-t-transparent"></div>
      </div>
    );
  }

  if (Object.keys(groupedSlots).length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No available slots found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
        <Clock className="w-5 h-5 text-sky-600" />
        <span>Available Appointment Slots</span>
      </h3>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {Object.entries(groupedSlots)
          .sort(([a], [b]) => new Date(a) - new Date(b))
          .map(([date, slots]) => (
            <div key={date} className="bg-white/80 rounded-xl p-4 shadow-sm border border-sky-100">
              <h4 className="font-semibold text-gray-800 mb-3 sticky top-0 bg-white/90 py-2 -mx-4 px-4 rounded-t-xl border-b border-sky-100">
                {formatDate(date)}
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {slots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => handleSlotSelect(date, slot)}
                    disabled={hasExistingAppointment}
                    className={`
                      p-3 rounded-lg text-sm transition-all duration-200 border text-left
                      ${selectedSlot && 
                        selectedSlot.date === date &&
                        selectedSlot.start_time === slot.start_time && 
                        selectedSlot.end_time === slot.end_time
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 shadow'
                        : 'bg-white/80 hover:bg-green-50 border-gray-200 text-gray-700 hover:shadow'
                      }
                      ${hasExistingAppointment ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">
                          {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                        </div>
                        <div className="text-xs opacity-75 mt-1">
                          📍 {slot.location}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-xs">
                        <Users className="w-3 h-3" />
                        <span className="font-medium">
                          {slot.available_slots || 0} available
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ScrollableSlotsList;
