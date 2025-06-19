const express = require('express');
const router = express.Router();
const controller = require('../controllers/paymentController');

router.post('/', controller.createPayment);
router.get('/:appointmentId', controller.getPaymentByAppointment);
router.patch('/update-status', controller.updatePaymentStatus);

module.exports = router;
