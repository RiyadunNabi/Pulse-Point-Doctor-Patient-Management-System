const express = require("express");
const router = express.Router();
const {
    createPrescription,
    getPrescriptionByAppointmentId,
    updatePrescription,
} = require("../controllers/prescriptionController");

router.route("/").post(createPrescription);

router.route("/appointment/:appointmentId").get(getPrescriptionByAppointmentId);

router.route("/:id").patch(updatePrescription);

module.exports = router;