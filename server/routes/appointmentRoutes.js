const express = require("express");
const router = express.Router();
const {
    createAppointment,
    getAppointmentById,
    getAppointmentsByDoctor,
    getAppointmentsByPatient,
    getAppointmentsByDoctorAndStatus,
    updateAppointment,
    cancelAppointment,
} = require("../controllers/appointmentController");

router.route("/").post(createAppointment);

router.route("/:id")
    .get(getAppointmentById)
    .patch(updateAppointment)
    .delete(cancelAppointment);

router.route("/doctor/:doctorId").get(getAppointmentsByDoctor);

//BEFORE the patient route
router.get('/doctor/:doctorId/status/:status', getAppointmentsByDoctorAndStatus);

router.route("/patient/:patientId").get(getAppointmentsByPatient);

module.exports = router;