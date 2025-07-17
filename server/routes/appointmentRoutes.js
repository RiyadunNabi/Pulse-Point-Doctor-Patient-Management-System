const express = require("express");
const router = express.Router();
const {
    createAppointment,
    getPatientHealthData,
    getAppointmentById,
    getAppointmentsByDoctor,
    getAppointmentsByPatient,
    getAppointmentsByDoctorAndStatus,
    getDoctorAppointmentStats,
    updateAppointment,
    cancelAppointment,
} = require("../controllers/appointmentController");

router.route("/").post(createAppointment);
router.get('/patient-health-data/:patientId', getPatientHealthData);

router.route("/:id")
    .get(getAppointmentById)
    .patch(updateAppointment)
    .delete(cancelAppointment);

router.route("/doctor/:doctorId").get(getAppointmentsByDoctor);
router.get('/doctor/:doctorId/stats',getDoctorAppointmentStats);

//BEFORE the patient route
router.get('/doctor/:doctorId/status/:status', getAppointmentsByDoctorAndStatus);

router.route("/patient/:patientId").get(getAppointmentsByPatient);

module.exports = router;