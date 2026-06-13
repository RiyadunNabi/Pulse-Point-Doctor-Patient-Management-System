import React, { useState, useEffect } from 'react';
import { 
    Calendar, 
    Clock, 
    User, 
    FileText, 
    Upload, 
    CreditCard, 
    Star, 
    Edit3, 
    Trash2, 
    Search,
    Filter,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';
import axios from 'axios';
import DashboardNavigation from '../Navigation/DashboardNavigation';
import Modal from '../../shared/Modal';
import InputField from '../../shared/InputField';

const PatientAppointmentsPage = ({ user, onLogout }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [prescription, setPrescription] = useState(null);
    const [reportFile, setReportFile] = useState(null);
    const [notifications] = useState(3);

    // Fetch appointments
    useEffect(() => {
        fetchAppointments();
    }, [user?.patient_id]);

    const fetchAppointments = async () => {
        if (!user?.patient_id) return;
        
        try {
            setLoading(true);
            const response = await axios.get(`/api/appointments/patient/${user.patient_id}`);
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter appointments by status and search
    const filteredAppointments = appointments
        .filter(apt => apt.status === activeTab)
        .filter(apt => 
            searchTerm === '' || 
            apt.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.department_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.reason?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const dateA = new Date(`${a.appointment_date} ${a.appointment_time}`);
            const dateB = new Date(`${b.appointment_date} ${b.appointment_time}`);
            return dateA - dateB;
        });

    // Delete appointment
    const handleDeleteAppointment = async (appointmentId) => {
        if (!window.confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) {
            return;
        }

        try {
            await axios.delete(`/api/appointments/${appointmentId}`);
            fetchAppointments();
        } catch (error) {
            console.error('Error deleting appointment:', error);
            alert('Failed to delete appointment. Please try again.');
        }
    };

    // View prescription
    const handleViewPrescription = async (appointmentId) => {
        try {
            const response = await axios.get(`/api/prescriptions/appointment/${appointmentId}`);
            setPrescription(response.data);
            setShowPrescriptionModal(true);
        } catch (error) {
            console.error('Error fetching prescription:', error);
            if (error.response?.status === 404) {
                alert('No prescription found for this appointment.');
            } else {
                alert('Failed to fetch prescription. Please try again.');
            }
        }
    };

    // Upload investigation report
    const handleUploadReport = (appointment) => {
        setSelectedAppointment(appointment);
        setShowReportModal(true);
    };

    const submitReport = async (e) => {
        e.preventDefault();
        if (!reportFile || !selectedAppointment) return;

        const formData = new FormData();
        formData.append('reportFile', reportFile);
        formData.append('prescription_id', prescription?.prescription_id);
        formData.append('investigation_id', 1); // You'll need to implement investigation selection
        formData.append('notes', 'Patient uploaded report');

        try {
            await axios.post('/api/investigation-reports', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setShowReportModal(false);
            setReportFile(null);
            alert('Report uploaded successfully!');
        } catch (error) {
            console.error('Error uploading report:', error);
            alert('Failed to upload report. Please try again.');
        }
    };

    // Tab configuration
    const tabs = [
        { id: 'pending', label: 'Pending', icon: AlertCircle, color: 'text-amber-600 bg-amber-100' },
        { id: 'completed', label: 'Completed', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
        { id: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'text-red-600 bg-red-100' }
    ];

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'bg-amber-100 text-amber-800', label: 'Pending' },
            completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
            cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
        };
        
        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                {config.label}
            </span>
        );
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (time) => {
        return new Date(`2000-01-01 ${time}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

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

                {/* Search and Filter */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 mb-8">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by doctor, department, or reason..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
                    <div className="border-b border-slate-200">
                        <nav className="flex space-x-8 px-6">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                const count = appointments.filter(apt => apt.status === tab.id).length;
                                
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center space-x-2 ${
                                            isActive
                                                ? 'border-sky-500 text-sky-600'
                                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{tab.label}</span>
                                        <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full ${
                                            isActive ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {filteredAppointments.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 bg-gradient-to-r from-sky-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Calendar className="w-12 h-12 text-sky-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                                    No {activeTab} appointments
                                </h3>
                                <p className="text-slate-600 max-w-md mx-auto">
                                    {activeTab === 'pending' 
                                        ? "You don't have any pending appointments. Book a new appointment to get started."
                                        : `You don't have any ${activeTab} appointments yet.`
                                    }
                                </p>
                            </div>
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
                                        formatDate={formatDate}
                                        formatTime={formatTime}
                                        getStatusBadge={getStatusBadge}
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
                    <PrescriptionView prescription={prescription} />
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
                    <form onSubmit={submitReport} className="space-y-6">
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

// Appointment Card Component
const AppointmentCard = ({ 
    appointment, 
    activeTab, 
    onDelete, 
    onViewPrescription, 
    onUploadReport, 
    formatDate, 
    formatTime, 
    getStatusBadge 
}) => {
    return (
        <div className="bg-gradient-to-r from-white to-slate-50 rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-sky-300">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-800">
                            Dr. {appointment.first_name} {appointment.last_name}
                        </h3>
                        <p className="text-sm text-slate-600">{appointment.department_name}</p>
                    </div>
                </div>
                {getStatusBadge(appointment.status)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{formatDate(appointment.appointment_date)}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{formatTime(appointment.appointment_time)}</span>
                </div>
            </div>

            {appointment.reason && (
                <div className="mb-4">
                    <p className="text-sm text-slate-600">
                        <span className="font-medium">Reason:</span> {appointment.reason}
                    </p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
                {activeTab === 'pending' && (
                    <>
                        <button
                            className="flex items-center space-x-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                            onClick={() => alert('Edit functionality coming soon!')}
                        >
                            <Edit3 className="w-4 h-4" />
                            <span>Edit</span>
                        </button>
                        <button
                            className="flex items-center space-x-1 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
                            onClick={() => onDelete(appointment.appointment_id)}
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                        </button>
                    </>
                )}

                {activeTab === 'completed' && (
                    <>
                        <button
                            className="flex items-center space-x-1 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-medium transition-colors"
                            onClick={() => onViewPrescription(appointment.appointment_id)}
                        >
                            <FileText className="w-4 h-4" />
                            <span>View Prescription</span>
                        </button>
                        <button
                            className="flex items-center space-x-1 px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-sm font-medium transition-colors"
                            onClick={() => onUploadReport(appointment)}
                        >
                            <Upload className="w-4 h-4" />
                            <span>Upload Report</span>
                        </button>
                        <button
                            className="flex items-center space-x-1 px-3 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg text-sm font-medium transition-colors"
                            onClick={() => alert('Payment functionality coming soon!')}
                        >
                            <CreditCard className="w-4 h-4" />
                            <span>Make Payment</span>
                        </button>
                        <button
                            className="flex items-center space-x-1 px-3 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg text-sm font-medium transition-colors"
                            onClick={() => alert('Review functionality coming soon!')}
                        >
                            <Star className="w-4 h-4" />
                            <span>Give Review</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

// Prescription View Component
const PrescriptionView = ({ prescription }) => {
    if (!prescription) return <div>No prescription data available.</div>;

    return (
        <div className="space-y-6">
            <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-semibold text-slate-800 mb-2">Diagnosis</h4>
                <p className="text-slate-600">{prescription.diagnosis || 'Not specified'}</p>
            </div>

            {prescription.instructions && (
                <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-800 mb-2">Instructions</h4>
                    <p className="text-slate-600">{prescription.instructions}</p>
                </div>
            )}

            {prescription.drugs && prescription.drugs.length > 0 && (
                <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-800 mb-3">Prescribed Medications</h4>
                    <div className="space-y-3">
                        {prescription.drugs.map((drug, index) => (
                            <div key={index} className="bg-white rounded-lg p-3 border border-slate-200">
                                <div className="font-medium text-slate-800">{drug.drug_name}</div>
                                <div className="text-sm text-slate-600">
                                    Dosage: {drug.dosages} | Frequency: {drug.frequency_per_day}/day | Duration: {drug.duration}
                                </div>
                                {drug.additional_notes && (
                                    <div className="text-sm text-slate-500 mt-1">Notes: {drug.additional_notes}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {prescription.investigations && prescription.investigations.length > 0 && (
                <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-800 mb-3">Recommended Tests</h4>
                    <div className="space-y-2">
                        {prescription.investigations.map((investigation, index) => (
                            <div key={index} className="bg-white rounded-lg p-3 border border-slate-200">
                                <div className="font-medium text-slate-800">{investigation.name}</div>
                                {investigation.notes && (
                                    <div className="text-sm text-slate-600 mt-1">Notes: {investigation.notes}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {prescription.other_drugs && (
                <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-800 mb-2">Other Medications</h4>
                    <p className="text-slate-600">{prescription.other_drugs}</p>
                </div>
            )}
        </div>
    );
};

export default PatientAppointmentsPage;
