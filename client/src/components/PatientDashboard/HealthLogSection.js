import React, { useState } from 'react';
import { Heart, Activity, TrendingUp, Settings, Plus } from 'lucide-react';

const calculateBMI = (weight, height = 170) => {
  if (!weight || !height) return null;
  const heightInMeters = height / 100;
  return (weight / (heightInMeters * heightInMeters)).toFixed(1);
};

function HealthLogSection({ healthLogs, onUpdate }) {
  const [showHealthLogForm, setShowHealthLogForm] = useState(false);

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800">Health Summary</h3>
        <button
          onClick={() => setShowHealthLogForm(true)}
          className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white rounded-lg shadow-md transition-all duration-200 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Update</span>
        </button>
      </div>

      {healthLogs.length > 0 ? (
        <div className="space-y-4">
          {/* Latest Health Stats */}
          <div className="grid grid-cols-2 gap-4">
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

          {/* Recent Logs */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Recent Logs</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {healthLogs.slice(0, 5).map((log, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">
                    {new Date(log.created_at).toLocaleDateString()}
                  </span>
                  <span className="text-sm font-medium text-slate-700">
                    {log.weight && `${log.weight}kg`}
                    {log.weight && log.heart_rate && ' • '}
                    {log.heart_rate && `${log.heart_rate}bpm`}
                  </span>
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
    </div>
  );
}

export default HealthLogSection;
