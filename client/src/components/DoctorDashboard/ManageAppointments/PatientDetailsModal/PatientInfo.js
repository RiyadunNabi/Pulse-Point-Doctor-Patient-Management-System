import React from 'react';
import { Calendar, Phone, Mail, MapPin, User } from 'lucide-react';

const PatientInfo = ({ patient }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return 'Not specified';
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return `${age} years old`;
    };

    return (
        <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800 border-b border-gray-200 pb-2">
                        Basic Information
                    </h4>
                    
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                            <User className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Full Name</p>
                                <p className="font-medium text-gray-800">
                                    {patient.patient_first_name} {patient.patient_last_name}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Date of Birth</p>
                                <p className="font-medium text-gray-800">
                                    {formatDate(patient.date_of_birth)}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {calculateAge(patient.date_of_birth)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <User className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Gender</p>
                                <p className="font-medium text-gray-800">
                                    {patient.patient_gender || 'Not specified'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800 border-b border-gray-200 pb-2">
                        Contact Information
                    </h4>
                    
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Phone Number</p>
                                <p className="font-medium text-gray-800">
                                    {patient.patient_phone || 'Not provided'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Email Address</p>
                                <p className="font-medium text-gray-800">
                                    {patient.patient_email || 'Not provided'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                            <div>
                                <p className="text-sm text-gray-500">Address</p>
                                <p className="font-medium text-gray-800">
                                    {patient.patient_address || 'Not provided'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Appointment Information */}
            <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
                    Appointment Details
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Appointment Date</p>
                        <p className="font-medium text-gray-800">
                            {formatDate(patient.appointment_date)}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Appointment Time</p>
                        <p className="font-medium text-gray-800">
                            {new Date(`2000-01-01T${patient.appointment_time}`).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                            })}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            patient.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                            patient.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                            {patient.status?.charAt(0).toUpperCase() + patient.status?.slice(1)}
                        </span>
                    </div>
                </div>

                {patient.reason && (
                    <div className="mt-4">
                        <p className="text-sm text-gray-500">Reason for Visit</p>
                        <p className="font-medium text-gray-800 mt-1">
                            {patient.reason}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientInfo;
