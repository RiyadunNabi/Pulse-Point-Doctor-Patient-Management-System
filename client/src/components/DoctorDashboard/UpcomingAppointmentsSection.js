import React from 'react';
import { Calendar, Clock, User, Phone } from 'lucide-react';

function UpcomingAppointmentsSection({ appointments, doctorId }) {
    // Get today's and upcoming appointments
    const today = new Date();
    const upcomingAppointments = appointments
        .filter(apt => new Date(apt.appointment_date) >= today)
        .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date))
        .slice(0, 5);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            weekday: 'short'
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

    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Upcoming Appointments</h3>
                <Calendar className="w-5 h-5 text-sky-600" />
            </div>

            {upcomingAppointments.length === 0 ? (
                <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No upcoming appointments</p>
                    <p className="text-sm text-slate-400">Your schedule is clear</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {upcomingAppointments.map((appointment, index) => (
                        <div key={appointment.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800">
                                            {appointment.first_name} {appointment.last_name}
                                        </p>
                                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>{formatDate(appointment.appointment_date)}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{formatTime(appointment.appointment_time)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                        appointment.status === 'confirmed' 
                                            ? 'bg-green-100 text-green-700'
                                            : appointment.status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {appointment.status || 'scheduled'}
                                    </span>
                                    <button className="p-1 text-slate-400 hover:text-sky-600 rounded">
                                        <Phone className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Quick Actions */}
            <div className="mt-6 pt-4 border-t border-slate-200">
                <div className="grid grid-cols-2 gap-2">
                    <button className="px-3 py-2 text-sm text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors">
                        View All
                    </button>
                    <button className="px-3 py-2 text-sm text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors">
                        Manage Schedule
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UpcomingAppointmentsSection;
