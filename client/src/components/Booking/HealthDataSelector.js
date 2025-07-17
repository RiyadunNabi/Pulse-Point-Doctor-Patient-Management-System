// client/src/components/Booking/HealthDataSelector.js
import React from 'react';
import { Activity, FileText, Calendar, Users } from 'lucide-react';

const HealthDataSelector = ({
    healthData,
    shareHealthLog,
    setShareHealthLog,
    selectedDocuments,
    setSelectedDocuments
}) => {
    const handleDocumentToggle = (documentId) => {
        setSelectedDocuments(prev => 
            prev.includes(documentId)
                ? prev.filter(id => id !== documentId)
                : [...prev, documentId]
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const medicalDocuments = healthData.medical_documents || [];

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                <Users className="w-5 h-5 mr-2 text-sky-500" />
                Share Health Information with Doctor
            </h3>

            {/* Latest Health Log */}
            {healthData.latest_health_log_id && (
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-slate-800 flex items-center">
                            <Activity className="w-4 h-4 mr-2 text-green-500" />
                            Latest Health Log
                        </h4>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={shareHealthLog}
                                onChange={(e) => setShareHealthLog(e.target.checked)}
                                className="sr-only"
                            />
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                shareHealthLog 
                                    ? 'bg-sky-500 border-sky-500' 
                                    : 'border-slate-300 hover:border-sky-400'
                            }`}>
                                {shareHealthLog && (
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            <span className="ml-2 text-sm text-slate-600">Share with doctor</span>
                        </label>
                    </div>
                    
                    <div className="text-sm text-slate-600 grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                            <span className="text-slate-500">Date:</span>
                            <div className="font-medium">{formatDate(healthData.health_log_date)}</div>
                        </div>
                        {healthData.weight && (
                            <div>
                                <span className="text-slate-500">Weight:</span>
                                <div className="font-medium">{healthData.weight} kg</div>
                            </div>
                        )}
                        {healthData.systolic && healthData.diastolic && (
                            <div>
                                <span className="text-slate-500">BP:</span>
                                <div className="font-medium">{healthData.systolic}/{healthData.diastolic}</div>
                            </div>
                        )}
                        {healthData.heart_rate && (
                            <div>
                                <span className="text-slate-500">Heart Rate:</span>
                                <div className="font-medium">{healthData.heart_rate} bpm</div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Medical Documents */}
            {medicalDocuments.length > 0 && (
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <h4 className="font-medium text-slate-800 mb-3 flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-blue-500" />
                        Medical Documents ({medicalDocuments.length})
                    </h4>
                    
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                        {medicalDocuments.map((doc) => (
                            <div key={doc.document_id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                <div className="flex-1">
                                    <div className="font-medium text-sm text-slate-800">{doc.file_name}</div>
                                    <div className="text-xs text-slate-500">
                                        {doc.description && `${doc.description} • `}
                                        {formatDate(doc.upload_date)}
                                    </div>
                                </div>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedDocuments.includes(doc.document_id)}
                                        onChange={() => handleDocumentToggle(doc.document_id)}
                                        className="sr-only"
                                    />
                                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                                        selectedDocuments.includes(doc.document_id)
                                            ? 'bg-sky-500 border-sky-500' 
                                            : 'border-slate-300 hover:border-sky-400'
                                    }`}>
                                        {selectedDocuments.includes(doc.document_id) && (
                                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!healthData.latest_health_log_id && medicalDocuments.length === 0 && (
                <div className="text-center py-6 text-slate-500">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No health logs or medical documents available to share.</p>
                </div>
            )}
        </div>
    );
};

export default HealthDataSelector;
