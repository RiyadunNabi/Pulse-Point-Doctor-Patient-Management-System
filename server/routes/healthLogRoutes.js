const express = require("express");
const router = express.Router();
const {
    createHealthLog,
    getHealthLogsByPatient,
    updateHealthLog,
    deleteHealthLog,
} = require("../controllers/healthLogController");

// Create a new health log
router.route("/").post(createHealthLog);

// Get all logs for a specific patient
router.route("/patient/:patientId").get(getHealthLogsByPatient);

// Update or delete a specific log entry by its own ID
router.route("/:id")
    .patch(updateHealthLog)
    .delete(deleteHealthLog);

module.exports = router;