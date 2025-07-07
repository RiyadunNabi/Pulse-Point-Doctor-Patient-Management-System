import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Calendar, Activity } from 'lucide-react';

function PatientAnalyticsSection({ doctorId }) {
    const [patientStats, setPatientStats] = useState({
        totalPatients: 0,
        newPatientsThisMonth: 0,
        returningPatients: 0,
        averageVisitsPerPatient: 0
    });

    // Mock data for now - replace with real API calls
    useEffect(() => {
        // This would be replaced with actual API calls
        setPatientStats({
            totalPatients: 156,
            newPatientsThisMonth: 23,
            returningPatients: 89,
            averageVisitsPerPatient: 2.4
        });
    }, [doctorId]);

    const statCards = [
        {
            title: 'Total Patients',
            value: patientStats.totalPatients,
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200'
        },
        {
            title: 'New This Month',
            value: patientStats.newPatientsThisMonth,
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200'
        },
        {
            title: 'Returning Patients',
            value: patientStats.returningPatients,
            icon: Calendar,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200'
        },
        {
            title: 'Avg Visits/Patient',
            value: patientStats.averageVisitsPerPatient.toFixed(1),
            icon: Activity,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200'
        }
    ];

    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Patient Analytics</h3>
                <Activity className="w-5 h-5 text-sky-600" />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                                    <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
                                </div>
                                <IconComponent className={`w-6 h-6 ${card.color}`} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 pt-4 border-t border-slate-200">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Patient Management</h4>
                <div className="space-y-2">
                    <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
                        View All Patients
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
                        Patient Health Reports
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
                        Follow-up Reminders
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PatientAnalyticsSection;
