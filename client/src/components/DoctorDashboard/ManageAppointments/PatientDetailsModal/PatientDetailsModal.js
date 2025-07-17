import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, User, Calendar, Phone, Mail, MapPin } from 'lucide-react';
import PatientInfo from './PatientInfo';
import HealthLogsSection from './HealthLogsSection';
import MedicalDocumentsSection from './MedicalDocumentsSection';

const PatientDetailsModal = ({ patient, onClose }) => {
    const [activeTab, setActiveTab] = useState('info');
    // const [healthLogs, setHealthLogs] = useState([]); //plural
    const [healthLog, setHealthLog] = useState(null);
    const [medicalDocuments, setMedicalDocuments] = useState([]);
    const [loading, setLoading] = useState(false);

    const tabs = [
        { id: 'info', label: 'Patient Info', icon: User },
        { id: 'health', label: 'Health Logs', icon: Calendar },
        { id: 'documents', label: 'Medical Documents', icon: Phone }
    ];

    // Fetch the one shared health log
    const fetchSharedHealthLog = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(
                `/api/appointments/${patient.appointment_id}/shared-health-log`
            );
            setHealthLog(data);        // not an array any more
        } catch (err) {
            console.error(err);
            setHealthLog(null);
        } finally {
            setLoading(false);
        }
    };

    // Fetch the checklist-selected medical documents
    const fetchSharedDocuments = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(
                `/api/appointments/${patient.appointment_id}/shared-documents`
            );
            setMedicalDocuments(data); // array
        } catch (err) {
            console.error(err);
            setMedicalDocuments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'health') {
            fetchSharedHealthLog();
        } else if (activeTab === 'documents') {
            fetchSharedDocuments();
        }
    }, [activeTab, patient.appointment_id]);

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    onClick={onClose}
                ></div>

                {/* Modal content */}
                <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white">
                                        {patient.patient_first_name} {patient.patient_last_name}
                                    </h3>
                                    <p className="text-sky-100 text-sm">
                                        Patient ID: {patient.patient_id}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white hover:text-gray-200 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${activeTab === tab.id
                                            ? 'border-sky-500 text-sky-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6 max-h-96 overflow-y-auto">
                        {activeTab === 'info' && <PatientInfo patient={patient} />}
                        {activeTab === 'health' && (
                            <HealthLogsSection
                                healthLog={healthLog}
                                loading={loading}
                            />
                        )}
                        {activeTab === 'documents' && (
                            <MedicalDocumentsSection
                                documents={medicalDocuments}
                                loading={loading}
                            />
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Close
                        </button>
                        <button className="px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-lg hover:from-sky-600 hover:to-cyan-600 transition-colors">
                            Create Prescription
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDetailsModal;
