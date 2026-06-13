import React from 'react';
import { FileText, Download, Calendar, Eye } from 'lucide-react';
import axios from 'axios';

const MedicalDocumentsSection = ({ documents, loading }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleDownload = async (documentId, fileName) => {
        try {
            const response = await axios.get(
                `/api/medical-documents/${documentId}/download`,
                { responseType: 'blob' }
            );
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading document:', error);
            alert('Failed to download document');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
                <span className="ml-3 text-slate-600">Loading medical documents...</span>
            </div>
        );
    }

    if (documents.length === 0) {
        return (
            <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Shared Documents
                </h3>
                <p className="text-gray-500">
                    The patient hasn't shared any medical documents for this appointment.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-800">Shared Medical Documents</h4>
                <span className="text-sm text-gray-500">
                    {documents.length} document{documents.length !== 1 ? 's' : ''} shared
                </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {documents.map((document) => (
                    <div key={document.document_id} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4 flex-1">
                                <div className="p-3 bg-white rounded-lg border border-gray-200">
                                    <FileText className="w-6 h-6 text-blue-600" />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <h5 className="font-medium text-gray-800 truncate">
                                        {document.file_name}
                                    </h5>
                                    
                                    {document.description && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            {document.description}
                                        </p>
                                    )}
                                    
                                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                                        <span className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            Uploaded: {formatDate(document.upload_date)}
                                        </span>
                                        
                                        {document.last_checkup_date && (
                                            <span className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                Checkup: {formatDate(document.last_checkup_date)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 ml-4">
                                <button
                                    onClick={() => handleDownload(document.document_id, document.file_name)}
                                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Download Document"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                                
                                <button
                                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="View Document"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MedicalDocumentsSection;
