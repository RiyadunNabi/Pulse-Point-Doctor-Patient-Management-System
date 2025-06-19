const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.post('/', reviewController.createReview);
router.get('/appointment/:id', reviewController.getReviewsByAppointment);

module.exports = router;
