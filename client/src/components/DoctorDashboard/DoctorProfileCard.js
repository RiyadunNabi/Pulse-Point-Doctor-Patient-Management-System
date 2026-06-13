import React, { useState } from 'react';
import { Stethoscope, Edit, AlertTriangle, Star, MapPin, Phone, Mail } from 'lucide-react';
import EditDoctorProfileModal from './EditDoctorProfileModal/EditDoctorProfileModal';

// Helper function to check if profile is incomplete
const isProfileIncomplete = (doctor) => {
    if (!doctor) return true;

    const requiredFields = [
        'last_name',
        'bio',
        'consultation_fee',
        'license_no',
        'phone_no',
        'address'
    ];

    return requiredFields.some(field => !doctor[field] || doctor[field] === '');
};

function DoctorProfileCard({ doctor, onDoctorUpdate }) {
    const [showEditModal, setShowEditModal] = useState(false);

    const profileIncomplete = isProfileIncomplete(doctor);

    // // Called by EditDoctorProfileModal after successful update
    // const handleProfileUpdate = (updatedDoctor) => {
    //     onDoctorUpdate(updatedDoctor);
    // };

    return (
        <>
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-8">
                {/* Profile Completion Warning */}
                {profileIncomplete && (
                    <div className="mb-6 p-4 bg-amber-50/90 backdrop-blur-sm border border-amber-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                            <div>
                                <p className="text-amber-800 font-medium">Profile Incomplete</p>
                                <p className="text-amber-700 text-sm">
                                    Please complete your profile to provide better service to patients.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-6">
                        {/* Profile Picture */}
                        <div className="w-20 h-20 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full flex items-center justify-center">
                            <Stethoscope className="w-10 h-10 text-white" />
                        </div>

                        {/* Basic Info */}
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <h2 className="text-3xl font-bold text-slate-800">
                                    Dr. {doctor ? `${doctor.first_name} ${doctor.last_name || ''}`.trim() : 'Loading...'}
                                </h2>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 text-sm">
                                <div>
                                    <span className="text-slate-500">Department:</span>
                                    <span className="ml-2 font-medium text-slate-700">
                                        {doctor?.department_name || 'N/A'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-slate-500">License:</span>
                                    <span className="ml-2 font-medium text-slate-700">
                                        {doctor?.license_no || 'N/A'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-slate-500">Consultation Fee:</span>
                                    <span className="ml-2 font-medium text-slate-700">
                                        {doctor?.consultation_fee ? `$${doctor.consultation_fee}` : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="w-4 h-4 text-slate-500 mr-1" />
                                    <span className="font-medium text-slate-700">
                                        {doctor?.phone_no || 'N/A'}
                                    </span>
                                </div>
                                <div className="md:col-span-2 lg:col-span-2 flex items-center">
                                    <MapPin className="w-4 h-4 text-slate-500 mr-1" />
                                    <span className="font-medium text-slate-700">
                                        {doctor?.address || 'N/A'}
                                    </span>
                                </div>
                                <div className="md:col-span-2 flex items-center">
                                    <Mail className="w-4 h-4 text-slate-500 mr-1" />
                                    <span className="font-medium text-slate-700">
                                        {doctor?.email || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Edit Profile Button */}
                    <button
                        onClick={() => setShowEditModal(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
                    >
                        <Edit className="w-4 h-4" />
                        <span>Edit Profile</span>
                    </button>
                </div>

                {/* Bio Section */}
                {doctor?.bio && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-700 mb-2">About</h3>
                        <p className="text-slate-600 text-sm bg-blue-50/50 p-3 rounded-lg">
                            {doctor.bio}
                        </p>
                    </div>
                )}
            </div>

            {/* Edit Profile Modal */}
            {<EditDoctorProfileModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                doctor={doctor}
                onUpdate={onDoctorUpdate}
            />}
        </>
    );
}

export default DoctorProfileCard;
