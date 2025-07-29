const express = require('express');
const router = express.Router();
const {
    createPayment,
    getAllPayments,
    getPaymentById,
    getPaymentByAppointment,
    // updatePayment,
    getPaymentCountsByDoctor,
    getAppointmentsByPaymentStatus,
    getRevenueStats,
    getRevenueChart,
} = require('../controllers/paymentController');

router.route('/')
    .get(getAllPayments)
    .post(createPayment);

router.route('/:id')
    .get(getPaymentById);
    // .patch(updatePayment);

router.route('/appointment/:appointmentId')
    .get(getPaymentByAppointment);

// Add these routes
router.route('/doctor/:doctorId/counts')
    .get(getPaymentCountsByDoctor);

router.route('/doctor/:doctorId/appointments/:paymentStatus')
    .get(getAppointmentsByPaymentStatus);

router.route('/doctor/:doctorId/revenue-stats')
    .get(getRevenueStats);

router.route('/doctor/:doctorId/revenue-chart')
    .get(getRevenueChart);

module.exports = router;