import React from 'react';
import { 
    User, 
    Phone, 
    Mail, 
    MapPin, 
    Calendar, 
    Activity, 
    CheckCircle, 
    XCircle, 
    Clock,
    Eye,
    Heart
} from 'lucide-react';

const PatientCard = ({ patient, onViewDetails }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'Not available';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            completed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
            cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
            pending: { bg: 'bg-amber-100', text: 'text-amber-800', icon: Clock }
        };

        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                <Icon className="w-3 h-3 mr-1" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const getGenderColor = (gender) => {
        switch (gender?.toLowerCase()) {
            case 'male': return 'from-blue-400 to-blue-600';
            case 'female': return 'from-pink-400 to-pink-600';
            default: return 'from-purple-400 to-purple-600';
        }
    };

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
            {/* Header with Patient Info */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 bg-gradient-to-r ${getGenderColor(patient.gender)} rounded-full flex items-center justify-center shadow-sm`}>
                            <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800">
                                {patient.first_name} {patient.last_name}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-slate-600">
                                <span>{patient.gender}</span>
                                {patient.age && (
                                    <>
                                        <span>•</span>
                                        <span>{patient.age} years old</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => onViewDetails(patient)}
                        className="p-2 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                        title="View Patient Details"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                </div>

                {/* Contact Information */}
                <div className="space-y-2 mb-4">
                    {patient.phone_no && (
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                            <Phone className="w-4 h-4 text-green-500" />
                            <span>{patient.phone_no}</span>
                        </div>
                    )}
                    {patient.email && (
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                            <Mail className="w-4 h-4 text-blue-500" />
                            <span className="truncate">{patient.email}</span>
                        </div>
                    )}
                    {patient.address && (
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                            <MapPin className="w-4 h-4 text-red-500" />
                            <span className="truncate">{patient.address}</span>
                        </div>
                    )}
                </div>

                {/* Health Information */}
                {(patient.blood_group || patient.health_condition) && (
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-3 mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <Heart className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-medium text-red-700">Health Info</span>
                        </div>
                        {patient.blood_group && (
                            <div className="text-sm text-red-600">
                                <span className="font-medium">Blood Group:</span> {patient.blood_group}
                            </div>
                        )}
                        {patient.health_condition && (
                            <div className="text-sm text-red-600 mt-1">
                                <span className="font-medium">Condition:</span> {patient.health_condition}
                            </div>
                        )}
                    </div>
                )}

                {/* Appointment Statistics */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center bg-blue-50 rounded-lg p-3">
                        <div className="text-lg font-bold text-blue-600">{patient.total_appointments}</div>
                        <div className="text-xs text-blue-500">Total</div>
                    </div>
                    <div className="text-center bg-green-50 rounded-lg p-3">
                        <div className="text-lg font-bold text-green-600">{patient.completed_appointments}</div>
                        <div className="text-xs text-green-500">Completed</div>
                    </div>
                    <div className="text-center bg-red-50 rounded-lg p-3">
                        <div className="text-lg font-bold text-red-600">{patient.cancelled_appointments}</div>
                        <div className="text-xs text-red-500">Cancelled</div>
                    </div>
                </div>

                {/* Last Appointment Info */}
                <div className="border-t border-slate-200 pt-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-slate-700">Last Appointment</div>
                            <div className="text-sm text-slate-600">
                                {formatDate(patient.last_appointment_date)}
                            </div>
                        </div>
                        <div>
                            {getStatusBadge(patient.last_appointment_status)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientCard;
