const express = require("express");
const router = express.Router();
const {
    addInvestigationToPrescription,
    getInvestigationsByPrescription,
    updateInvestigationNotes,
    removeInvestigationFromPrescription,
} = require("../controllers/prescriptionInvestigationController");

// Add a new investigation link to a prescription
router.route('/').post(addInvestigationToPrescription);

// Get all investigations for a given prescription
router.route('/prescription/:prescriptionId').get(getInvestigationsByPrescription);

// Update or remove a specific investigation link from a prescription
router.route('/prescription/:prescriptionId/investigation/:investigationId')
    .patch(updateInvestigationNotes)
    .delete(removeInvestigationFromPrescription);

module.exports = router;