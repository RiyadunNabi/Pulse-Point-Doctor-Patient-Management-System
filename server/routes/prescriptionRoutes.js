const express = require("express");
const router = express.Router();
const {
    createPrescription,
    getPrescriptionByAppointmentId,
    updatePrescription,
} = require("../controllers/prescriptionController");

// Create a new prescription
router.route("/").post(createPrescription);

// Get a full prescription by its associated appointment ID
router.route("/appointment/:appointmentId").get(getPrescriptionByAppointmentId);

// Update a prescription's main details by its own ID
router.route("/:id").patch(updatePrescription);

module.exports = router;