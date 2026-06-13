
import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import DashboardNavigation from './Navigation/DashboardNavigation';
import ProfileCard from './ProfileCard';
import HealthLogSection from './HealthLogSection';
import GraphSection from './GraphSection';
import MedicalDocumentsSection from './MedicalDocumentsSection';
import { usePatientData } from './hooks/usePatientData';
import { useHealthLogs } from './hooks/useHealthLogs';

function PatientDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications] = useState(3);

  // Custom hooks
  const { patient, loading: patientLoading, error, fetchPatientData, handlePatientUpdate } = usePatientData(user, onLogout);
  const { healthLogs, fetchHealthLogs } = useHealthLogs(user?.patient_id);

  // User validation
  useEffect(() => {
    if (!user || !user.patient_id) {
      console.error('Invalid user data:', user);
      if (onLogout) {
        onLogout();
      }
      return;
    }
  }, [user, onLogout]);

  // Fetch initial data
  useEffect(() => {
    if (user?.patient_id) {
      fetchPatientData();
      fetchHealthLogs();
    }
  }, [fetchPatientData, fetchHealthLogs, user?.patient_id]);

  // Error states
  if (!user || !user.patient_id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <User className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Invalid user session. Please log in again.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <div className="text-red-600 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (patientLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Fetching your health data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-100 to-cyan-100">
      <DashboardNavigation 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notifications={notifications}
        onLogout={onLogout}
        user={user}
      />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Dashboard Content with Equal Spacing and Custom Width Distribution */}
          <div className="space-y-6">
            {/* First Row - Profile Card (Full Width) */}
            <div className="w-full">
              <div className="h-full">
                <ProfileCard 
                  patient={patient}
                  onPatientUpdate={handlePatientUpdate}
                />
              </div>
            </div>

            {/* Second Row - Health Logs (1/3) and Graph (2/3) with Equal Heights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 items-stretch">
              <div className="lg:col-span-1">
                <HealthLogSection
                  healthLogs={healthLogs}
                  onUpdate={fetchHealthLogs}
                  patientId={user.patient_id}
                />
              </div>
              <div className="lg:col-span-2">
                <GraphSection healthLogs={healthLogs} />
              </div>
            </div>

            {/* Third Row - Medical Documents (Full Width) */}
            <div className="w-full">
              <div className="h-full">
                <MedicalDocumentsSection patientId={user.patient_id} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PatientDashboard;
