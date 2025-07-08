import React, { useState } from 'react';
import { Heart, Activity, TrendingUp, Settings, Plus, Edit3, Droplets, Moon } from 'lucide-react';
import EditHealthLogModal from './EditHealthLogModal';

const calculateBMI = (weight, height = 170) => {
  if (!weight || !height) return null;
  const heightInMeters = height / 100;
  return (weight / (heightInMeters * heightInMeters)).toFixed(1);
};

// Helper function to safely format dates
const formatDate = (dateString) => {
  if (!dateString) return 'No date';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  return date.toLocaleDateString();
};

function HealthLogSection({ healthLogs, onUpdate, patientId }) {
  // Modal state management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  // Handler functions for modal
  const handleAddLog = () => {
    setSelectedLog(null);
    setIsModalOpen(true);
  };

  const handleEditLog = (log) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedLog(null);
  };

  const handleLogUpdate = (updatedLog) => {
    console.log('Health log updated:', updatedLog);
    onUpdate(); // Refresh the health logs list
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800">Health Summary</h3>
        <button
          onClick={handleAddLog}
          className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white rounded-lg shadow-md transition-all duration-200 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Update</span>
        </button>
      </div>

      {healthLogs.length > 0 ? (
        <div className="space-y-4">
          {/* Latest Health Stats - Extended Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Weight */}
            <div className="bg-sky-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-sky-600" />
                <span className="text-sm font-medium text-slate-700">Weight</span>
              </div>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                {healthLogs[0]?.weight || 'N/A'} 
                {healthLogs[0]?.weight && <span className="text-sm text-slate-500 ml-1">kg</span>}
              </p>
            </div>
            
            {/* Heart Rate */}
            <div className="bg-cyan-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-cyan-600" />
                <span className="text-sm font-medium text-slate-700">Heart Rate</span>
              </div>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                {healthLogs[0]?.heart_rate || 'N/A'}
                {healthLogs[0]?.heart_rate && <span className="text-sm text-slate-500 ml-1">bpm</span>}
              </p>
            </div>
            
            {/* Blood Pressure */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-slate-700">Blood Pressure</span>
              </div>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                {healthLogs[0]?.systolic && healthLogs[0]?.diastolic 
                  ? `${healthLogs[0].systolic}/${healthLogs[0].diastolic}`
                  : 'N/A'
                }
              </p>
            </div>
            
            {/* Blood Sugar */}
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Droplets className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-slate-700">Blood Sugar</span>
              </div>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                {healthLogs[0]?.blood_sugar || 'N/A'}
                {healthLogs[0]?.blood_sugar && <span className="text-sm text-slate-500 ml-1">mg/dL</span>}
              </p>
            </div>
            
            {/* Sleep Hours */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Moon className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-slate-700">Sleep</span>
              </div>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                {healthLogs[0]?.sleep_hours || 'N/A'}
                {healthLogs[0]?.sleep_hours && <span className="text-sm text-slate-500 ml-1">hrs</span>}
              </p>
            </div>
            
            {/* BMI */}
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-medium text-slate-700">BMI</span>
              </div>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                {healthLogs[0]?.weight ? calculateBMI(healthLogs[0].weight) : 'N/A'}
              </p>
            </div>
          </div>

          {/* Recent Logs with Edit Functionality - FULLY CORRECTED */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Recent Logs</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {healthLogs.slice(0, 5).map((log) => (
                <div key={log.log_id} className="flex justify-between items-center p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-slate-600">
                        {formatDate(log.created_at)}
                      </span>
                      <button
                        onClick={() => handleEditLog(log)}
                        className="p-1 text-slate-400 hover:text-sky-600 transition-colors"
                        title="Edit this log"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Complete Health Metrics Display */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {log.weight && (
                        <span className="text-slate-700">
                          <span className="text-slate-500">Weight:</span> {log.weight}kg
                        </span>
                      )}
                      {log.heart_rate && (
                        <span className="text-slate-700">
                          <span className="text-slate-500">HR:</span> {log.heart_rate}bpm
                        </span>
                      )}
                      {(log.systolic || log.diastolic) && (
                        <span className="text-slate-700">
                          <span className="text-slate-500">BP:</span> {log.systolic || '?'}/{log.diastolic || '?'}
                        </span>
                      )}
                      {log.blood_sugar && (
                        <span className="text-slate-700">
                          <span className="text-slate-500">Sugar:</span> {log.blood_sugar}mg/dL
                        </span>
                      )}
                      {log.sleep_hours && (
                        <span className="text-slate-700">
                          <span className="text-slate-500">Sleep:</span> {log.sleep_hours}hrs
                        </span>
                      )}
                    </div>
                    
                    {log.notes && (
                      <div className="mt-2 pt-2 border-t border-slate-200">
                        <p className="text-xs text-slate-600 italic">{log.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-500">No health logs yet</p>
          <p className="text-sm text-slate-400">Start tracking your health metrics</p>
        </div>
      )}

      {/* Health Log Modal */}
      <EditHealthLogModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        patientId={patientId}
        onUpdate={handleLogUpdate}
        existingLog={selectedLog}
      />
    </div>
  );
}

export default HealthLogSection;
