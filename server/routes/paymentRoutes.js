const express = require('express');
const router = express.Router();
const {
    createPayment,
    getAllPayments,
    getPaymentById,
    getPaymentByAppointment,
    updatePayment,
} = require('../controllers/paymentController');

router.route('/')
    .get(getAllPayments)
    .post(createPayment);

router.route('/:id')
    .get(getPaymentById)
    .patch(updatePayment);

router.route('/appointment/:appointmentId')
    .get(getPaymentByAppointment);

module.exports = router;