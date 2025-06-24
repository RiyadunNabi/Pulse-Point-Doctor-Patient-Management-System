const express = require('express');
const router = express.Router();
const {
    addBookmarkedDoctor,
    getBookmarkedDoctors,
    removeBookmarkedDoctor,
} = require('../controllers/bookmarkedDoctorController');

// Add a new bookmark
router.post('/', addBookmarkedDoctor);

// Get all bookmarks for a patient
router.get('/:patientId', getBookmarkedDoctors);

// Remove a specific bookmark
router.delete('/:patientId/:doctorId', removeBookmarkedDoctor);

module.exports = router;