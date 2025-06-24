const express = require('express');
const router = express.Router();
const {
    createPayment,
    getAllPayments,
    getPaymentById,
    getPaymentByAppointment,
    updatePayment,
} = require('../controllers/paymentController');

// Get all payments or create a new payment
router.route('/')
    .get(getAllPayments)
    .post(createPayment);

// Get or update a specific payment by its ID
router.route('/:id')
    .get(getPaymentById)
    .patch(updatePayment);

// Get payment details for a specific appointment
router.route('/appointment/:appointmentId')
    .get(getPaymentByAppointment);

// Note: A DELETE route is intentionally omitted for financial records.

module.exports = router;