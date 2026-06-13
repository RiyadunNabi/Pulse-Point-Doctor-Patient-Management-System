const express = require('express');
const router = express.Router();
const {
    addBookmarkedDoctor,
    getBookmarkedDoctors,
    removeBookmarkedDoctor,
} = require('../controllers/bookmarkedDoctorController');

router.post('/', addBookmarkedDoctor);

router.get('/:patientId', getBookmarkedDoctors);

router.delete('/:patientId/:doctorId', removeBookmarkedDoctor);

module.exports = router;