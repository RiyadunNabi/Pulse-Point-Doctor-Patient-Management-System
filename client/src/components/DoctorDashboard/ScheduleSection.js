import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Clock, Calendar, Plus, Edit, Trash2, MapPin, Users, Repeat, CalendarDays } from 'lucide-react';
import ScheduleModal from './ScheduleModal';

function ScheduleSection({ doctorId }) {
    const [scheduleConfig, setScheduleConfig] = useState({ recurring: [], specific: [] });
    const [availableSlots, setAvailableSlots] = useState([]);
    const [activeTab, setActiveTab] = useState('available');
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    // Standard weekday mapping (0=Sunday, 6=Saturday)
    const weekdays = [
        { id: 0, name: 'Sunday', short: 'Sun' },
        { id: 1, name: 'Monday', short: 'Mon' },
        { id: 2, name: 'Tuesday', short: 'Tue' },
        { id: 3, name: 'Wednesday', short: 'Wed' },
        { id: 4, name: 'Thursday', short: 'Thu' },
        { id: 5, name: 'Friday', short: 'Fri' },
        { id: 6, name: 'Saturday', short: 'Sat' }
    ];

    const fetchScheduleConfig = useCallback(async () => {
        try {
            const response = await axios.get(`/api/schedule/config/${doctorId}`);
            setScheduleConfig(response.data);
        } catch (error) {
            console.error('Error fetching schedule config:', error);
        }
    }, [doctorId]);

    const fetchAvailableSlots = useCallback(async () => {
        try {
            setLoading(true);
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
    }, [doctorId]);

    useEffect(() => {
        if (doctorId) {
            fetchScheduleConfig();
            fetchAvailableSlots();
        }
    }, [doctorId, fetchScheduleConfig, fetchAvailableSlots]);

    const handleScheduleAdded = useCallback(() => {
        fetchScheduleConfig();
        fetchAvailableSlots();
    }, [fetchScheduleConfig, fetchAvailableSlots]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    // Group available slots by date
    const groupedSlots = availableSlots.reduce((acc, slot) => {
        const date = slot.slot_date;
        if (!acc[date]) acc[date] = [];
        acc[date].push(slot);
        return acc;
    }, {});

    // Handle delete schedule entry
    const handleDeleteEntry = async (entryId) => {
        if (!window.confirm('Are you sure you want to delete this schedule entry?')) return;
        
        try {
            await axios.delete(`/api/schedule/${entryId}`);
            fetchScheduleConfig();
            fetchAvailableSlots();
        } catch (error) {
            console.error('Error deleting schedule entry:', error);
        }
    };

    if (loading) {
        return (
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-slate-200 rounded w-1/3 mb-6"></div>
                    <div className="space-y-3">
                        {[1,2,3,4,5].map(i => (
                            <div key={i} className="h-16 bg-slate-100 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-6">
            {/* Header with Tabs */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('available')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            activeTab === 'available'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Available Slots
                    </button>
                    <button
                        onClick={() => setActiveTab('recurring')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            activeTab === 'recurring'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <Repeat className="w-4 h-4 inline mr-2" />
                        Weekly Schedule
                    </button>
                    <button
                        onClick={() => setActiveTab('specific')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            activeTab === 'specific'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <CalendarDays className="w-4 h-4 inline mr-2" />
                        Specific Dates
                    </button>
                </div>
                
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white rounded-lg text-sm transition-all duration-200"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Schedule</span>
                </button>
            </div>

            {/* Available Slots View */}
            {activeTab === 'available' && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">
                        Available Appointment Slots (Next 3 Months)
                    </h3>
                    
                    {Object.keys(groupedSlots).length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>No available slots found. Add some schedules to see available appointments.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 max-h-96 overflow-y-auto">
                            {Object.entries(groupedSlots).map(([date, slots]) => (
                                <div key={date} className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-medium text-slate-800">
                                            {formatDate(date)}
                                        </h4>
                                        <span className="text-sm text-blue-600 font-medium">
                                            {slots.length} slot{slots.length > 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                        {slots.map((slot, index) => (
                                            <div key={`${date}-${index}`} className="bg-white rounded-md p-2 border border-blue-100">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-1">
                                                        <Clock className="w-3 h-3 text-slate-500" />
                                                        <span className="text-xs font-medium text-slate-700">
                                                            {formatTime(slot.start_time)}
                                                        </span>
                                                    </div>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                                        slot.available_slots > 0 
                                                            ? 'bg-green-100 text-green-700' 
                                                            : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        {slot.available_slots > 0 ? 'Available' : 'Full'}
                                                    </span>
                                                </div>
                                                {slot.location && (
                                                    <p className="text-xs text-slate-600 mt-1">{slot.location}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Recurring Schedule View */}
            {activeTab === 'recurring' && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">
                        Weekly Recurring Schedule
                    </h3>
                    
                    <div className="space-y-3">
                        {weekdays.map(day => {
                            const daySchedules = scheduleConfig.recurring.filter(s => s.weekday === day.id);
                            return (
                                <div key={day.id} className={`border rounded-lg p-4 transition-all duration-200 ${
                                    daySchedules.length > 0 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                                }`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-3 h-3 rounded-full ${
                                                daySchedules.length > 0 ? 'bg-green-500' : 'bg-gray-400'
                                            }`}></div>
                                            <span className="font-medium text-slate-700">
                                                {day.name}
                                            </span>
                                        </div>
                                        
                                        {daySchedules.length === 0 ? (
                                            <span className="text-sm text-slate-500">No schedule</span>
                                        ) : (
                                            <span className="text-sm text-green-600 font-medium">
                                                {daySchedules.length} schedule{daySchedules.length > 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {daySchedules.length > 0 && (
                                        <div className="space-y-2">
                                            {daySchedules.map((schedule) => (
                                                <div key={schedule.id} className="bg-white rounded-md p-3 border border-green-100">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="flex items-center space-x-2">
                                                                <Clock className="w-4 h-4 text-slate-500" />
                                                                <span className="text-sm font-medium text-slate-700">
                                                                    {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                                                                </span>
                                                            </div>
                                                            
                                                            {schedule.max_per_hour && (
                                                                <div className="flex items-center space-x-1">
                                                                    <Users className="w-4 h-4 text-blue-500" />
                                                                    <span className="text-sm text-blue-600">
                                                                        {schedule.max_per_hour}/hr
                                                                    </span>
                                                                </div>
                                                            )}
                                                            
                                                            {schedule.location && (
                                                                <div className="flex items-center space-x-1">
                                                                    <MapPin className="w-4 h-4 text-purple-500" />
                                                                    <span className="text-sm text-purple-600">
                                                                        {schedule.location}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                onClick={() => handleDeleteEntry(schedule.id)}
                                                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Specific Dates View */}
            {activeTab === 'specific' && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">
                        Specific Date Schedules
                    </h3>
                    
                    {scheduleConfig.specific.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <CalendarDays className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>No specific date schedules found. Add some to see them here.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {scheduleConfig.specific.map(schedule => (
                                <div key={schedule.id} className="border rounded-lg p-4 bg-purple-50 border-purple-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div>
                                                <p className="font-medium text-slate-800">{formatDate(schedule.specific_date)}</p>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <Clock className="w-4 h-4 text-slate-500" />
                                                    <span className="text-sm text-slate-600">
                                                        {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {schedule.max_per_hour && (
                                                <div className="flex items-center space-x-1">
                                                    <Users className="w-4 h-4 text-purple-500" />
                                                    <span className="text-sm text-purple-600">
                                                        {schedule.max_per_hour}/hr
                                                    </span>
                                                </div>
                                            )}
                                            
                                            {schedule.location && (
                                                <div className="flex items-center space-x-1">
                                                    <MapPin className="w-4 h-4 text-purple-500" />
                                                    <span className="text-sm text-purple-600">
                                                        {schedule.location}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleDeleteEntry(schedule.id)}
                                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Schedule Statistics */}
            <div className="mt-6 bg-slate-50 rounded-lg p-4">
                <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold text-sky-600">
                            {scheduleConfig.recurring.length + scheduleConfig.specific.length}
                        </p>
                        <p className="text-sm text-slate-600">Total Schedules</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-green-600">
                            {weekdays.filter(day => 
                                scheduleConfig.recurring.some(s => s.weekday === day.id)
                            ).length}
                        </p>
                        <p className="text-sm text-slate-600">Active Days</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-purple-600">
                            {scheduleConfig.specific.length}
                        </p>
                        <p className="text-sm text-slate-600">Specific Dates</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-orange-600">
                            {Object.keys(groupedSlots).length}
                        </p>
                        <p className="text-sm text-slate-600">Available Days</p>
                    </div>
                </div>
            </div>

            {/* Schedule Modal */}
            {showAddModal && (
                <ScheduleModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    doctorId={doctorId}
                    onScheduleAdded={handleScheduleAdded}
                />
            )}
        </div>
    );
}

export default ScheduleSection;