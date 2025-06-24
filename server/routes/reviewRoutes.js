const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Create a new review
router.post('/', reviewController.createReview);

// Get all reviews for a specific doctor
router.get('/doctor/:doctorId', reviewController.getReviewsByDoctor);

router.route('/:id')
    .patch(reviewController.updateReview)
    .delete(reviewController.deleteReview);

module.exports = router;