const express = require("express");
const router = express.Router();

const { uploadPrescriptionFile } = require("../middleware/upload"); 

const {
    // createPrescriptionFile,
    createPrescriptionFiles,
    getFilesByPrescription,
    downloadPrescriptionFile,
    deletePrescriptionFile,
} = require("../controllers/prescriptionFileController");

// router.post("/", uploadPrescriptionFile.single('prescriptionFile'), createPrescriptionFile);
// Updated to handle multiple files
router.post("/", uploadPrescriptionFile.array('prescriptionFiles', 10), createPrescriptionFiles);

router.get("/prescription/:prescriptionId", getFilesByPrescription);

router.get("/:id/download", downloadPrescriptionFile);

router.delete("/:id", deletePrescriptionFile);

module.exports = router;