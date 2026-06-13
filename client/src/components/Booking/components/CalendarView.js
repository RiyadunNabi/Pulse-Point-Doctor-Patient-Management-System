// client/src/components/Booking/components/CalendarView.js
import React from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, Users } from 'lucide-react';

const CalendarView = ({
  currentMonth,
  navigateMonth,
  getDaysInMonth,
  isDateAvailable,
  selectedDate,
  handleDateSelect,
  getSlotsForDate,
  selectedSlot,
  handleSlotSelect,
  formatTime,
  hasExistingAppointment
}) => {
  return (
    <>
      {/* Calendar Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-sky-600" />
            <span>Select Date</span>
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-sky-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium px-3 py-1 bg-white/80 rounded-lg">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-sky-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white/80 rounded-xl p-4 shadow-sm">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth).map((date, index) => (
              <button
                key={index}
                onClick={() => date && handleDateSelect(date)}
                disabled={!date || !isDateAvailable(date)}
                className={`
                  h-8 w-8 text-xs rounded-lg transition-all duration-200 flex items-center justify-center
                  ${!date ? 'invisible' : ''}
                  ${!date || !isDateAvailable(date) 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-sky-50 cursor-pointer'
                  }
                  ${selectedDate && date && date.toDateString() === selectedDate.toDateString()
                    ? 'bg-gradient-to-r from-sky-100 to-cyan-100 text-sky-800 shadow'
                    : ''
                  }
                  ${date && isDateAvailable(date) && (!selectedDate || date.toDateString() !== selectedDate.toDateString())
                    ? 'bg-green-50 text-green-700 font-medium'
                    : ''
                  }
                `}
              >
                {date ? date.getDate() : ''}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-green-600" />
            <span>Available Times - {selectedDate.toLocaleDateString()}</span>
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {getSlotsForDate(selectedDate).map((slot, index) => (
              <button
                key={index}
                onClick={() => handleSlotSelect(selectedDate, slot)}
                disabled={hasExistingAppointment}
                className={`
                  p-3 rounded-lg text-sm transition-all duration-200 border
                  ${selectedSlot && 
                    selectedSlot.start_time === slot.start_time && 
                    selectedSlot.end_time === slot.end_time
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-400 shadow-lg'
                    : 'bg-white/80 hover:bg-green-50 border-green-200 text-gray-700 hover:shadow-md'
                  }
                  ${hasExistingAppointment ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">
                      {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                    </div>
                    <div className="text-xs opacity-75">
                      {slot.location}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-xs">
                    <Users className="w-3 h-3" />
                    <span className="font-medium">{slot.available_slots || 0} slots</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default CalendarView;
