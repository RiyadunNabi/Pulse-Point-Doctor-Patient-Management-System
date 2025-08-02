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
    getStaticRevenueStats,
    getDoctorRangeBasedRevenue,
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

router.get(
    '/doctor/:doctorId/static-stats',
    getStaticRevenueStats
);

router.get(
    '/doctor/:doctorId/revenue-chart', 
    getDoctorRangeBasedRevenue
);

module.exports = router;