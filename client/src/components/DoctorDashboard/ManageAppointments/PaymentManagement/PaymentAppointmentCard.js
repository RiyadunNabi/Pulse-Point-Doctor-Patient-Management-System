import React from 'react';
import {
    Calendar,
    Clock,
    User,
    Phone,
    Mail,
    DollarSign,
    CreditCard,
    Building2,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';

// Helper functions
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

const PaymentAppointmentCard = ({ appointment, paymentInfo }) => {
    // Get payment status badge
    const getPaymentStatusBadge = (status, amount) => {
        const statusConfig = {
            paid: { 
                color: 'bg-green-50 text-green-700 border-green-200', 
                label: 'Paid', 
                icon: <CheckCircle className="w-3 h-3" />,
                bgGradient: 'from-green-50 to-emerald-50 border-green-200'
            },
            // pending: { 
            //     color: 'bg-amber-50 text-amber-700 border-amber-200', 
            //     label: 'Pending', 
            //     icon: <AlertCircle className="w-3 h-3" />,
            //     bgGradient: 'from-amber-50 to-yellow-50 border-amber-200'
            // },
            // failed: { 
            //     color: 'bg-red-50 text-red-700 border-red-200', 
            //     label: 'Failed', 
            //     icon: <XCircle className="w-3 h-3" />,
            //     bgGradient: 'from-red-50 to-rose-50 border-red-200'
            // },
            unpaid: { 
                color: 'bg-slate-50 text-slate-700 border-slate-200', 
                label: 'Unpaid', 
                icon: <XCircle className="w-3 h-3" />,
                bgGradient: 'from-slate-50 to-gray-50 border-slate-200'
            }
        };

        const config = statusConfig[status] || statusConfig.unpaid;
        return { config, amount };
    };

    const paymentStatus = paymentInfo?.payment_status || 'unpaid';
    const paymentAmount = paymentInfo?.amount || 0;
    const { config: paymentConfig } = getPaymentStatusBadge(paymentStatus, paymentAmount);

    return (
        <div className={`bg-gradient-to-br ${paymentConfig.bgGradient} rounded-xl border p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm`}>
            {/* Header with Patient Info and Payment Status */}
            <div className="flex justify-between items-start mb-4">
                {/* Patient Info */}
                <div className="flex items-center space-x-3 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full flex items-center justify-center shadow-md">
                        <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 flex items-center">
                            {appointment.patient_first_name} {appointment.patient_last_name}
                        </h3>
                        <p className="text-sm text-slate-600 flex items-center mt-0.5">
                            <Building2 className="w-3 h-3 mr-1" />
                            Patient ID: {appointment.patient_id}
                        </p>
                    </div>
                </div>

                {/* Payment Status Badge */}
                <div className="text-right">
                    <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold border ${paymentConfig.color} shadow-sm`}>
                        {paymentConfig.icon}
                        <span className="ml-2">{paymentConfig.label}</span>
                    </span>
                    {paymentAmount > 0 && (
                        <p className="text-lg font-bold text-slate-800 mt-2 flex items-center justify-end">
                            <DollarSign className="w-4 h-4 mr-1" />
                            ${paymentAmount}
                        </p>
                    )}
                </div>
            </div>

            {/* Appointment Details */}
            <div className="space-y-3 mb-4">
                {/* Date and Time */}
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-slate-700 bg-white/70 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">{formatDate(appointment.appointment_date)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-700 bg-white/70 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
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

            {/* Contact Information */}
            <div className="flex items-center space-x-4 text-sm text-slate-600 mb-4">
                <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
                    <Phone className="w-4 h-4 text-indigo-500" />
                    <span className="font-medium">{appointment.patient_phone || 'No phone'}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
                    <Mail className="w-4 h-4 text-cyan-500" />
                    <span className="font-medium">{appointment.patient_email || 'No email'}</span>
                </div>
            </div>

            {/* Payment Details */}
            {paymentInfo && (
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/40 shadow-sm">
                    <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center">
                        <CreditCard className="w-4 h-4 mr-2 text-orange-600" />
                        Payment Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between">
                            <span className="font-medium text-slate-700">Method:</span>
                            <span className="text-slate-600 capitalize">{paymentInfo.payment_method || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-slate-700">Transaction ID:</span>
                            <span className="text-slate-600 font-mono text-xs">{paymentInfo.transaction_id || 'N/A'}</span>
                        </div>
                        {paymentInfo.paid_time && (
                            <div className="flex justify-between md:col-span-2">
                                <span className="font-medium text-slate-700">Paid On:</span>
                                <span className="text-slate-600">{formatDate(paymentInfo.paid_time)}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentAppointmentCard;
