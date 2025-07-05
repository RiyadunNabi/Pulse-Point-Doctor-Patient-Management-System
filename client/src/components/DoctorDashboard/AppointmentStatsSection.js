import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, Users, TrendingUp } from 'lucide-react';

function AppointmentStatsSection({ appointments, doctorId }) {
    const [stats, setStats] = useState({
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
        today: 0,
        thisWeek: 0,
        totalPatients: 0
    });

    useEffect(() => {
        if (appointments && appointments.length > 0) {
            const today = new Date();
            const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
            const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));

            const newStats = {
                pending: appointments.filter(apt => apt.status === 'pending').length,
                confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
                completed: appointments.filter(apt => apt.status === 'completed').length,
                cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
                today: appointments.filter(apt => {
                    const aptDate = new Date(apt.appointment_date);
                    return aptDate.toDateString() === new Date().toDateString();
                }).length,
                thisWeek: appointments.filter(apt => {
                    const aptDate = new Date(apt.appointment_date);
                    return aptDate >= startOfWeek && aptDate <= endOfWeek;
                }).length,
                totalPatients: new Set(appointments.map(apt => apt.patient_id)).size
            };

            setStats(newStats);
        }
    }, [appointments]);

    const statCards = [
        {
            title: 'Pending Appointments',
            value: stats.pending,
            icon: Clock,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200'
        },
        {
            title: 'Confirmed Today',
            value: stats.today,
            icon: Calendar,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200'
        },
        {
            title: 'Completed',
            value: stats.completed,
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200'
        },
        {
            title: 'Total Patients',
            value: stats.totalPatients,
            icon: Users,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200'
        }
    ];

    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Appointment Overview</h3>
                <TrendingUp className="w-5 h-5 text-sky-600" />
            </div>

            <div className="space-y-4">
                {statCards.map((card, index) => {
                    const IconComponent = card.icon;
                    return (
                        <div
                            key={index}
                            className={`${card.bgColor} ${card.borderColor} border rounded-lg p-4 transition-all duration-200 hover:shadow-md`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600">{card.title}</p>
                                    <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                                </div>
                                <IconComponent className={`w-8 h-8 ${card.color}`} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 pt-6 border-t border-slate-200">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Quick Actions</h4>
                <div className="space-y-2">
                    <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
                        View Today's Schedule
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
                        Manage Appointments
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
                        Set Availability
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AppointmentStatsSection;
