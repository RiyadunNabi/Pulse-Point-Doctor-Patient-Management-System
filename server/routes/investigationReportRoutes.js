const express = require("express");
const router = express.Router();
// Import the specific upload middleware
const { uploadReport } = require("../middleware/upload");
const {
    createInvestigationReport,
    getReportsByPrescription,
    downloadInvestigationReport,
    deleteInvestigationReport,
} = require("../controllers/investigationReportController");

// Use the 'uploadReport' middleware for this POST route
router.post("/", uploadReport.single('reportFile'), createInvestigationReport);

router.get("/prescription/:prescriptionId", getReportsByPrescription);

router.get("/:id/download", downloadInvestigationReport);

router.delete("/:id", deleteInvestigationReport);

module.exports = router;