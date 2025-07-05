import React from 'react';
import { FileText, Upload } from 'lucide-react';

function MedicalDocumentsSection() {
  return (
    <div className="mt-8">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800">Medical Documents</h3>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white rounded-lg shadow-md transition-all duration-200">
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
        
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">Medical Documents</p>
          <p className="text-sm text-slate-400 mt-2">Upload and manage your medical records securely</p>
          <p className="text-xs text-slate-400 mt-1">Coming soon - Document management system</p>
        </div>
      </div>
    </div>
  );
}

export default MedicalDocumentsSection;
