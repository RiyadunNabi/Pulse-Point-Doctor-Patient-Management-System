const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.post('/', reviewController.createReview);

router.get('/doctor/:doctorId', reviewController.getReviewsByDoctor);

router.route('/:id')
    .patch(reviewController.updateReview)
    .delete(reviewController.deleteReview);

module.exports = router;