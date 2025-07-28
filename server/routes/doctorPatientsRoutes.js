const express = require('express');
const router = express.Router();
const {
    getDoctorPatientsWithStats,
    getDoctorDailyAnalytics,
    getDoctorMonthlyAnalytics,
    getPatientDetails
} = require('../controllers/doctorPatientsController');

// @route   GET /api/doctor-patients/doctor/:doctorId
// @desc    Get all patients for a specific doctor with stats
router.get('/doctor/:doctorId', getDoctorPatientsWithStats);

// @route   GET /api/doctor-patients/doctor/:doctorId/daily-analytics
// @desc    Get daily appointment analytics
router.get('/doctor/:doctorId/daily-analytics', getDoctorDailyAnalytics);

// @route   GET /api/doctor-patients/doctor/:doctorId/monthly-analytics
// @desc    Get monthly appointment analytics
router.get('/doctor/:doctorId/monthly-analytics', getDoctorMonthlyAnalytics);

// @route   GET /api/doctor-patients/patient/:patientId
// @desc    Get detailed patient information
router.get('/patient/:patientId', getPatientDetails);

module.exports = router;
