import React, { useState, useEffect } from 'react';
import { 
    User, 
    Stethoscope, 
    Building2, 
    Calendar, 
    Clock, 
    FileText, 
    Pill, 
    TestTube, 
    ClipboardList,
    Heart,
    Download,
    File
} from 'lucide-react';
import axios from 'axios';
import { formatDate, formatTime } from '../utils/dateUtils';

const PrescriptionView = ({ prescription, appointment }) => {
    const [prescriptionFiles, setPrescriptionFiles] = useState([]);
    const [loadingFiles, setLoadingFiles] = useState(false);

    // Fetch prescription files when component mounts
    useEffect(() => {
        if (prescription?.prescription_id) {
            fetchPrescriptionFiles();
        }
    }, [prescription]);

    const fetchPrescriptionFiles = async () => {
        try {
            setLoadingFiles(true);
            const response = await axios.get(`/api/prescription-files/prescription/${prescription.prescription_id}`);
            setPrescriptionFiles(response.data);
        } catch (error) {
            console.error('Error fetching prescription files:', error);
        } finally {
            setLoadingFiles(false);
        }
    };

    const handleDownloadFile = async (fileId, fileName) => {
        try {
            const response = await axios.get(`/api/prescription-files/${fileId}/download`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Failed to download file. Please try again.');
        }
    };

    if (!prescription) {
        return (
            <div className="text-center py-8">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">No prescription data available.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Doctor & Appointment Info Header - Compact */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                            <Stethoscope className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-800">
                                Dr. {appointment?.first_name} {appointment?.last_name}
                            </h3>
                            <p className="text-xs text-slate-600 flex items-center">
                                <Building2 className="w-3 h-3 mr-1" />
                                {appointment?.department_name}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 text-xs">
                        <div className="flex items-center space-x-1 bg-white/60 backdrop-blur-sm rounded-lg px-2 py-1">
                            <Calendar className="w-3 h-3 text-blue-500" />
                            <span className="font-medium text-slate-700">
                                {appointment?.appointment_date ? formatDate(appointment.appointment_date) : 'N/A'}
                            </span>
                        </div>
                        <div className="flex items-center space-x-1 bg-white/60 backdrop-blur-sm rounded-lg px-2 py-1">
                            <Clock className="w-3 h-3 text-green-500" />
                            <span className="font-medium text-slate-700">
                                {appointment?.appointment_time ? formatTime(appointment.appointment_time) : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>
                
                {appointment?.reason && (
                    <div className="mt-2 bg-white/60 backdrop-blur-sm rounded-lg p-2">
                        <span className="text-xs">
                            <span className="font-medium text-purple-700">Reason:</span>{' '}
                            <span className="text-slate-600">{appointment.reason}</span>
                        </span>
                    </div>
                )}
            </div>

            {/* Diagnosis & Instructions - Horizontal Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Diagnosis */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-4 shadow-sm">
                    <h4 className="text-sm font-semibold text-slate-800 mb-2 flex items-center">
                        <Heart className="w-4 h-4 mr-2 text-green-600" />
                        Diagnosis
                    </h4>
                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-green-300">
                        <p className="text-sm text-slate-700 font-medium">{prescription.diagnosis || 'Not specified'}</p>
                    </div>
                </div>

                {/* Instructions */}
                {prescription.instructions && (
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-4 shadow-sm">
                        <h4 className="text-sm font-semibold text-slate-800 mb-2 flex items-center">
                            <ClipboardList className="w-4 h-4 mr-2 text-amber-600" />
                            Instructions
                        </h4>
                        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-amber-300">
                            <p className="text-sm text-slate-700">{prescription.instructions}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Prescribed Medications - Compact Grid Layout */}
            {prescription.drugs && prescription.drugs.length > 0 && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-4 shadow-sm">
                    <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center">
                        <Pill className="w-4 h-4 mr-2 text-purple-600" />
                        Prescribed Medications ({prescription.drugs.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {prescription.drugs.map((drug, index) => (
                            <div key={index} className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-purple-300 shadow-sm">
                                <h5 className="font-semibold text-slate-800 text-sm mb-2 flex items-center">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                                    {drug.drug_name}
                                </h5>
                                <div className="space-y-1 text-xs">
                                    <div className="bg-purple-50 rounded px-2 py-1">
                                        <span className="font-medium text-purple-700">Dosage:</span>
                                        <span className="ml-1 text-slate-700">{drug.dosages}</span>
                                    </div>
                                    <div className="bg-purple-50 rounded px-2 py-1">
                                        <span className="font-medium text-purple-700">Frequency:</span>
                                        <span className="ml-1 text-slate-700">{drug.frequency_per_day}/day</span>
                                    </div>
                                    <div className="bg-purple-50 rounded px-2 py-1">
                                        <span className="font-medium text-purple-700">Duration:</span>
                                        <span className="ml-1 text-slate-700">{drug.duration}</span>
                                    </div>
                                    {drug.additional_notes && (
                                        <div className="bg-yellow-50 rounded px-2 py-1 border border-yellow-200">
                                            <span className="font-medium text-yellow-700">Notes:</span>{' '}
                                            <span className="text-slate-600">{drug.additional_notes}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommended Tests - Compact Grid Layout */}
            {prescription.investigations && prescription.investigations.length > 0 && (
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-200 p-4 shadow-sm">
                    <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center">
                        <TestTube className="w-4 h-4 mr-2 text-cyan-600" />
                        Recommended Tests ({prescription.investigations.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {prescription.investigations.map((investigation, index) => (
                            <div key={index} className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-cyan-300 shadow-sm">
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                                        <TestTube className="w-3 h-3 text-white" />
                                    </div>
                                    <h5 className="font-semibold text-slate-800 text-sm">{investigation.name}</h5>
                                </div>
                                {investigation.notes && (
                                    <div className="bg-cyan-50 rounded px-2 py-1">
                                        <p className="text-xs text-slate-600">
                                            <span className="font-medium text-cyan-700">Notes:</span> {investigation.notes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Prescription Files - Updated with Multi-line Wrapping */}
            {(prescriptionFiles.length > 0 || loadingFiles) && (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-4 shadow-sm">
                    <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-indigo-600" />
                        Prescription Files ({prescriptionFiles.length})
                    </h4>
                    {loadingFiles ? (
                        <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
                            <p className="text-xs text-slate-600 mt-2">Loading files...</p>
                        </div>
                    ) : prescriptionFiles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {prescriptionFiles.map((file) => (
                                <div key={file.file_id} className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-indigo-300 shadow-sm">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-start space-x-2 flex-1 min-w-0">
                                            <File className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <p 
                                                    className="text-xs font-medium text-slate-800 break-words leading-relaxed"
                                                    title={file.file_name}
                                                >
                                                    {file.file_name}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    {new Date(file.uploaded_time).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDownloadFile(file.file_id, file.file_name)}
                                            className="p-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 rounded transition-colors flex-shrink-0"
                                            title="Download file"
                                        >
                                            <Download className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <FileText className="w-8 h-8 text-indigo-300 mx-auto mb-2" />
                            <p className="text-xs text-slate-600">No prescription files uploaded</p>
                        </div>
                    )}
                </div>
            )}

            {/* Other Medications - Compact */}
            {prescription.other_drugs && (
                <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl border border-slate-200 p-4 shadow-sm">
                    <h4 className="text-sm font-semibold text-slate-800 mb-2 flex items-center">
                        <Pill className="w-4 h-4 mr-2 text-slate-600" />
                        Other Medications
                    </h4>
                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-slate-300">
                        <p className="text-sm text-slate-700">{prescription.other_drugs}</p>
                    </div>
                </div>
            )}

            {/* Prescription Footer Info - Compact */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-3 shadow-sm">
                <div className="text-center text-xs text-slate-600">
                    <p className="font-medium text-indigo-700">Prescription ID: {prescription.prescription_id}</p>
                    <p className="text-xs text-slate-500 mt-1">
                        Please follow the medication schedule as prescribed. Contact your doctor if you experience any side effects.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrescriptionView;
