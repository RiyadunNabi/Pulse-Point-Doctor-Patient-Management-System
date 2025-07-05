import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../../shared/Modal';
import DocumentUploadForm from './DocumentUploadForm';
import DocumentList from './DocumentList';

function MedicalDocumentsModal({ isOpen, onClose, patientId, onUpdate }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('upload');

  // Fetch documents when modal opens
  useEffect(() => {
    if (isOpen && patientId) {
      fetchDocuments();
    }
  }, [isOpen, patientId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/medical-documents/patient/${patientId}`);
      setDocuments(response.data);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (newDocument) => {
    setDocuments(prev => [newDocument, ...prev]);
    setSuccess('Document uploaded successfully!');
    onUpdate();
    
    setTimeout(() => {
      setSuccess('');
      setActiveTab('documents');
    }, 1500);
  };

  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await axios.delete(`/api/medical-documents/${documentId}`);
      setDocuments(prev => prev.filter(doc => doc.document_id !== documentId));
      setSuccess('Document deleted successfully!');
      onUpdate();
      
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('Failed to delete document');
    }
  };

  const handleDownloadDocument = async (documentId, fileName) => {
    try {
      const response = await axios.get(`/api/medical-documents/${documentId}/download`, {
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
    } catch (err) {
      console.error('Error downloading document:', err);
      setError('Failed to download document');
    }
  };

  const handleUpdateDocument = async (documentId, updateData) => {
    try {
      const response = await axios.patch(`/api/medical-documents/${documentId}`, updateData);
      setDocuments(prev => 
        prev.map(doc => 
          doc.document_id === documentId ? { ...doc, ...response.data } : doc
        )
      );
      setSuccess('Document updated successfully!');
      
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.error('Error updating document:', err);
      setError('Failed to update document');
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess('');
    setActiveTab('upload');
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="Medical Documents" 
      size="xl"
    >
      <div className="space-y-6">
        {/* Error/Success Messages */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm font-medium">{success}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === 'upload'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Upload Document
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === 'documents'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            My Documents ({documents.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-96">
          {activeTab === 'upload' ? (
            <DocumentUploadForm
              patientId={patientId}
              onUploadSuccess={handleUploadSuccess}
              onError={setError}
            />
          ) : (
            <DocumentList
              documents={documents}
              loading={loading}
              onDelete={handleDeleteDocument}
              onDownload={handleDownloadDocument}
              onUpdate={handleUpdateDocument}
            />
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-6 border-t border-slate-200/50">
          <button
            onClick={handleClose}
            className="px-6 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default MedicalDocumentsModal;
