import React, { useState } from 'react';
import { Clock, Calendar, Settings, Plus } from 'lucide-react';

function ScheduleSection({ doctorId }) {
    const [showScheduleModal, setShowScheduleModal] = useState(false);

    // Mock schedule data - replace with actual data
    const mockSchedule = [
        { day: 'Monday', startTime: '09:00', endTime: '17:00', isActive: true },
        { day: 'Tuesday', startTime: '09:00', endTime: '17:00', isActive: true },
        { day: 'Wednesday', startTime: '09:00', endTime: '17:00', isActive: true },
        { day: 'Thursday', startTime: '09:00', endTime: '17:00', isActive: true },
        { day: 'Friday', startTime: '09:00', endTime: '17:00', isActive: true },
        { day: 'Saturday', startTime: '10:00', endTime: '14:00', isActive: true },
        { day: 'Sunday', startTime: '', endTime: '', isActive: false }
    ];

    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Weekly Schedule</h3>
                <button
                    onClick={() => setShowScheduleModal(true)}
                    className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white rounded-lg text-sm transition-all duration-200"
                >
                    <Settings className="w-4 h-4" />
                    <span>Manage Schedule</span>
                </button>
            </div>

            {/* Schedule Overview */}
            <div className="space-y-3">
                {mockSchedule.map((schedule, index) => (
                    <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                            schedule.isActive
                                ? 'bg-green-50 border-green-200'
                                : 'bg-gray-50 border-gray-200'
                        }`}
                    >
                        <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                                schedule.isActive ? 'bg-green-500' : 'bg-gray-400'
                            }`}></div>
                            <span className="font-medium text-slate-700">
                                {schedule.day}
                            </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            {schedule.isActive ? (
                                <>
                                    <Clock className="w-4 h-4 text-slate-500" />
                                    <span className="text-sm text-slate-600">
                                        {schedule.startTime} - {schedule.endTime}
                                    </span>
                                </>
                            ) : (
                                <span className="text-sm text-slate-500">Closed</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-sky-600">6</p>
                        <p className="text-sm text-slate-600">Active Days</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">48</p>
                        <p className="text-sm text-slate-600">Hours/Week</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
                    Set Break Times
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
                    Block Time Slots
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
                    Holiday Schedule
                </button>
            </div>
        </div>
    );
}

export default ScheduleSection;
