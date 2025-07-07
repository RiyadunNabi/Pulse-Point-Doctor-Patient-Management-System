// File: client/src/components/DoctorDashboard/MedicalInsightsSection.js

import React from 'react';
import { Brain, FileText, Clock, Award } from 'lucide-react';

function MedicalInsightsSection({ doctorId }) {
    const insights = [
        {
            title: 'Diagnosis Accuracy',
            value: '94.2%',
            change: '+2.1%',
            trend: 'up',
            icon: Brain,
            color: 'text-blue-600'
        },
        {
            title: 'Treatment Success',
            value: '89.7%',
            change: '+1.5%',
            trend: 'up',
            icon: Award,
            color: 'text-green-600'
        },
        {
            title: 'Avg Consultation',
            value: '18 min',
            change: '-2 min',
            trend: 'down',
            icon: Clock,
            color: 'text-purple-600'
        },
        {
            title: 'Case Complexity',
            value: 'Medium',
            change: 'Stable',
            trend: 'stable',
            icon: FileText,
            color: 'text-orange-600'
        }
    ];

    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Medical Insights</h3>
                <Brain className="w-5 h-5 text-sky-600" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                {insights.map((insight, index) => {
                    const IconComponent = insight.icon;
                    return (
                        <div key={index} className="bg-slate-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <IconComponent className={`w-5 h-5 ${insight.color}`} />
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                    insight.trend === 'up' ? 'bg-green-100 text-green-700' :
                                    insight.trend === 'down' ? 'bg-red-100 text-red-700' :
                                    'bg-gray-100 text-gray-700'
                                }`}>
                                    {insight.change}
                                </span>
                            </div>
                            <p className={`text-xl font-bold ${insight.color} mb-1`}>{insight.value}</p>
                            <p className="text-xs text-slate-600">{insight.title}</p>
                        </div>
                    );
                })}
            </div>

            {/* Medical Knowledge Base */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Knowledge Updates</h4>
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">New treatment protocols</span>
                        <span className="text-blue-600 font-medium">3 available</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Drug interaction alerts</span>
                        <span className="text-orange-600 font-medium">2 updates</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Clinical guidelines</span>
                        <span className="text-green-600 font-medium">Updated</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MedicalInsightsSection;
