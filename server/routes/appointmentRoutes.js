const express = require("express");
const router = express.Router();
const {
    createAppointment,
    getPatientHealthData,
    getAppointmentById,
    getAppointmentsByDoctor,
    getAppointmentsByPatient,
    getAppointmentsByDoctorAndStatus,
    getInvestigationReportAppointmentsByDoctor,
    getDoctorAppointmentStats,
    updateAppointment,
    // cancelAppointment
    deleteAppointment,
    getAppointmentStats,
    checkExistingAppointment,
} = require("../controllers/appointmentController");

router.route("/").post(createAppointment);
router.get('/patient-health-data/:patientId', getPatientHealthData);

router.route("/:id")
    .get(getAppointmentById)
    .patch(updateAppointment)
    .delete(deleteAppointment);

router
  .route('/doctor/:doctorId/stats')
  .get(getAppointmentStats);

router.route("/doctor/:doctorId").get(getAppointmentsByDoctor);
router.get('/doctor/:doctorId/stats',getDoctorAppointmentStats);

router.get(
  '/doctor/:doctorId/investigation-reports',
  getInvestigationReportAppointmentsByDoctor
);

//BEFORE the patient route
router.get('/doctor/:doctorId/status/:status', getAppointmentsByDoctorAndStatus);

router.route("/patient/:patientId").get(getAppointmentsByPatient);

router.get('/check-existing/:patientId/:doctorId', checkExistingAppointment);

module.exports = router;