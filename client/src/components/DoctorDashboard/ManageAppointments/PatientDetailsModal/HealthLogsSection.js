import React from 'react';
import { Activity, Heart, Droplets, Moon, Scale, Zap } from 'lucide-react';

const HealthLogsSection = ({ healthLog, loading }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getHealthMetric = (icon, label, value, unit, color = 'text-gray-600') => (
        <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-gray-50`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className={`font-semibold ${color}`}>
                    {value ? `${value} ${unit}` : 'Not recorded'}
                </p>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
                <span className="ml-3 text-slate-600">Loading health logs...</span>
            </div>
        );
    }

    if (!healthLog) {
        return (
            <div className="text-center py-12">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Shared Health Logs
                </h3>
                <p className="text-gray-500">
                    The patient hasn't shared any health logs for this appointment.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-800">Shared Health Logs</h4>
                <span className="text-sm text-gray-500">
                    {healthLog.length} log{healthLog.length !== 1 ? 's' : ''} shared
                </span>
            </div>

            <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h5 className="font-medium text-gray-800">Health Log Entry</h5>
                        <span className="text-sm text-gray-500">
                            {formatDate(healthLog.created_at)}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {getHealthMetric(
                            <Scale className="w-5 h-5 text-blue-600" />,
                            'Weight',
                            healthLog.weight,
                            'kg',
                            'text-blue-700'
                        )}
                        {(healthLog.systolic || healthLog.diastolic) &&
                            getHealthMetric(
                                <Heart className="w-5 h-5 text-red-600" />,
                                'Blood Pressure',
                                healthLog.systolic && healthLog.diastolic
                                    ? `${healthLog.systolic}/${healthLog.diastolic}`
                                    : null,
                                'mmHg',
                                'text-red-700'
                            )}
                        {getHealthMetric(
                            <Zap className="w-5 h-5 text-yellow-600" />,
                            'Heart Rate',
                            healthLog.heart_rate,
                            'bpm',
                            'text-yellow-700'
                        )}
                        {getHealthMetric(
                            <Droplets className="w-5 h-5 text-purple-600" />,
                            'Blood Sugar',
                            healthLog.blood_sugar,
                            'mg/dL',
                            'text-purple-700'
                        )}
                        {getHealthMetric(
                            <Moon className="w-5 h-5 text-indigo-600" />,
                            'Sleep',
                            healthLog.sleep_hours,
                            'hours',
                            'text-indigo-700'
                        )}
                    </div>

                    {healthLog.notes && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500 mb-1">Notes</p>
                            <p className="text-gray-700">{healthLog.notes}</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default HealthLogsSection;
