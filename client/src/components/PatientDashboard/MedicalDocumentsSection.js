import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Plus } from 'lucide-react';
import axios from 'axios';
import MedicalDocumentsModal from './MedicalDocumentsModal/MedicalDocumentsModal';

function MedicalDocumentsSection({ patientId }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDocuments = useCallback(async () => {
    try {
      const response = await axios.get(`/api/medical-documents/patient/${patientId}`);
      setDocuments(response.data);
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    if (patientId) {
      fetchDocuments();
    }
  }, [patientId, fetchDocuments]);

  const handleModalUpdate = () => {
    fetchDocuments();
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800">Medical Documents</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Manage Documents</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          <span className="ml-3 text-slate-600">Loading documents...</span>
        </div>
      ) : documents.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-slate-600 mb-4">
            You have {documents.length} medical document{documents.length !== 1 ? 's' : ''} stored
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.slice(0, 4).map((doc) => (
              <div
                key={doc.document_id}
                className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <FileText className="w-6 h-6 text-sky-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {doc.file_name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(doc.upload_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {documents.length > 4 && (
            <p className="text-xs text-slate-500 text-center mt-3">
              +{documents.length - 4} more documents
            </p>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-500">No medical documents uploaded</p>
          <p className="text-sm text-slate-400">Store your medical records securely</p>
        </div>
      )}

      <MedicalDocumentsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patientId={patientId}
        onUpdate={handleModalUpdate}
      />
    </div>
  );
}

export default MedicalDocumentsSection;
