const express = require("express");
const router = express.Router();

const { uploadPrescriptionFile } = require("../middleware/upload"); 

const {
    createPrescriptionFile,
    getFilesByPrescription,
    downloadPrescriptionFile,
    deletePrescriptionFile,
} = require("../controllers/prescriptionFileController");

router.post("/", uploadPrescriptionFile.single('prescriptionFile'), createPrescriptionFile);

router.get("/prescription/:prescriptionId", getFilesByPrescription);

router.get("/:id/download", downloadPrescriptionFile);

router.delete("/:id", deletePrescriptionFile);

module.exports = router;