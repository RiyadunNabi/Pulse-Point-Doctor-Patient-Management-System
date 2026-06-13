
// client/src/components/Booking/components/HealthDataSection.js
import React from 'react';
import { Activity, FileText, Heart, Weight, Droplets, Moon, Gauge, Eye } from 'lucide-react';

const HealthDataSection = ({ 
  healthData, 
  shareHealthLog, 
  setShareHealthLog, 
  selectedDocuments, 
  handleDocumentToggle, 
  handleDocumentPreview, 
  hasExistingAppointment 
}) => {
  return (
    <div className="space-y-6">
      {/* Health Data Sharing - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Health Log */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Share Health Log</span>
          </h3>
          
          {healthData.latest_health_log_id ? (
            <div className="space-y-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shareHealthLog}
                  onChange={(e) => setShareHealthLog(e.target.checked)}
                  disabled={hasExistingAppointment}
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 disabled:opacity-50"
                />
                <span className="text-xs text-gray-700">Share my latest health log with the doctor</span>
              </label>

              
                <div className="bg-white/80 rounded-lg p-3 space-y-2">
                  <div className="text-xs text-gray-600 mb-2">Latest Health Log:</div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    
                    {healthData.weight && (
                      <div className="flex items-center space-x-2">
                        <Weight className="w-3 h-3 text-blue-500" />
                        <span className="text-gray-600">Weight:</span>
                        <span className="font-medium">{healthData.weight} kg</span>
                      </div>
                    )}
                    {(healthData.systolic != null || healthData.diastolic != null) && (
  <div className="flex items-center space-x-2">
    <Heart className="w-3 h-3 text-red-500" />
    <span className="text-gray-600">Blood Pressure:</span>
    <span className="font-medium">
      {healthData.systolic}/{healthData.diastolic}
    </span>
  </div>
)}

                    {healthData.blood_sugar && (
                      <div className="flex items-center space-x-2">
                        <Droplets className="w-3 h-3 text-orange-500" />
                        <span className="text-gray-600">Sugar:</span>
                        <span className="font-medium">{healthData.blood_sugar}</span>
                      </div>
                    )}
                    {healthData.sleep_hours && (
                      <div className="flex items-center space-x-2">
                        <Moon className="w-3 h-3 text-purple-500" />
                        <span className="text-gray-600">Sleep:</span>
                        <span className="font-medium">{healthData.sleep_hours}h</span>
                      </div>
                    )}
                    {healthData.heart_rate && (
                      <div className="flex items-center space-x-2">
                        <Gauge className="w-3 h-3 text-pink-500" />
                        <span className="text-gray-600">HR:</span>
                        <span className="font-medium">{healthData.heart_rate} bpm</span>
                      </div>
                    )}
                    {healthData.blood_pressure && (
                    <div className="flex items-center space-x-2">
                    <Heart className="w-3 h-3 text-red-500" />
                    <span className="text-gray-600">BP:</span>
                    <span className="font-medium">{healthData.blood_pressure}</span>
                    </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Recorded: {new Date(healthData.health_log_date).toLocaleDateString()}
                  </div>
                </div>
              
            </div>
          ) : (
            <div className="text-xs text-gray-500 bg-white/50 rounded-lg p-3">
              No health log available to share
            </div>
          )}
        </div>

        {/* Right Column - Medical Documents */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Share Medical Documents</span>
          </h3>
          
          {healthData.medical_documents && healthData.medical_documents.length > 0 ? (
            <div className="space-y-2">
              <div className="text-xs text-gray-600 mb-2">
                Select documents to share:
              </div>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {healthData.medical_documents.map((doc) => (
                  <div
                    key={doc.document_id}
                    className="bg-white/80 rounded-lg p-3 border border-gray-100"
                  >
                    <label className="flex items-start space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedDocuments.includes(doc.document_id)}
                        onChange={() => handleDocumentToggle(doc.document_id)}
                        disabled={hasExistingAppointment}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-800 truncate">
                            {doc.file_name}
                          </span>
                          <button
                            onClick={() => handleDocumentPreview(doc.document_id)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {doc.description && `${doc.description} • `}
                          {new Date(doc.upload_date).toLocaleDateString()}
                          {doc.last_checkup_date && (
                            <div className="text-xs text-gray-400 mt-1">
                              Last checkup: {new Date(doc.last_checkup_date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-500 bg-white/50 rounded-lg p-3">
              No medical documents available to share
            </div>
          )}
        </div>
      </div>

      {/* Summary of selected items */}
      {(shareHealthLog || selectedDocuments.length > 0) && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
          <div className="text-xs text-green-800 font-medium mb-1">
            Data to be shared with doctor:
          </div>
          <div className="text-xs text-green-700 space-y-1">
            {shareHealthLog && (
              <div className="flex items-center space-x-1">
                <Activity className="w-3 h-3" />
                <span>Latest health log</span>
              </div>
            )}
            {selectedDocuments.length > 0 && (
              <div className="flex items-center space-x-1">
                <FileText className="w-3 h-3" />
                <span>{selectedDocuments.length} medical document(s)</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthDataSection;
