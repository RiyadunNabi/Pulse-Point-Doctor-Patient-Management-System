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

router.route("/").post(createAppointment);

router.route("/:id")
    .get(getAppointmentById)
    .patch(updateAppointment)
    .delete(cancelAppointment);

router.route("/doctor/:doctorId").get(getAppointmentsByDoctor);

router.route("/patient/:patientId").get(getAppointmentsByPatient);

module.exports = router;