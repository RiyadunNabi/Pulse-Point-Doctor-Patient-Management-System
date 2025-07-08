//components/PatientDashboard/DashboardContent/DashboardView.js

import React from 'react';
import ProfileCard from '../ProfileCard';
import HealthLogSection from '../HealthLogSection';
import GraphSection from '../GraphSection';
import MedicalDocumentsSection from '../MedicalDocumentsSection';

const DashboardView = ({ 
    patient, 
    healthLogs, 
    onPatientUpdate, 
    onHealthLogsUpdate, 
    patientId 
}) => {
    return (
        <>
            <ProfileCard
                patient={patient}
                onPatientUpdate={onPatientUpdate}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                <div className="lg:col-span-1">
                    <HealthLogSection
                        healthLogs={healthLogs}
                        onUpdate={onHealthLogsUpdate}
                        patientId={patientId}
                    />
                </div>

                <div className="lg:col-span-2">
                    <GraphSection healthLogs={healthLogs} />
                </div>
            </div>

            <MedicalDocumentsSection patientId={patientId} />
        </>
    );
};

export default DashboardView;
