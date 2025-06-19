const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookmarkedDoctorController');

router.post('/', controller.addBookmarkedDoctor);
router.get('/:patientId', controller.getBookmarkedDoctors);
router.delete('/', controller.removeBookmarkedDoctor);

module.exports = router;
