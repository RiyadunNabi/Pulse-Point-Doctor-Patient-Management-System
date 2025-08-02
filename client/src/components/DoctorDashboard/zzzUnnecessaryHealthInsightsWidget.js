// File: client/src/components/DoctorDashboard/HealthInsightsWidget.js

import React from 'react';
import { Heart, AlertTriangle, TrendingUp, Users } from 'lucide-react';

function HealthInsightsWidget({ doctorId }) {
    const healthInsights = [
        {
            title: 'High Priority',
            value: '3',
            subtitle: 'Patients need follow-up',
            icon: AlertTriangle,
            color: 'text-red-600',
            bgColor: 'bg-red-50'
        },
        {
            title: 'Chronic Care',
            value: '15',
            subtitle: 'Ongoing treatments',
            icon: Heart,
            color: 'text-pink-600',
            bgColor: 'bg-pink-50'
        },
        {
            title: 'Improving',
            value: '12',
            subtitle: 'Positive trends',
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            title: 'New Patients',
            value: '5',
            subtitle: 'This week',
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        }
    ];

    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Health Insights</h3>
            
            <div className="space-y-4">
                {healthInsights.map((insight, index) => {
                    const IconComponent = insight.icon;
                    return (
                        <div key={index} className={`${insight.bgColor} rounded-lg p-3`}>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-700">{insight.title}</p>
                                    <p className={`text-2xl font-bold ${insight.color} mb-1`}>{insight.value}</p>
                                    <p className="text-xs text-slate-600">{insight.subtitle}</p>
                                </div>
                                <IconComponent className={`w-6 h-6 ${insight.color} mt-1`} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Health Alerts */}
            <div className="mt-6 pt-4 border-t border-slate-200">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Recent Alerts</h4>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-slate-600">Patient missed medication</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-slate-600">Lab results pending</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-slate-600">Treatment completed</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HealthInsightsWidget;
