//client\src\components\PatientDashboard\PatientAppointmentsPage\components\AppointmentCard.js



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
    Building2,
    Stethoscope,
    DollarSign
} from 'lucide-react';
import axios from 'axios';
import { formatDate, formatTime, getStatusBadge } from '../utils/dateUtils';
import ReviewModal from './ReviewModal/ReviewModal';
import PaymentModal from './PaymentModal/PaymentModal';
import UploadReportModal from './UploadReportModal/UploadReportModal';

const AppointmentCard = ({
    appointment,
    activeTab,
    onDelete,
    onViewPrescription,
    onUploadReport
}) => {
    const [paymentStatus, setPaymentStatus] = useState('pending');
    const [paymentLoading, setPaymentLoading] = useState(true);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showUploadReportModal, setShowUploadReportModal] = useState(false); 

    // Fetch payment status
    useEffect(() => {
        const fetchPaymentStatus = async () => {
            try {
                setPaymentLoading(true);
                const response = await axios.get(`/api/payments/appointment/${appointment.appointment_id}`);
                if (response.data && response.data.length > 0) {
                    setPaymentStatus(response.data[0].payment_status || 'pending');
                } else {
                    setPaymentStatus('unpaid');
                }
            } catch (error) {
                console.error('Error fetching payment status:', error);
                setPaymentStatus('unknown');
            } finally {
                setPaymentLoading(false);
            }
        };

        if (appointment.appointment_id) {
            fetchPaymentStatus();
        }
    }, [appointment.appointment_id]);

    // Get payment status badge
    const getPaymentStatusBadge = (status) => {
        const statusConfig = {
            paid: { color: 'bg-green-50 text-green-700 border-green-200', label: 'Paid', icon: '✅' },
            // pending: { color: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Pending', icon: '⏳' },
            // failed: { color: 'bg-red-50 text-red-700 border-red-200', label: 'Failed', icon: '❌' },
            unpaid: { color: 'bg-slate-50 text-slate-700 border-slate-200', label: 'Unpaid', icon: '💳' },
            unknown: { color: 'bg-gray-50 text-gray-600 border-gray-200', label: 'Unknown', icon: '❓' }
        };

        const config = statusConfig[status] || statusConfig.unknown;
        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
                <span className="mr-1">{config.icon}</span>
                {config.label}
            </span>
        );
    };

    // Get card gradient based on status (lighter colors)
    const getCardGradient = () => {
        switch (activeTab) {
            case 'pending':
                return 'bg-gradient-to-br from-amber-25 via-orange-25 to-yellow-25 border-amber-100 hover:border-amber-200';
            case 'completed':
                return 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-300';
            case 'cancelled':
                return 'bg-gradient-to-br from-red-25 via-rose-25 to-pink-25 border-red-100 hover:border-red-200';
            default:
                return 'bg-gradient-to-br from-slate-25 via-gray-25 to-blue-25 border-slate-100 hover:border-slate-200';
        }
    };

    // Add handler for review submission
    const handleReviewSubmitted = () => {
        // You can add any additional logic here if needed
        console.log('Review submitted successfully');
    };

    // Add handler for payment submission
    const handlePaymentSubmitted = () => {
        // Refresh payment status after successful payment
        const fetchPaymentStatus = async () => {
            try {
                const response = await axios.get(`/api/payments/appointment/${appointment.appointment_id}`);
                if (response.data && response.data.length > 0) {
                    setPaymentStatus(response.data[0].payment_status || 'pending');
                } else {
                    setPaymentStatus('unpaid');
                }
            } catch (error) {
                console.error('Error fetching payment status:', error);
            }
        };
        fetchPaymentStatus();
    };

    const handleReportUploaded = () => {
        console.log('Report uploaded successfully');
    };


    return (
        <>
            <div className={`${getCardGradient()} rounded-xl border p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm`}>
                {/* Header with Doctor Info and Action Buttons */}
                <div className="flex justify-between items-start mb-4">
                    {/* Doctor Info */}
                    <div className="flex items-center space-x-3 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center shadow-sm">
                            <Stethoscope className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-800 flex items-center">
                                <User className="w-4 h-4 mr-1 text-blue-500" />
                                Dr. {appointment.first_name} {appointment.last_name}
                            </h3>
                            <p className="text-sm text-slate-600 flex items-center mt-0.5">
                                <Building2 className="w-3 h-3 mr-1 text-purple-500" />
                                {appointment.department_name}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons - Right Side */}
                    {activeTab === 'pending' && (
                        <div className="flex space-x-2 ml-4">
                            <button
                                className="flex items-center space-x-1 px-2.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                                onClick={() => alert('Edit functionality coming soon!')}
                            >
                                <Edit3 className="w-3 h-3" />
                                <span>Edit Appointment</span>
                            </button>
                            <button
                                className="flex items-center space-x-1 px-2.5 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                                onClick={() => onDelete(appointment.appointment_id)}
                            >
                                <Trash2 className="w-3 h-3" />
                                <span>Delete</span>
                            </button>
                        </div>
                    )}

                    {activeTab === 'completed' && (
                        <div className="flex flex-wrap gap-1.5 ml-4">
                            <button
                                className="flex items-center space-x-1 px-2.5 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                                onClick={() => onViewPrescription(appointment.appointment_id)}
                            >
                                <FileText className="w-3 h-3" />
                                <span>Prescription</span>
                            </button>
                            <button
                                className="flex items-center space-x-1 px-2.5 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                                onClick={() => setShowUploadReportModal(true)}
                            >
                                <Upload className="w-3 h-3" />
                                <span>Upload Report</span>
                            </button>
                            <button
                                className="flex items-center space-x-1 px-2.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                                onClick={() => setShowPaymentModal(true)}
                            >
                                <CreditCard className="w-3 h-3" />
                                <span>Make Payment</span>
                            </button>
                            <button
                                className="flex items-center space-x-1 px-2.5 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                                onClick={() => setShowReviewModal(true)}
                            >
                                <Star className="w-3 h-3" />
                                <span>Review</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Appointment Details */}
                <div className="space-y-3 mb-4">
                    {/* Date and Time - Side by Side */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-slate-700 bg-white/70 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium">{formatDate(appointment.appointment_date)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-700 bg-white/70 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm">
                            <Clock className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium">{formatTime(appointment.appointment_time)}</span>
                        </div>
                    </div>

                    {/* Reason */}
                    {appointment.reason && (
                        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 shadow-sm">
                            <p className="text-sm text-slate-700">
                                <span className="font-medium text-purple-600">Reason:</span>{' '}
                                <span className="text-slate-600">{appointment.reason}</span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Status and Payment Info */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/40">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                            <span className="text-sm font-medium text-slate-600 mr-2">Status:</span>
                            {getStatusBadge(appointment.status)}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-slate-600 mr-2">Payment:</span>
                        {paymentLoading ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                                <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-600 mr-1"></div>
                                Loading...
                            </span>
                        ) : (
                            getPaymentStatusBadge(paymentStatus)
                        )}
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            <ReviewModal
                isOpen={showReviewModal}
                onClose={() => setShowReviewModal(false)}
                appointment={appointment}
                onReviewSubmitted={handleReviewSubmitted}
            />

            {/* Payment Modal */}
            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                appointment={appointment}
                onPaymentSubmitted={handlePaymentSubmitted}
            />

            {/* Upload Report Modal */}
            <UploadReportModal
                isOpen={showUploadReportModal}
                onClose={() => setShowUploadReportModal(false)}
                appointment={appointment}
                onReportUploaded={handleReportUploaded}
            />
        </>
    );
};

export default AppointmentCard;
