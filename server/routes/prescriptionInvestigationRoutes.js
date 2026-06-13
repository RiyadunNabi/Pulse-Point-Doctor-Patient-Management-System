const express = require("express");
const router = express.Router();
const {
    addInvestigationToPrescription,
    getInvestigationsByPrescription,
    updateInvestigationNotes,
    removeInvestigationFromPrescription,
} = require("../controllers/prescriptionInvestigationController");

router.route('/').post(addInvestigationToPrescription);

router.route('/prescription/:prescriptionId').get(getInvestigationsByPrescription);

router.route('/prescription/:prescriptionId/investigation/:investigationId')
    .patch(updateInvestigationNotes)
    .delete(removeInvestigationFromPrescription);

module.exports = router;