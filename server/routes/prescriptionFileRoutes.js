const express = require("express");
const router = express.Router();

// Destructure to get the specific middleware needed for this file type
const { uploadPrescriptionFile } = require("../middleware/upload"); 

const {
    createPrescriptionFile,
    getFilesByPrescription,
    downloadPrescriptionFile,
    deletePrescriptionFile,
} = require("../controllers/prescriptionFileController");


// Use the correct middleware variable here
router.post("/", uploadPrescriptionFile.single('prescriptionFile'), createPrescriptionFile);

// Get all file records for a prescription
router.get("/prescription/:prescriptionId", getFilesByPrescription);

// Download a specific file by its file_id
router.get("/:id/download", downloadPrescriptionFile);

// Delete a file and its record by its file_id
router.delete("/:id", deletePrescriptionFile);

module.exports = router;