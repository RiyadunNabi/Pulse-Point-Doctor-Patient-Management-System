import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, Eye, FileText, Stethoscope } from 'lucide-react';

// Helper functions
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

const getStatusBadge = (status) => {
    const statusConfig = {
        pending: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Pending' },
        completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
        cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
            {config.label}
        </span>
    );
};

const AppointmentCard = ({ 
    appointment, 
    onStatusUpdate, 
    onViewPatientDetails,
    currentStatus 
}) => {
    const [showDetails, setShowDetails] = useState(false);

    const getActionButtons = () => {
        const buttons = [];

        if (currentStatus === 'pending') {
            buttons.push(
                <button
                    key="complete"
                    onClick={() => onStatusUpdate(appointment.appointment_id, 'completed')}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors"
                >
                    Mark Complete
                </button>
            );
            buttons.push(
                <button
                    key="cancel"
                    onClick={() => onStatusUpdate(appointment.appointment_id, 'cancelled')}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-colors"
                >
                    Cancel
                </button>
            );
        }

        return buttons;
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800">
                                    {appointment.patient_first_name} {appointment.patient_last_name}
                                </h3>
                                <div className="flex items-center space-x-4 text-sm text-slate-600">
                                    <span className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        {formatDate(appointment.appointment_date)}
                                    </span>
                                    <span className="flex items-center">
                                        <Clock className="w-4 h-4 mr-1" />
                                        {formatTime(appointment.appointment_time)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {appointment.reason && (
                            <p className="text-sm text-slate-600 mb-3">
                                <strong>Reason:</strong> {appointment.reason}
                            </p>
                        )}

                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                            <Phone className="w-4 h-4" />
                            <span>{appointment.patient_phone || 'No phone'}</span>
                            <Mail className="w-4 h-4 ml-4" />
                            <span>{appointment.patient_email || 'No email'}</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                        {getStatusBadge(appointment.status)}
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setShowDetails(!showDetails)}
                                className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                                title="Toggle Details"
                            >
                                <Eye className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onViewPatientDetails(appointment)}
                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View Patient Details"
                            >
                                <Stethoscope className="w-4 h-4" />
                            </button>
                            <button
                                className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                                title="Create Prescription"
                            >
                                <FileText className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex space-x-2">
                            {getActionButtons()}
                        </div>
                    </div>
                </div>

                {/* Expanded Details */}
                {showDetails && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <strong className="text-slate-700">Patient ID:</strong>
                                <span className="ml-2 text-slate-600">{appointment.patient_id}</span>
                            </div>
                            <div>
                                <strong className="text-slate-700">Gender:</strong>
                                <span className="ml-2 text-slate-600">{appointment.patient_gender || 'Not specified'}</span>
                            </div>
                            <div>
                                <strong className="text-slate-700">Date of Birth:</strong>
                                <span className="ml-2 text-slate-600">
                                    {appointment.date_of_birth ? formatDate(appointment.date_of_birth) : 'Not specified'}
                                </span>
                            </div>
                            <div>
                                <strong className="text-slate-700">Appointment Created:</strong>
                                <span className="ml-2 text-slate-600">{formatDate(appointment.created_at)}</span>
                            </div>
                            {appointment.patient_address && (
                                <div className="md:col-span-2">
                                    <strong className="text-slate-700">Address:</strong>
                                    <span className="ml-2 text-slate-600">{appointment.patient_address}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentCard;
