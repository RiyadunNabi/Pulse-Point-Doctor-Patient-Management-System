import React, { useState } from 'react';
import { FileText, Download, Edit3, Trash2, Calendar, MessageSquare } from 'lucide-react';

function DocumentList({ documents, loading, onDelete, onDownload, onUpdate }) {
  const [editingDoc, setEditingDoc] = useState(null);
  const [editForm, setEditForm] = useState({ description: '', last_checkup_date: '' });

  const handleEditStart = (doc) => {
    setEditingDoc(doc.document_id);
    setEditForm({
      description: doc.description || '',
      last_checkup_date: doc.last_checkup_date || ''
    });
  };

  const handleEditCancel = () => {
    setEditingDoc(null);
    setEditForm({ description: '', last_checkup_date: '' });
  };

  const handleEditSave = async (docId) => {
    await onUpdate(docId, editForm);
    setEditingDoc(null);
    setEditForm({ description: '', last_checkup_date: '' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    return <FileText className="w-8 h-8 text-sky-600" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
        <span className="ml-3 text-slate-600">Loading documents...</span>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-500 text-lg">No documents uploaded yet</p>
        <p className="text-slate-400 text-sm">Upload your first medical document to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-slate-800">
          Your Medical Documents ({documents.length})
        </h4>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {documents.map((doc) => (
          <div
            key={doc.document_id}
            className="bg-slate-50 hover:bg-slate-100 rounded-lg p-4 transition-colors border border-slate-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                {getFileIcon(doc.file_name)}
                
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-slate-800 truncate">
                    {doc.file_name}
                  </h5>
                  
                  {editingDoc === doc.document_id ? (
                    <div className="mt-2 space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={editForm.description}
                          onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                          placeholder="Document description"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Last Checkup Date
                        </label>
                        <input
                          type="date"
                          value={editForm.last_checkup_date}
                          onChange={(e) => setEditForm(prev => ({ ...prev, last_checkup_date: e.target.value }))}
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditSave(doc.document_id)}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="px-3 py-1 bg-slate-400 hover:bg-slate-500 text-white text-xs rounded-md transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1 space-y-1">
                      {doc.description && (
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="w-3 h-3 text-slate-400" />
                          <p className="text-sm text-slate-600">{doc.description}</p>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <p className="text-xs text-slate-500">
                          Uploaded: {formatDate(doc.upload_date)}
                        </p>
                      </div>
                      
                      {doc.last_checkup_date && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <p className="text-xs text-slate-500">
                            Checkup: {formatDate(doc.last_checkup_date)}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {editingDoc !== doc.document_id && (
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => onDownload(doc.document_id, doc.file_name)}
                    className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                    title="Download document"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleEditStart(doc)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit document info"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => onDelete(doc.document_id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DocumentList;
