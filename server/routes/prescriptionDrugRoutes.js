const express = require("express");
const router = express.Router();
const {
    addDrugToPrescription,
    getDrugsByPrescription,
    updatePrescribedDrug,
    removeDrugFromPrescription,
} = require("../controllers/prescriptionDrugController");

router.route('/').post(addDrugToPrescription);

router.route('/prescription/:prescriptionId').get(getDrugsByPrescription);

router.route('/prescription/:prescriptionId/drug/:drugId')
    .patch(updatePrescribedDrug)
    .delete(removeDrugFromPrescription);

module.exports = router;