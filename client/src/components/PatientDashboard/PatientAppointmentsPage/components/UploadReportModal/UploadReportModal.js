import React, { useState, useEffect } from 'react';
import { 
    Upload, 
    Stethoscope, 
    Building2,
    Calendar,
    Clock,
    FileText,
    Download,
    Trash2,
    CheckCircle,
    AlertCircle,
    File,
    X,
    Plus,
    Eye
} from 'lucide-react';
import axios from 'axios';
import Modal from '../../../../shared/Modal';
import { formatDate, formatTime } from '../../utils/dateUtils';

const UploadReportModal = ({ isOpen, onClose, appointment, onReportUploaded }) => {
    const [prescription, setPrescription] = useState(null);
    const [investigations, setInvestigations] = useState([]);
    const [existingReports, setExistingReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Fetch prescription and investigations when modal opens
    useEffect(() => {
        if (isOpen && appointment?.appointment_id) {
            fetchPrescriptionData();
        }
    }, [isOpen, appointment]);

    const fetchPrescriptionData = async () => {
        try {
            setLoading(true);
            
            const prescriptionResponse = await axios.get(`/api/prescriptions/appointment/${appointment.appointment_id}`);
            setPrescription(prescriptionResponse.data);

            if (prescriptionResponse.data?.prescription_id) {
                const investigationsResponse = await axios.get(`/api/prescription-investigations/prescription/${prescriptionResponse.data.prescription_id}`);
                setInvestigations(investigationsResponse.data);

                const reportsResponse = await axios.get(`/api/investigation-reports/prescription/${prescriptionResponse.data.prescription_id}`);
                setExistingReports(reportsResponse.data);
            }
        } catch (error) {
            console.error('Error fetching prescription data:', error);
            if (error.response?.status === 404) {
                alert('No prescription found for this appointment.');
            } else {
                alert('Failed to fetch prescription data. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (investigationId, file) => {
        setSelectedFiles(prev => ({
            ...prev,
            [investigationId]: file
        }));
    };

    const handleRemoveSelectedFile = (investigationId) => {
        setSelectedFiles(prev => {
            const updated = { ...prev };
            delete updated[investigationId];
            return updated;
        });
    };

    const handleSubmitAllFiles = async () => {
        const filesToUpload = Object.entries(selectedFiles);
        
        if (filesToUpload.length === 0) {
            alert('Please select at least one file to upload.');
            return;
        }

        if (!prescription?.prescription_id) {
            alert('Prescription information not available.');
            return;
        }

        try {
            setSubmitting(true);
            const uploadPromises = [];

            filesToUpload.forEach(([investigationId, file]) => {
                const formData = new FormData();
                formData.append('reportFile', file);
                formData.append('prescription_id', prescription.prescription_id);
                formData.append('investigation_id', investigationId);
                formData.append('notes', 'Patient uploaded report');

                uploadPromises.push(
                    axios.post('/api/investigation-reports', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    })
                );
            });

            await Promise.all(uploadPromises);
            setSelectedFiles({});
            await fetchPrescriptionData();
            
            if (onReportUploaded) onReportUploaded();
            alert(`Successfully uploaded ${filesToUpload.length} report(s)!`);
        } catch (error) {
            console.error('Error uploading reports:', error);
            alert('Failed to upload some reports. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReport = async (reportId) => {
        if (!window.confirm('Are you sure you want to delete this report?')) return;

        try {
            await axios.delete(`/api/investigation-reports/${reportId}`);
            await fetchPrescriptionData();
            alert('Report deleted successfully!');
        } catch (error) {
            console.error('Error deleting report:', error);
            alert('Failed to delete report. Please try again.');
        }
    };

    const handleDownloadReport = async (reportId, fileName) => {
        try {
            const response = await axios.get(`/api/investigation-reports/${reportId}/download`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName || 'report.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading report:', error);
            alert('Failed to download report. Please try again.');
        }
    };

    const getReportsForInvestigation = (investigationId) => {
        return existingReports.filter(report => 
            parseInt(report.investigation_id) === parseInt(investigationId)
        );
    };

    const getUploadStatusIcon = (investigationId) => {
        const reports = getReportsForInvestigation(investigationId);
        const hasSelectedFile = selectedFiles[investigationId];
        
        if (reports.length > 0) {
            return <CheckCircle className="w-4 h-4 text-green-600" />;
        }
        if (hasSelectedFile) {
            return <Clock className="w-4 h-4 text-blue-600" />;
        }
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
    };

    const getStatusText = (investigationId) => {
        const reports = getReportsForInvestigation(investigationId);
        const hasSelectedFile = selectedFiles[investigationId];
        
        if (reports.length > 0) return 'Uploaded';
        if (hasSelectedFile) return 'Ready';
        return 'Pending';
    };

    const getStatusColor = (investigationId) => {
        const reports = getReportsForInvestigation(investigationId);
        const hasSelectedFile = selectedFiles[investigationId];
        
        if (reports.length > 0) return 'bg-green-100 text-green-700';
        if (hasSelectedFile) return 'bg-blue-100 text-blue-700';
        return 'bg-amber-100 text-amber-700';
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Upload Investigation Reports"
            subtitle="Upload your test results as prescribed by the doctor"
            size="md"
        >
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mr-3"></div>
                    <span className="text-slate-600">Loading prescription data...</span>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Compact Appointment Header */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                                    <Stethoscope className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-800">
                                        Dr. {appointment.first_name} {appointment.last_name}
                                    </h3>
                                    <p className="text-xs text-slate-600 flex items-center">
                                        <Building2 className="w-3 h-3 mr-1" />
                                        {appointment.department_name}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 text-xs">
                                <div className="flex items-center space-x-1 bg-white/60 backdrop-blur-sm rounded-lg px-2 py-1">
                                    <Calendar className="w-3 h-3 text-blue-500" />
                                    <span className="font-medium text-slate-700">{formatDate(appointment.appointment_date)}</span>
                                </div>
                                <div className="flex items-center space-x-1 bg-white/60 backdrop-blur-sm rounded-lg px-2 py-1">
                                    <Clock className="w-3 h-3 text-green-500" />
                                    <span className="font-medium text-slate-700">{formatTime(appointment.appointment_time)}</span>
                                </div>
                            </div>
                        </div>
                        
                        {appointment.reason && (
                            <div className="mt-2 bg-white/60 backdrop-blur-sm rounded-lg p-2">
                                <span className="text-xs">
                                    <span className="font-medium text-purple-700">Reason:</span>{' '}
                                    <span className="text-slate-600">{appointment.reason}</span>
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Compact Prescription Info */}
                    {prescription && (
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-4 shadow-sm">
                            <h4 className="text-sm font-semibold text-slate-800 mb-2 flex items-center">
                                <FileText className="w-4 h-4 mr-2 text-green-600" />
                                Prescription Summary
                            </h4>
                            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-green-300">
                                <div className="text-xs text-slate-700">
                                    <span className="font-medium text-green-700">Diagnosis:</span> {prescription.diagnosis}
                                </div>
                                {prescription.instructions && (
                                    <div className="text-xs text-slate-700 mt-1">
                                        <span className="font-medium text-green-700">Instructions:</span> {prescription.instructions}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Investigation Reports - Grid Layout */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-4 shadow-sm">
                        <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center">
                            <Upload className="w-4 h-4 mr-2 text-purple-600" />
                            Required Tests ({investigations.length})
                        </h4>
                        
                        {investigations.length === 0 ? (
                            <div className="text-center py-6">
                                <FileText className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                                <p className="text-sm text-slate-600">No investigations prescribed</p>
                                <p className="text-xs text-slate-500">Your doctor hasn't prescribed any tests for this appointment.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {investigations.map((investigation) => {
                                    const reports = getReportsForInvestigation(investigation.investigation_id);
                                    const selectedFile = selectedFiles[investigation.investigation_id];
                                    
                                    return (
                                        <div
                                            key={investigation.investigation_id}
                                            className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-purple-200 shadow-sm"
                                        >
                                            {/* Header */}
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-2">
                                                    {getUploadStatusIcon(investigation.investigation_id)}
                                                    <div className="min-w-0 flex-1">
                                                        <h5 className="font-semibold text-slate-800 text-sm truncate">{investigation.name}</h5>
                                                        {investigation.notes && (
                                                            <p className="text-xs text-purple-600 truncate">
                                                                <span className="font-medium">Notes:</span> {investigation.notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(investigation.investigation_id)} flex-shrink-0`}>
                                                    {getStatusText(investigation.investigation_id)}
                                                </span>
                                            </div>

                                            {/* File Selection */}
                                            <div className="mb-2">
                                                {!selectedFile ? (
                                                    <label className="cursor-pointer">
                                                        <input
                                                            type="file"
                                                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                if (file) {
                                                                    handleFileSelect(investigation.investigation_id, file);
                                                                }
                                                            }}
                                                            className="hidden"
                                                        />
                                                        <div className="flex items-center justify-center space-x-2 py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg border-2 border-dashed border-purple-300 transition-colors">
                                                            <Plus className="w-4 h-4" />
                                                            <span className="text-xs font-medium">Choose File</span>
                                                        </div>
                                                    </label>
                                                ) : (
                                                    <div className="flex items-center justify-between bg-blue-50 rounded-lg p-2 border border-blue-200">
                                                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                                                            <File className="w-3 h-3 text-blue-600 flex-shrink-0" />
                                                            <div className="min-w-0 flex-1">
                                                                <p className="text-xs font-medium text-slate-800 truncate" title={selectedFile.name}>
                                                                    {selectedFile.name}
                                                                </p>
                                                                <p className="text-xs text-slate-500">
                                                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemoveSelectedFile(investigation.investigation_id)}
                                                            className="p-1 text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Existing Reports */}
                                            {reports.length > 0 && (
                                                <div className="space-y-1">
                                                    <h6 className="text-xs font-medium text-slate-700">Uploaded:</h6>
                                                    {reports.map((report) => (
                                                        <div
                                                            key={report.report_id}
                                                            className="flex items-center justify-between bg-white rounded p-2 border border-slate-200"
                                                        >
                                                            <div className="flex items-center space-x-2 min-w-0 flex-1">
                                                                <File className="w-3 h-3 text-blue-600 flex-shrink-0" />
                                                                <div className="min-w-0 flex-1">
                                                                    <p className="text-xs font-medium text-slate-800 break-words leading-relaxed" title={report.file_name}>
                                                                        {report.file_name}
                                                                    </p>
                                                                    <p className="text-xs text-slate-500">
                                                                        {new Date(report.uploaded_at).toLocaleDateString()}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-1 flex-shrink-0">
                                                                <button
                                                                    onClick={() => handleDownloadReport(report.report_id, report.file_name)}
                                                                    className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
                                                                    title="Download"
                                                                >
                                                                    <Download className="w-3 h-3" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteReport(report.report_id)}
                                                                    className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Upload Button */}
                        {Object.keys(selectedFiles).length > 0 && (
                            <div className="mt-4 pt-3 border-t border-purple-300">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-slate-600">
                                        <span className="font-medium">{Object.keys(selectedFiles).length}</span> file(s) ready to upload
                                    </div>
                                    <button
                                        onClick={handleSubmitAllFiles}
                                        disabled={submitting}
                                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                                <span>Uploading...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-3 h-3" />
                                                <span>Upload All Reports</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Compact Instructions */}
                    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl border border-orange-200 p-3 shadow-sm">
                        <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center">
                            <Eye className="w-4 h-4 mr-2 text-orange-600" />
                            Quick Tips
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
                            <div className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                                <span>Select files then click "Upload All Reports"</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                                <span>Ensure images are clear and readable</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                                <span>PDF, JPG, PNG, DOC formats supported</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                                <span>Maximum file size: 10MB per file</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default UploadReportModal;
