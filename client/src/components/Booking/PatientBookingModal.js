

// client/src/components/Booking/PatientBookingModal.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  FileText, 
  Activity, 
  X, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Stethoscope,
  Heart,
  Weight,
  Droplets,
  Moon,
  Gauge,
  Users
} from 'lucide-react';
import BookingSuccessModal from './BookingSuccessModal';
import ExistingAppointmentModal from './ExistingAppointmentModal';
import HealthDataSection from './components/HealthDataSection';

const PatientBookingModal = ({ doctorId, doctorName, user, isOpen, onClose, onBookingSuccess }) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(false);
  
  // Calendar navigation
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showExistingModal, setShowExistingModal] = useState(false);
  const [appointmentResult, setAppointmentResult] = useState(null);
  const [existingAppointment, setExistingAppointment] = useState(null);
  const [hasExistingAppointment, setHasExistingAppointment] = useState(false);
  
  // Health data states
  const [healthData, setHealthData] = useState({});
  const [shareHealthLog, setShareHealthLog] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [previewDocument, setPreviewDocument] = useState(null);

  // Group slots by date for list view
  const groupedSlots = availableSlots.reduce((acc, slot) => {
    const date = slot.slot_date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {});

  // Calendar functionality
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getAvailableDates = () => {
    return availableSlots.map(slot => slot.slot_date);
  };

  const getSlotsForDate = (date) => {
    if (!date) return [];
    // FIX: Use local date string instead of UTC to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    return availableSlots.filter(slot => slot.slot_date === dateString);
  };

  const isDateAvailable = (date) => {
    if (!date) return false;
    // FIX: Use local date string instead of UTC to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    return dateString >= todayString && getAvailableDates().includes(dateString);
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(prevMonth.getMonth() + direction);
      return newMonth;
    });
  };

  // Format functions
  const formatDate = (dateString) => {
    // FIX: Create date without timezone conversion
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
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

  const checkExistingAppointment = async () => {
    if (!user?.patient_id || !doctorId) return;
    setCheckingExisting(true);
    try {
      const response = await axios.get(
        `/api/appointments/check-existing/${user.patient_id}/${doctorId}`
      );
      const data = response.data;
      if (data.has_pending) {
        setHasExistingAppointment(true);
        setExistingAppointment(data);
        setShowExistingModal(true);
      } else {
        setHasExistingAppointment(false);
        setExistingAppointment(null);
      }
    } catch (error) {
      console.error('Error checking existing appointment:', error);
      setHasExistingAppointment(false);
    } finally {
      setCheckingExisting(false);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!doctorId) return;
    setLoading(true);
    try {
      const today = new Date();
      const startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
      const endDateString = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;
      
      const response = await axios.get(`/api/schedule/available/${doctorId}`, {
        params: { startDate, endDate: endDateString }
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
      console.log('Fetching health data for patient:', user.patient_id); // Debug log
      const response = await axios.get(`/api/appointments/patient-health-data/${user.patient_id}`);
      console.log('Health data received:', response.data); // Debug log
      setHealthData(response.data);
    } catch (error) {
      console.error('Error fetching health data:', error);
    }
  };

  const handleDateSelect = (date) => {
    if (!date || !isDateAvailable(date)) return;
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (date, slot) => {
    if (hasExistingAppointment) return;
    
    // FIX: Handle both date object and date string
    let dateString;
    if (typeof date === 'string') {
      dateString = date;
    } else {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      dateString = `${year}-${month}-${day}`;
    }
    
    setSelectedSlot({
      date: dateString,
      start_time: slot.start_time,
      end_time: slot.end_time,
      max_per_hour: slot.max_per_hour,
      location: slot.location,
      available_slots: slot.available_slots
    });
  };

  const handleDocumentToggle = (documentId) => {
    setSelectedDocuments(prev =>
      prev.includes(documentId)
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  const handleDocumentPreview = async (documentId) => {
    try {
      const response = await axios.get(`/api/medical-documents/${documentId}/download`, {
        responseType: 'blob'
      });
      const url = URL.createObjectURL(response.data);
      setPreviewDocument({ id: documentId, url });
    } catch (error) {
      console.error('Error previewing document:', error);
    }
  };

  const handleBooking = async () => {
    if (hasExistingAppointment) {
      setShowExistingModal(true);
      return;
    }

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
    setSelectedDate(null);
    setReason('');
    setShareHealthLog(false);
    setSelectedDocuments([]);
    setHasExistingAppointment(false);
    setExistingAppointment(null);
    setShowExistingModal(false);
    setPreviewDocument(null);
    onClose();
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    handleClose();
    onBookingSuccess?.(appointmentResult);
  };

  const handleExistingClose = () => {
    setShowExistingModal(false);
  };

  useEffect(() => {
    if (isOpen && doctorId && user?.patient_id) {
      checkExistingAppointment();
      fetchAvailableSlots();
      fetchHealthData();
    }
  }, [isOpen, doctorId, user?.patient_id]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden border border-white/20 shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <Stethoscope className="w-5 h-5" />
                <span>Book Appointment with Dr. {doctorName}</span>
              </h2>
              <p className="text-sky-100 text-sm">Select your preferred date and time</p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-h-[calc(90vh-80px)] overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Loading State for Existing Check */}
              {checkingExisting && (
                <div className="p-4 text-center border border-sky-200 rounded-xl bg-sky-50">
                  <div className="inline-flex items-center space-x-2 text-sky-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-sky-600 border-t-transparent"></div>
                    <span>Checking existing appointments...</span>
                  </div>
                </div>
              )}

              {/* Existing Appointment Warning */}
              {hasExistingAppointment && !checkingExisting && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="text-orange-500 mt-0.5" size={20} />
                    <div className="flex-1">
                      <p className="text-slate-800 font-medium">
                        You already have a pending appointment with Dr. {doctorName}
                      </p>
                      <p className="text-slate-600 text-sm mt-1">
                        Please complete or cancel your existing appointment before booking a new one.
                      </p>
                      <button
                        onClick={() => setShowExistingModal(true)}
                        className="text-orange-600 hover:text-orange-700 text-sm font-medium mt-2 underline"
                      >
                        View existing appointment details
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Top Section: Scrollable Slots (Left) + Calendar (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Scrollable Appointment Slots */}
                <div className="bg-gradient-to-br from-sky-50 to-cyan-50 rounded-xl p-4 border border-sky-200">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2 mb-4">
                    <Clock className="w-5 h-5 text-sky-600" />
                    <span>Available Appointment Slots</span>
                  </h3>

                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-sky-500 border-t-transparent"></div>
                    </div>
                  ) : Object.keys(groupedSlots).length === 0 ? (
                    <div className="text-center py-12">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No available slots found</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                      {Object.entries(groupedSlots)
                        .sort(([a], [b]) => new Date(a) - new Date(b))
                        .map(([date, slots]) => (
                          <div key={date} className="bg-white/80 rounded-lg p-3 shadow-sm border border-sky-100">
                            <h4 className="font-semibold text-gray-800 mb-3 text-sm">
                              {formatDate(date)}
                            </h4>
                            <div className="grid grid-cols-1 gap-2">
                              {slots.map((slot, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleSlotSelect(date, slot)}
                                  disabled={hasExistingAppointment}
                                  className={`
                                    p-2 rounded-lg text-xs transition-all duration-200 border text-left
                                    ${selectedSlot && 
                                      selectedSlot.date === date &&
                                      selectedSlot.start_time === slot.start_time && 
                                      selectedSlot.end_time === slot.end_time
                                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-400 shadow-lg'
                                      : 'bg-gray-50 hover:bg-green-50 border-gray-200 text-gray-700 hover:shadow-md'
                                    }
                                    ${hasExistingAppointment ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                  `}
                                >
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <div className="font-medium">
                                        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                                      </div>
                                      <div className="opacity-75 mt-1">
                                        📍 {slot.location}
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Users className="w-3 h-3" />
                                      <span className="font-medium">
                                        {slot.available_slots || 0}
                                      </span>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Right: Calendar View */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <span>Calendar View</span>
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigateMonth(-1)}
                        className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-medium px-3 py-1 bg-white/80 rounded-lg">
                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                      <button
                        onClick={() => navigateMonth(1)}
                        className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="bg-white/80 rounded-lg p-3 shadow-sm">
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
                              : 'text-gray-700 hover:bg-green-100 cursor-pointer'
                            }
                            ${selectedDate && date && date.toDateString() === selectedDate.toDateString()
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                              : ''
                            }
                            ${date && isDateAvailable(date) && (!selectedDate || date.toDateString() !== selectedDate.toDateString())
                              ? 'bg-green-100 text-green-700 font-medium'
                              : ''
                            }
                          `}
                        >
                          {date ? date.getDate() : ''}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Date Slots */}
                  {selectedDate && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">
                        Slots for {selectedDate.toLocaleDateString()}
                      </h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {getSlotsForDate(selectedDate).map((slot, index) => (
                          <button
                            key={index}
                            onClick={() => handleSlotSelect(selectedDate, slot)}
                            disabled={hasExistingAppointment}
                            className={`
                              w-full p-2 rounded-lg text-xs transition-all duration-200 border text-left
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
                                <div className="opacity-75">
                                  {slot.location}
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="w-3 h-3" />
                                <span className="font-medium">{slot.available_slots || 0}</span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Health Data Section */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  <span>Health Data & Documents</span>
                </h3>
                
                <HealthDataSection
                  healthData={healthData}
                  shareHealthLog={shareHealthLog}
                  setShareHealthLog={setShareHealthLog}
                  selectedDocuments={selectedDocuments}
                  handleDocumentToggle={handleDocumentToggle}
                  handleDocumentPreview={handleDocumentPreview}
                  hasExistingAppointment={hasExistingAppointment}
                />

                {/* Fallback if no health data */}
                {(!healthData.latest_health_log_id && (!healthData.medical_documents || healthData.medical_documents.length === 0)) && (
                  <div className="bg-white/80 rounded-lg p-4 text-center">
                    <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No health data or medical documents available to share</p>
                  </div>
                )}
              </div>

              {/* Bottom Section: Reason for Appointment */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Reason for Appointment *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please describe your symptoms or reason for visit..."
                  className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  rows={4}
                  disabled={hasExistingAppointment}
                />
              </div>

              {/* Booking Summary & Action */}
              {selectedSlot && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Appointment Summary</span>
                  </h3>
                  <div className="bg-white/80 rounded-lg p-3 mb-4 grid grid-cols-2 gap-4 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {selectedDate ? selectedDate.toLocaleDateString() : formatDate(selectedSlot.date)}
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
                        <span className="text-gray-600">Available:</span>
                        <span className="font-medium flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{selectedSlot.available_slots} slots</span>
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
              )}

              {/* Existing Appointment Warning */}
              {hasExistingAppointment && (
                <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border border-red-200">
                  <div className="flex items-center space-x-2 text-red-700">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-semibold">Existing Appointment Found</span>
                  </div>
                  <p className="text-xs text-red-600 mt-1">
                    You have a pending appointment with Dr. {doctorName}. Please complete or cancel it first.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      {previewDocument && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibled text-white">Document Preview</h3>
              <button
                onClick={() => setPreviewDocument(null)}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 max-h-[calc(90vh-80px)] overflow-auto">
              <iframe
                src={previewDocument.url}
                className="w-full h-96 border rounded-lg"
                title="Document Preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <BookingSuccessModal
          isOpen={showSuccessModal}
          onClose={handleSuccessClose}
          appointmentData={appointmentResult}
          doctorName={doctorName}
        />
      )}

      {/* Existing Appointment Modal */}
      {showExistingModal && (
        <ExistingAppointmentModal
          isOpen={showExistingModal}
          onClose={handleExistingClose}
          existingAppointment={existingAppointment}
          doctorName={doctorName}
        />
      )}
    </>
  );
};

export default PatientBookingModal;
