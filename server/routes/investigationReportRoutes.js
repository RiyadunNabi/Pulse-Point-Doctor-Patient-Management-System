const express = require("express");
const router = express.Router();
const { uploadReport } = require("../middleware/upload");
const {
    createInvestigationReport,
    getReportsByPrescription,
    downloadInvestigationReport,
    deleteInvestigationReport,
} = require("../controllers/investigationReportController");

router.post("/", uploadReport.single('reportFile'), createInvestigationReport);

router.get("/prescription/:prescriptionId", getReportsByPrescription);

router.get("/:id/download", downloadInvestigationReport);

router.delete("/:id", deleteInvestigationReport);

module.exports = router;