import React, { useState } from 'react';
import { X, Clock, Calendar, MapPin, Users, Repeat, CalendarDays } from 'lucide-react';
import axios from 'axios';

function ScheduleModal({ isOpen, onClose, doctorId, onScheduleAdded }) {
    const [scheduleType, setScheduleType] = useState('recurring'); // 'recurring' or 'specific'
    const [formData, setFormData] = useState({
        weekday: '',
        specific_date: '',
        start_time: '',
        end_time: '',
        max_per_hour: 1,
        location: '',
        start_date: '',
        end_date: ''
    });
    const [loading, setLoading] = useState(false);

    const weekdays = [
        { id: 0, name: 'Sunday' },
        { id: 1, name: 'Monday' },
        { id: 2, name: 'Tuesday' },
        { id: 3, name: 'Wednesday' },
        { id: 4, name: 'Thursday' },
        { id: 5, name: 'Friday' },
        { id: 6, name: 'Saturday' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const endpoint = scheduleType === 'recurring'
                ? '/api/schedule/recurring'
                : '/api/schedule/specific';

            const payload = {
                doctor_id: doctorId,
                ...formData
            };

            // Clean up payload based on schedule type
            if (scheduleType === 'recurring') {
                delete payload.specific_date;
                payload.weekday = parseInt(payload.weekday);
            } else {
                delete payload.weekday;
                delete payload.start_date;
                delete payload.end_date;
            }

            await axios.post(endpoint, payload);

            // Reset form
            setFormData({
                weekday: '',
                specific_date: '',
                start_time: '',
                end_time: '',
                max_per_hour: 1,
                location: '',
                start_date: '',
                end_date: ''
            });

            onScheduleAdded(); // Refresh parent component
            onClose(); // Close modal
        } catch (error) {
            console.error('Error creating schedule:', error);

            // More detailed error handling
            if (error.response?.status === 500) {
                alert('Database error. Please ensure the doctor_schedule table exists and try again.');
            } else if (error.response?.status === 400) {
                alert(`Validation error: ${error.response.data.error}`);
            } else {
                alert('Error creating schedule. Please check your internet connection and try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold text-slate-800">Add New Schedule</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Schedule Type Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">
                            Schedule Type
                        </label>
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={() => setScheduleType('recurring')}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${scheduleType === 'recurring'
                                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                                        : 'bg-gray-50 border-gray-200 text-gray-600'
                                    }`}
                            >
                                <Repeat className="w-4 h-4" />
                                <span>Weekly Recurring</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setScheduleType('specific')}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${scheduleType === 'specific'
                                        ? 'bg-purple-50 border-purple-200 text-purple-700'
                                        : 'bg-gray-50 border-gray-200 text-gray-600'
                                    }`}
                            >
                                <CalendarDays className="w-4 h-4" />
                                <span>Specific Date</span>
                            </button>
                        </div>
                    </div>

                    {/* Weekday Selection (for recurring) */}
                    {scheduleType === 'recurring' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Day of Week *
                            </label>
                            <select
                                name="weekday"
                                value={formData.weekday}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select a day</option>
                                {weekdays.map(day => (
                                    <option key={day.id} value={day.id}>
                                        {day.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Specific Date Selection */}
                    {scheduleType === 'specific' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Specific Date *
                            </label>
                            <input
                                type="date"
                                name="specific_date"
                                value={formData.specific_date}
                                onChange={handleInputChange}
                                min={new Date().toISOString().split('T')[0]}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    )}

                    {/* Time Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Start Time *
                            </label>
                            <input
                                type="time"
                                name="start_time"
                                value={formData.start_time}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                End Time *
                            </label>
                            <input
                                type="time"
                                name="end_time"
                                value={formData.end_time}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Max Patients Per Hour */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            <Users className="w-4 h-4 inline mr-1" />
                            Max Patients Per Hour
                        </label>
                        <input
                            type="number"
                            name="max_per_hour"
                            value={formData.max_per_hour}
                            onChange={handleInputChange}
                            min="1"
                            max="10"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            <MapPin className="w-4 h-4 inline mr-1" />
                            Location
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="e.g., Room 101, Online"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Recurring Schedule Date Range */}
                    {scheduleType === 'recurring' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Start Date (Optional)
                                </label>
                                <input
                                    type="date"
                                    name="start_date"
                                    value={formData.start_date}
                                    onChange={handleInputChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    End Date (Optional)
                                </label>
                                <input
                                    type="date"
                                    name="end_date"
                                    value={formData.end_date}
                                    onChange={handleInputChange}
                                    min={formData.start_date || new Date().toISOString().split('T')[0]}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Schedule'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ScheduleModal;
