//client\src\components\PatientDashboard\PatientAppointmentsPage\index.js
import React, { useState } from 'react';
import DashboardNavigation from '../Navigation/DashboardNavigation';
import Modal from '../../shared/Modal';
import SearchBar from './components/SearchBar';
import TabNavigation from './components/TabNavigation';
import AppointmentCard from './components/AppointmentCard';
import PrescriptionView from './components/PrescriptionView';
import EmptyState from './components/EmptyState';
import { useAppointments } from './hooks/useAppointments';

const PatientAppointmentsPage = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [prescription, setPrescription] = useState(null);
    const [reportFile, setReportFile] = useState(null);
    const [notifications] = useState(3);

    const {
        appointments,
        loading,
        filteredAppointments,
        handleDeleteAppointment,
        handleViewPrescription,
        handleUploadReport,
        submitReport
    } = useAppointments(
        user?.patient_id,
        activeTab,
        searchTerm,
        setPrescription,
        setShowPrescriptionModal,
        setSelectedAppointment,
        setShowReportModal,
        reportFile,
        setReportFile
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
                <DashboardNavigation
                    activeTab="appointments"
                    onTabClick={() => {}}
                    notifications={notifications}
                    onLogout={onLogout}
                />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
                        <p className="text-slate-600">Loading your appointments...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-sky-200/20 to-cyan-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-sky-200/20 rounded-full blur-3xl"></div>
            </div>

            <DashboardNavigation
                user={user}
                activeTab="appointments"
                onTabClick={() => {}}
                notifications={notifications}
                onLogout={onLogout}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">My Appointments</h1>
                    <p className="text-slate-600">Manage your healthcare appointments and medical records</p>
                </div>

                {/* Search Bar */}
                <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

                {/* Main Content */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
                    <TabNavigation
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        appointments={appointments}
                    />

                    {/* Tab Content */}
                    <div className="p-6">
                        {filteredAppointments.length === 0 ? (
                            <EmptyState activeTab={activeTab} />
                        ) : (
                            <div className="grid gap-6">
                                {filteredAppointments.map((appointment) => (
                                    <AppointmentCard
                                        key={appointment.appointment_id}
                                        appointment={appointment}
                                        activeTab={activeTab}
                                        onDelete={handleDeleteAppointment}
                                        onViewPrescription={handleViewPrescription}
                                        onUploadReport={handleUploadReport}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Prescription Modal */}
            {showPrescriptionModal && (
                <Modal
                    isOpen={showPrescriptionModal}
                    onClose={() => setShowPrescriptionModal(false)}
                    title="Prescription Details"
                    subtitle="View your prescription information"
                    size="lg"
                >
                    <PrescriptionView prescription={prescription} appointment={selectedAppointment} />
                </Modal>
            )}

            {/* Report Upload Modal */}
            {showReportModal && (
                <Modal
                    isOpen={showReportModal}
                    onClose={() => setShowReportModal(false)}
                    title="Upload Investigation Report"
                    subtitle="Upload your test results"
                >
                    <form onSubmit={(e) => submitReport(e, selectedAppointment, prescription)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Select Report File
                            </label>
                            <input
                                type="file"
                                onChange={(e) => setReportFile(e.target.files[0])}
                                accept=".pdf,.jpg,.jpeg,.png"
                                required
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                Supported formats: PDF, JPG, PNG (Max 10MB)
                            </p>
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setShowReportModal(false)}
                                className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!reportFile}
                                className="px-4 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Upload Report
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default PatientAppointmentsPage;
