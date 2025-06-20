const express = require("express");
const router = express.Router();
const medicalDocumentController = require("../controllers/medicalDocumentController");

router.post("/", medicalDocumentController.createMedicalDocument);
router.get("/:patient_id", medicalDocumentController.getDocumentsByPatient);
router.delete("/:document_id", medicalDocumentController.deleteMedicalDocument);
router.patch("/:document_id", medicalDocumentController.updateMedicalDocument);

module.exports = router;
