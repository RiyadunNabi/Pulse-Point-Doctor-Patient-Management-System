const express = require("express");
const router = express.Router();
const {
    createAppointment,
    getAppointmentById,
    getAppointmentsByDoctor,
    getAppointmentsByPatient,
    updateAppointment,
    cancelAppointment,
} = require("../controllers/appointmentController");

// Create an appointment
router.route("/").post(createAppointment);

// Get, Update, or Cancel a specific appointment by its own ID
router.route("/:id")
    .get(getAppointmentById)
    .patch(updateAppointment)
    .delete(cancelAppointment);

// Get all appointments for a specific DOCTOR
router.route("/doctor/:doctorId").get(getAppointmentsByDoctor);

// Get all appointments for a specific PATIENT
router.route("/patient/:patientId").get(getAppointmentsByPatient);

module.exports = router;