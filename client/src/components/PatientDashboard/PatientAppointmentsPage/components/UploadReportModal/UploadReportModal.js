import React, { useState, useEffect } from 'react';
import { 
    Upload, 
    User, 
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
    X
} from 'lucide-react';
import axios from 'axios';
import Modal from '../../../../shared/Modal';
import { formatDate, formatTime } from '../../utils/dateUtils';

const UploadReportModal = ({ isOpen, onClose, appointment, onReportUploaded }) => {
    const [prescription, setPrescription] = useState(null);
    const [investigations, setInvestigations] = useState([]);
    const [existingReports, setExistingReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState({}); // Files selected for each investigation
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
            
            // Fetch prescription details
            const prescriptionResponse = await axios.get(`/api/prescriptions/appointment/${appointment.appointment_id}`);
            setPrescription(prescriptionResponse.data);

            if (prescriptionResponse.data?.prescription_id) {
                // Fetch investigations from prescription
                const investigationsResponse = await axios.get(`/api/prescription-investigations/prescription/${prescriptionResponse.data.prescription_id}`);
                setInvestigations(investigationsResponse.data);

                // Fetch existing reports
                const reportsResponse = await axios.get(`/api/investigation-reports/prescription/${prescriptionResponse.data.prescription_id}`);
                console.log('Existing reports response:', reportsResponse.data);
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

    // Handle file selection for each investigation
    const handleFileSelect = (investigationId, file) => {
        setSelectedFiles(prev => ({
            ...prev,
            [investigationId]: file
        }));
    };

    // Remove selected file for an investigation
    const handleRemoveSelectedFile = (investigationId) => {
        setSelectedFiles(prev => {
            const updated = { ...prev };
            delete updated[investigationId];
            return updated;
        });
    };

    // Submit all selected files at once
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

            // Create upload promises for each selected file
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

            // Wait for all uploads to complete
            await Promise.all(uploadPromises);

            // Clear selected files
            setSelectedFiles({});

            // Refresh existing reports
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
            return <CheckCircle className="w-5 h-5 text-green-600" />;
        }
        if (hasSelectedFile) {
            return <Clock className="w-5 h-5 text-blue-600" />;
        }
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
    };

    const getStatusText = (investigationId) => {
        const reports = getReportsForInvestigation(investigationId);
        const hasSelectedFile = selectedFiles[investigationId];
        
        if (reports.length > 0) return 'Uploaded';
        if (hasSelectedFile) return 'Ready to Upload';
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
            size="lg"
        >
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mr-3"></div>
                    <span className="text-slate-600">Loading prescription data...</span>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Appointment Info Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-6 shadow-sm">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                                <Stethoscope className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-slate-800">
                                    Dr. {appointment.first_name} {appointment.last_name}
                                </h3>
                                <p className="text-sm text-slate-600 mb-2 flex items-center">
                                    <Building2 className="w-4 h-4 mr-1" />
                                    {appointment.department_name}
                                </p>
                                <div className="flex items-center space-x-4 text-sm text-slate-600">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-1 text-blue-500" />
                                        <span>{formatDate(appointment.appointment_date)}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-1 text-green-500" />
                                        <span>{formatTime(appointment.appointment_time)}</span>
                                    </div>
                                </div>
                                {appointment.reason && (
                                    <div className="mt-2">
                                        <span className="text-sm text-slate-600">
                                            <span className="font-medium text-purple-600">Reason:</span> {appointment.reason}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Prescription Info */}
                    {prescription && (
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6 shadow-sm">
                            <h4 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-green-600" />
                                Prescription Details
                            </h4>
                            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-green-300">
                                <div className="text-sm text-slate-700">
                                    <span className="font-medium text-green-700">Diagnosis:</span> {prescription.diagnosis}
                                </div>
                                {prescription.instructions && (
                                    <div className="text-sm text-slate-700 mt-2">
                                        <span className="font-medium text-green-700">Instructions:</span> {prescription.instructions}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Investigation Reports Upload Section */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6 shadow-sm">
                        <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                            <Upload className="w-5 h-5 mr-2 text-purple-600" />
                            Required Investigation Reports ({investigations.length})
                        </h4>
                        
                        {investigations.length === 0 ? (
                            <div className="text-center py-8">
                                <FileText className="w-12 h-12 text-purple-300 mx-auto mb-3" />
                                <p className="text-slate-600">No investigations prescribed</p>
                                <p className="text-sm text-slate-500">Your doctor hasn't prescribed any tests for this appointment.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {investigations.map((investigation) => {
                                    const reports = getReportsForInvestigation(investigation.investigation_id);
                                    const selectedFile = selectedFiles[investigation.investigation_id];
                                    
                                    return (
                                        <div
                                            key={investigation.investigation_id}
                                            className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-purple-200 shadow-sm"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center space-x-3">
                                                    {getUploadStatusIcon(investigation.investigation_id)}
                                                    <div>
                                                        <h5 className="font-semibold text-slate-800">{investigation.name}</h5>
                                                        {investigation.description && (
                                                            <p className="text-sm text-slate-600">{investigation.description}</p>
                                                        )}
                                                        {investigation.notes && (
                                                            <p className="text-sm text-purple-600 mt-1">
                                                                <span className="font-medium">Doctor's Notes:</span> {investigation.notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(investigation.investigation_id)}`}>
                                                    {getStatusText(investigation.investigation_id)}
                                                </span>
                                            </div>

                                            {/* File Selection */}
                                            <div className="mb-3">
                                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                                    Select Report File
                                                </label>
                                                
                                                {!selectedFile ? (
                                                    <input
                                                        type="file"
                                                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                handleFileSelect(investigation.investigation_id, file);
                                                            }
                                                        }}
                                                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3 border border-blue-200">
                                                        <div className="flex items-center space-x-3">
                                                            <File className="w-4 h-4 text-blue-600" />
                                                            <div>
                                                                <p className="text-sm font-medium text-slate-800">{selectedFile.name}</p>
                                                                <p className="text-xs text-slate-500">
                                                                    Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemoveSelectedFile(investigation.investigation_id)}
                                                            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                                
                                                <p className="text-xs text-slate-500 mt-1">
                                                    Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
                                                </p>
                                            </div>

                                            {/* Existing Reports */}
                                            {reports.length > 0 && (
                                                <div>
                                                    <h6 className="text-sm font-medium text-slate-700 mb-2">Uploaded Files:</h6>
                                                    <div className="space-y-2">
                                                        {reports.map((report) => (
                                                            <div
                                                                key={report.report_id}
                                                                className="flex items-center justify-between bg-white rounded-lg p-3 border border-slate-200"
                                                            >
                                                                <div className="flex items-center space-x-3">
                                                                    <File className="w-4 h-4 text-blue-600" />
                                                                    <div>
                                                                        <p className="text-sm font-medium text-slate-800">{report.file_name}</p>
                                                                        <p className="text-xs text-slate-500">
                                                                            Uploaded: {new Date(report.uploaded_at).toLocaleDateString()}
                                                                        </p>
                                                                        {report.notes && (
                                                                            <p className="text-xs text-slate-600">Notes: {report.notes}</p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <button
                                                                        onClick={() => handleDownloadReport(report.report_id, report.file_name)}
                                                                        className="flex items-center space-x-1 px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium transition-all duration-200"
                                                                    >
                                                                        <Download className="w-3 h-3" />
                                                                        <span>Download</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteReport(report.report_id)}
                                                                        className="flex items-center space-x-1 px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-medium transition-all duration-200"
                                                                    >
                                                                        <Trash2 className="w-3 h-3" />
                                                                        <span>Delete</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Single Submit Button for All Files */}
                        {Object.keys(selectedFiles).length > 0 && (
                            <div className="mt-6 pt-4 border-t border-purple-300">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-slate-600">
                                        {Object.keys(selectedFiles).length} file(s) ready to upload
                                    </div>
                                    <button
                                        onClick={handleSubmitAllFiles}
                                        disabled={submitting}
                                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                <span>Uploading...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4" />
                                                <span>Upload All Reports</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Instructions */}
                    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl border border-orange-200 p-6 shadow-sm">
                        <h4 className="text-lg font-semibold text-slate-700 mb-3">Upload Instructions</h4>
                        <div className="space-y-2 text-sm text-slate-600">
                            <div className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                                <span>Select files for each investigation, then click "Upload All Reports" to submit</span>
                            </div>
                            <div className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                                <span>Upload clear, readable images or PDF files of your test reports</span>
                            </div>
                            <div className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                                <span>Ensure all patient information and test results are visible</span>
                            </div>
                            <div className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                                <span>You can upload multiple files for each investigation if needed</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default UploadReportModal;
