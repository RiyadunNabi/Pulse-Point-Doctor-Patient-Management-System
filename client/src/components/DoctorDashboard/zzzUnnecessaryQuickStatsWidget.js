// File: client/src/components/DoctorDashboard/QuickStatsWidget.js

import React from 'react';
import { Activity, Clock, DollarSign, Star } from 'lucide-react';

function QuickStatsWidget({ doctorId }) {
    // Mock data - replace with real API calls
    const quickStats = [
        {
            title: 'Today\'s Revenue',
            value: '$1,250',
            icon: DollarSign,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            title: 'Avg Rating',
            value: '4.8',
            icon: Star,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50'
        },
        {
            title: 'Hours Today',
            value: '8.5',
            icon: Clock,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            title: 'Active Cases',
            value: '23',
            icon: Activity,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        }
    ];

    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Stats</h3>
            
            <div className="space-y-4">
                {quickStats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                        <div key={index} className={`${stat.bgColor} rounded-lg p-3`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600">{stat.title}</p>
                                    <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                                </div>
                                <IconComponent className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Mini Progress Indicators */}
            <div className="mt-6 pt-4 border-t border-slate-200">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Today's Progress</h4>
                <div className="space-y-3">
                    <div>
                        <div className="flex justify-between text-xs text-slate-600 mb-1">
                            <span>Appointments</span>
                            <span>8/10</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{width: '80%'}}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs text-slate-600 mb-1">
                            <span>Revenue Goal</span>
                            <span>$1,250/$1,500</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{width: '83%'}}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuickStatsWidget;
