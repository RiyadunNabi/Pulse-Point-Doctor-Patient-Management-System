import React, { useState, useEffect } from 'react';
import { 
    CreditCard, 
    User, 
    Stethoscope, 
    DollarSign, 
    Building2,
    CheckCircle,
    Clock,
    AlertCircle
} from 'lucide-react';
import axios from 'axios';
import Modal from '../../../../shared/Modal';

const PaymentModal = ({ isOpen, onClose, appointment, onPaymentSubmitted }) => {
    const [doctorInfo, setDoctorInfo] = useState(null);
    const [currentPayment, setCurrentPayment] = useState(null);
    const [paymentData, setPaymentData] = useState({
        payment_method: '',
        transaction_id: '',
        amount: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Fetch doctor and payment info when modal opens
    useEffect(() => {
        if (isOpen && appointment?.appointment_id) {
            fetchDoctorInfo();
            fetchCurrentPayment();
        }
    }, [isOpen, appointment]);

    const fetchDoctorInfo = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/doctors/${appointment.doctor_id}`);
            setDoctorInfo(response.data);
            
            // Set the consultation fee as default amount
            setPaymentData(prev => ({
                ...prev,
                amount: response.data.consultation_fee || ''
            }));
        } catch (error) {
            console.error('Error fetching doctor info:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCurrentPayment = async () => {
        try {
            const response = await axios.get(`/api/payments/appointment/${appointment.appointment_id}`);
            if (response.data && response.data.length > 0) {
                setCurrentPayment(response.data[0]);
            }
        } catch (error) {
            console.error('Error fetching current payment:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPaymentData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitPayment = async (e) => {
        e.preventDefault();
        
        if (!paymentData.payment_method || !paymentData.transaction_id || !paymentData.amount) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            setSubmitting(true);
            
            if (currentPayment) {
                // Update existing payment
                await axios.patch(`/api/payments/${currentPayment.payment_id}`, {
                    payment_status: 'success',
                    transaction_id: paymentData.transaction_id,
                    paid_time: new Date().toISOString()
                });
            } else {
                // Create new payment
                await axios.post('/api/payments', {
                    appointment_id: appointment.appointment_id,
                    amount: parseFloat(paymentData.amount),
                    payment_method: paymentData.payment_method,
                    transaction_id: paymentData.transaction_id
                });
            }
            
            alert('Payment submitted successfully!');
            if (onPaymentSubmitted) onPaymentSubmitted();
            onClose();
        } catch (error) {
            console.error('Error submitting payment:', error);
            if (error.response?.status === 409) {
                alert('A payment record for this appointment already exists.');
            } else {
                alert('Failed to submit payment. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const getPaymentStatusIcon = (status) => {
        switch (status) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'pending':
                return <Clock className="w-5 h-5 text-amber-600" />;
            case 'failed':
                return <AlertCircle className="w-5 h-5 text-red-600" />;
            default:
                return <CreditCard className="w-5 h-5 text-gray-600" />;
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Make Payment"
            subtitle="Complete your appointment payment securely"
            size="lg"
        >
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mr-3"></div>
                    <span className="text-slate-600">Loading payment details...</span>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Doctor Info Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-6 shadow-sm">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                                <Stethoscope className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-slate-800">
                                    Dr. {appointment.first_name} {appointment.last_name}
                                </h3>
                                <p className="text-sm text-slate-600 mb-2 flex items-center">
                                    <Building2 className="w-4 h-4 mr-1" />
                                    {appointment.department_name}
                                </p>
                                <div className="flex items-center space-x-2">
                                    <DollarSign className="w-5 h-5 text-green-600" />
                                    <span className="text-lg font-bold text-green-700">
                                        ${doctorInfo?.consultation_fee || 'N/A'} 
                                    </span>
                                    <span className="text-sm text-slate-600">consultation fee</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Current Payment Status */}
                    {currentPayment && (
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6 shadow-sm">
                            <h4 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                                {getPaymentStatusIcon(currentPayment.payment_status)}
                                <span className="ml-2">Current Payment Status</span>
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-slate-600">Status:</span>
                                    <span className={`ml-2 font-medium capitalize ${
                                        currentPayment.payment_status === 'success' ? 'text-green-700' :
                                        currentPayment.payment_status === 'pending' ? 'text-amber-700' :
                                        'text-red-700'
                                    }`}>
                                        {currentPayment.payment_status}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-slate-600">Amount:</span>
                                    <span className="ml-2 font-medium text-slate-700">
                                        ${currentPayment.amount}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-slate-600">Method:</span>
                                    <span className="ml-2 font-medium text-slate-700">
                                        {currentPayment.payment_method}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-slate-600">Transaction ID:</span>
                                    <span className="ml-2 font-medium text-slate-700">
                                        {currentPayment.transaction_id}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Payment Form */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-slate-800 flex items-center">
                                <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                                {currentPayment ? 'Update Payment' : 'Payment Details'}
                            </h4>
                        </div>

                        <form onSubmit={handleSubmitPayment} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Payment Method */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Payment Method *
                                    </label>
                                    <select
                                        name="payment_method"
                                        value={paymentData.payment_method}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                    >
                                        <option value="">Select Payment Method</option>
                                        <option value="credit_card">Credit Card</option>
                                        <option value="debit_card">Debit Card</option>
                                        <option value="bank_transfer">Bank Transfer</option>
                                        <option value="digital_wallet">Digital Wallet</option>
                                        <option value="cash">Cash</option>
                                    </select>
                                </div>

                                {/* Amount */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Amount *
                                    </label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={paymentData.amount}
                                        onChange={handleInputChange}
                                        placeholder="Enter amount"
                                        step="0.01"
                                        min="0"
                                        required
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                    />
                                </div>
                            </div>

                            {/* Transaction ID */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Transaction ID *
                                </label>
                                <input
                                    type="text"
                                    name="transaction_id"
                                    value={paymentData.transaction_id}
                                    onChange={handleInputChange}
                                    placeholder="Enter transaction ID from your payment"
                                    required
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-2.5 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                                >
                                    {submitting ? 'Processing...' : currentPayment ? 'Update Payment' : 'Submit Payment'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Payment Instructions */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6 shadow-sm">
                        <h4 className="text-lg font-semibold text-slate-700 mb-3">Payment Instructions</h4>
                        <div className="space-y-2 text-sm text-slate-600">
                            <div className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                                <span>Complete your payment using your preferred method</span>
                            </div>
                            <div className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                                <span>Enter the transaction ID provided by your payment service</span>
                            </div>
                            <div className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                                <span>Your payment will be verified and status updated accordingly</span>
                            </div>
                            <div className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                                <span>Contact support if you face any issues with payment processing</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default PaymentModal;
