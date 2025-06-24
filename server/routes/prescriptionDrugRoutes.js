const express = require("express");
const router = express.Router();
const {
    addDrugToPrescription,
    getDrugsByPrescription,
    updatePrescribedDrug,
    removeDrugFromPrescription,
} = require("../controllers/prescriptionDrugController");

// Add a new drug link to a prescription
router.route('/').post(addDrugToPrescription);

// Get all drugs for a given prescription
router.route('/prescription/:prescriptionId').get(getDrugsByPrescription);

// Update or remove a specific drug link from a prescription
router.route('/prescription/:prescriptionId/drug/:drugId')
    .patch(updatePrescribedDrug)
    .delete(removeDrugFromPrescription);

module.exports = router;