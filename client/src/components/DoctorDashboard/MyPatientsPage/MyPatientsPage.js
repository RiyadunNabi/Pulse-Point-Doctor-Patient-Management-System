import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    ArrowLeft, 
    Search, 
    Filter, 
    Users, 
    TrendingUp,
    Calendar,
    User,
    Phone,
    Mail,
    MapPin,
    Activity,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

import DoctorNavigation from '../shared/DoctorNavigation';
import PatientCard from './components/PatientCard';
import PatientDetailsModal from './components/PatientDetailsModal';
import PatientFilters from './components/PatientFilters';
import AnalyticsCharts from './components/AnalyticsCharts';

const MyPatientsPage = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Filter and search states
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        gender: '',
        from_date: '',
        to_date: '',
        sort_by: 'last_appointment',
        sort_order: 'desc'
    });
    
    // Pagination state
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        hasNextPage: false,
        hasPrevPage: false
    });
    
    // Modal states
    const [showPatientModal, setShowPatientModal] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);

    // Fetch patients data
    const fetchPatients = useCallback(async (page = 1) => {
        if (!user?.doctor_id) return;

        try {
            setLoading(true);
            const params = new URLSearchParams({
                search: searchTerm,
                ...filters,
                page: page.toString(),
                limit: '12'
            });

            // Remove empty params
            Object.keys(filters).forEach(key => {
                if (!filters[key]) params.delete(key);
            });
            if (!searchTerm) params.delete('search');

            const response = await axios.get(
                `/api/doctor-patients/doctor/${user.doctor_id}?${params}`
            );
            
            setPatients(response.data.patients);
            setPagination(response.data.pagination);
            setError('');
        } catch (err) {
            console.error('Error fetching patients:', err);
            setError('Failed to fetch patients data');
        } finally {
            setLoading(false);
        }
    }, [user?.doctor_id, searchTerm, filters]);

    // Initial load and when dependencies change
    useEffect(() => {
        fetchPatients(1);
    }, [fetchPatients]);

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        fetchPatients(1);
    };

    // Handle filter change
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    // Handle pagination
    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
        fetchPatients(page);
    };

    // Handle patient details
    const handleViewPatientDetails = (patient) => {
        setSelectedPatient(patient);
        setShowPatientModal(true);
    };

    // Get summary stats
    const getSummaryStats = () => {
        if (patients.length === 0) return { total: 0, completed: 0, cancelled: 0, pending: 0 };
        
        return patients.reduce((acc, patient) => ({
            total: acc.total + parseInt(patient.total_appointments || 0),
            completed: acc.completed + parseInt(patient.completed_appointments || 0),
            cancelled: acc.cancelled + parseInt(patient.cancelled_appointments || 0),
            pending: acc.pending + parseInt(patient.pending_appointments || 0)
        }), { total: 0, completed: 0, cancelled: 0, pending: 0 });
    };

    const stats = getSummaryStats();

    if (loading && patients.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center">
                <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
                    <span className="text-slate-700 font-medium">Loading patients...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-sky-100 to-blue-50">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-sky-200/20 to-cyan-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-sky-200/20 rounded-full blur-3xl"></div>
            </div>

            {/* Add the shared navigation */}
            <DoctorNavigation user={user} onLogout={onLogout} />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header - Remove the back button since we now have global navigation */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">My Patients</h1>
                            <p className="text-slate-600 mt-1">
                                Manage and view your patients who have booked appointments
                            </p>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setShowAnalytics(!showAnalytics)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                    showAnalytics
                                        ? 'bg-purple-500 text-white shadow-md'
                                        : 'bg-white/70 text-purple-600 hover:bg-purple-50'
                                }`}
                            >
                                <TrendingUp className="w-4 h-4 inline mr-2" />
                                Analytics
                            </button>
                        </div>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Total Patients</p>
                                <p className="text-2xl font-bold text-slate-800">{pagination.totalRecords}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Total Appointments</p>
                                <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Completed</p>
                                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Cancelled</p>
                                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center">
                                <XCircle className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Analytics Charts */}
                {showAnalytics && (
                    <div className="mb-8">
                        <AnalyticsCharts doctorId={user?.doctor_id} />
                    </div>
                )}

                {/* Search and Filters */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="flex-1">
                            <form onSubmit={handleSearch} className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search patients by name, email, or phone..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 bg-white"
                                />
                            </form>
                        </div>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                                showFilters 
                                    ? 'bg-sky-500 text-white shadow-md' 
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            <Filter className="w-4 h-4" />
                            <span>Filters</span>
                        </button>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="mt-6 pt-6 border-t border-slate-200">
                            <PatientFilters 
                                filters={filters}
                                onFilterChange={handleFilterChange}
                            />
                        </div>
                    )}
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
                        <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                {/* Patients Grid */}
                {patients.length === 0 && !loading ? (
                    <div className="text-center py-12">
                        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
                        <p className="text-gray-500">
                            {searchTerm || Object.values(filters).some(v => v) 
                                ? 'Try adjusting your search or filters'
                                : 'No patients have booked appointments with you yet.'
                            }
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {patients.map((patient) => (
                                <PatientCard
                                    key={patient.patient_id}
                                    patient={patient}
                                    onViewDetails={handleViewPatientDetails}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm">
                                <div className="text-sm text-slate-600">
                                    Showing {((pagination.currentPage - 1) * 12) + 1} to {Math.min(pagination.currentPage * 12, pagination.totalRecords)} of {pagination.totalRecords} patients
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                                        disabled={!pagination.hasPrevPage}
                                        className="p-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    
                                    <div className="flex items-center space-x-1">
                                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                            .filter(page => 
                                                page === 1 || 
                                                page === pagination.totalPages || 
                                                Math.abs(page - pagination.currentPage) <= 1
                                            )
                                            .map((page, index, array) => (
                                                <React.Fragment key={page}>
                                                    {index > 0 && array[index - 1] !== page - 1 && (
                                                        <span className="px-2 text-slate-400">...</span>
                                                    )}
                                                    <button
                                                        onClick={() => handlePageChange(page)}
                                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                            page === pagination.currentPage
                                                                ? 'bg-sky-500 text-white'
                                                                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                </React.Fragment>
                                            ))
                                        }
                                    </div>
                                    
                                    <button
                                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                                        disabled={!pagination.hasNextPage}
                                        className="p-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Patient Details Modal */}
            {showPatientModal && selectedPatient && (
                <PatientDetailsModal
                    patient={selectedPatient}
                    doctorId={user?.doctor_id}
                    isOpen={showPatientModal}
                    onClose={() => {
                        setShowPatientModal(false);
                        setSelectedPatient(null);
                    }}
                />
            )}
        </div>
    );
};

export default MyPatientsPage;
