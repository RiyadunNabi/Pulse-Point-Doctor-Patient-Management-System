import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Calendar, 
    Clock, 
    User, 
    FileText, 
    Download, 
    TestTube,
    Building2,
    Stethoscope,
    Eye,
    X,
    ZoomIn,
    ExternalLink
} from 'lucide-react';
import Modal from '../../../shared/Modal';
import { formatDate, formatTime } from '../../utils/dateUtils';

const InvestigationReportModal = ({ isOpen, onClose, appointment }) => {
    const [prescription, setPrescription] = useState(null);
    const [investigationReports, setInvestigationReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    useEffect(() => {
        if (isOpen && appointment?.appointment_id) {
            fetchInvestigationReports();
        }
    }, [isOpen, appointment]);

    const fetchInvestigationReports = async () => {
        try {
            setLoading(true);
            
            const prescriptionResponse = await axios.get(`/api/prescriptions/appointment/${appointment.appointment_id}`);
            setPrescription(prescriptionResponse.data);

            if (prescriptionResponse.data?.prescription_id) {
                const reportsResponse = await axios.get(`/api/investigation-reports/prescription/${prescriptionResponse.data.prescription_id}`);
                setInvestigationReports(reportsResponse.data);
            }
        } catch (error) {
            console.error('Error fetching investigation reports:', error);
        } finally {
            setLoading(false);
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
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading report:', error);
            alert('Failed to download report. Please try again.');
        }
    };

    const handlePreviewReport = async (reportId, fileName, fileType) => {
        try {
            const response = await axios.get(`/api/investigation-reports/${reportId}/download`, {
                responseType: 'blob'
            });
            
            const blob = new Blob([response.data], { type: fileType });
            const url = window.URL.createObjectURL(blob);
            
            setPreviewFile({
                url,
                name: fileName,
                type: fileType
            });
            setShowPreviewModal(true);
        } catch (error) {
            console.error('Error previewing report:', error);
            alert('Failed to preview report. Please try again.');
        }
    };

    const closePreview = () => {
        if (previewFile?.url) {
            window.URL.revokeObjectURL(previewFile.url);
        }
        setPreviewFile(null);
        setShowPreviewModal(false);
    };

    if (loading) {
        return (
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Investigation Reports"
                subtitle="Loading patient reports..."
                size="lg"
            >
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mr-3"></div>
                    <span className="text-slate-600">Loading reports...</span>
                </div>
            </Modal>
        );
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Investigation Reports"
                subtitle="View patient uploaded investigation reports"
                size="lg"
            >
                <div className="space-y-6">
                    {/* Patient & Appointment Info Header */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">
                                        {appointment.patient_first_name} {appointment.patient_last_name}
                                    </h3>
                                    <p className="text-sm text-slate-600 flex items-center">
                                        <Stethoscope className="w-4 h-4 mr-1" />
                                        Patient ID: {appointment.patient_id}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center space-x-1 bg-white/60 backdrop-blur-sm rounded-lg px-3 py-2">
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                    <span className="font-medium text-slate-700">
                                        {formatDate(appointment.appointment_date)}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-1 bg-white/60 backdrop-blur-sm rounded-lg px-3 py-2">
                                    <Clock className="w-4 h-4 text-green-500" />
                                    <span className="font-medium text-slate-700">
                                        {formatTime(appointment.appointment_time)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        {appointment.reason && (
                            <div className="mt-3 bg-white/60 backdrop-blur-sm rounded-lg p-3">
                                <span className="text-sm">
                                    <span className="font-medium text-purple-700">Reason:</span>{' '}
                                    <span className="text-slate-600">{appointment.reason}</span>
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Investigation Reports */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6 shadow-sm">
                        <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                            <TestTube className="w-5 h-5 mr-2 text-purple-600" />
                            Investigation Reports ({investigationReports.length})
                        </h4>
                        
                        {investigationReports.length === 0 ? (
                            <div className="text-center py-8">
                                <FileText className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-slate-800 mb-2">
                                    No Reports Uploaded Yet
                                </h3>
                                <p className="text-slate-600">
                                    The patient hasn't uploaded any investigation reports for this appointment.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {investigationReports.map((report) => (
                                    <div
                                        key={report.report_id}
                                        className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-purple-200 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <TestTube className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h5 className="font-semibold text-slate-800 text-sm mb-1">
                                                        {report.investigation_name}
                                                    </h5>
                                                    <p className="text-xs text-slate-600 mb-2">
                                                        <span className="font-medium">File:</span> {report.file_name}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        Uploaded: {new Date(report.uploaded_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Action Buttons */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handlePreviewReport(report.report_id, report.file_name, report.file_type)}
                                                    className="flex items-center space-x-1 px-2 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors text-xs"
                                                    title="Quick Preview"
                                                >
                                                    <Eye className="w-3 h-3" />
                                                    <span>Preview</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDownloadReport(report.report_id, report.file_name)}
                                                    className="flex items-center space-x-1 px-2 py-1 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded-lg transition-colors text-xs"
                                                    title="Download Report"
                                                >
                                                    <Download className="w-3 h-3" />
                                                    <span>Download</span>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {report.notes && (
                                            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200 mt-3">
                                                <p className="text-xs text-slate-700">
                                                    <span className="font-medium text-purple-700">Notes:</span> {report.notes}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>

            {/* File Preview Modal */}
            {showPreviewModal && previewFile && (
                <Modal
                    isOpen={showPreviewModal}
                    onClose={closePreview}
                    title="File Preview"
                    subtitle={previewFile.name}
                    size="xl"
                >
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-full max-h-96 overflow-auto border rounded-lg bg-gray-50">
                            {previewFile.type.includes('pdf') ? (
                                <embed
                                    src={previewFile.url}
                                    type="application/pdf"
                                    width="100%"
                                    height="400px"
                                    className="rounded-lg"
                                />
                            ) : previewFile.type.includes('image') ? (
                                <img
                                    src={previewFile.url}
                                    alt={previewFile.name}
                                    className="w-full h-auto max-h-96 object-contain rounded-lg"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-40">
                                    <p className="text-gray-500">Preview not available for this file type</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex space-x-3">
                            <button
                                onClick={() => window.open(previewFile.url, '_blank')}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                            >
                                <ExternalLink className="w-4 h-4" />
                                <span>Open in New Tab</span>
                            </button>
                            <button
                                onClick={closePreview}
                                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                            >
                                Close Preview
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default InvestigationReportModal;
