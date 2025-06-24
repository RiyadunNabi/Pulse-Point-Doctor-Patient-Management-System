const express = require("express");
const router = express.Router();
const { uploadMedicalDoc } = require('../middleware/upload');
const {
    createMedicalDocument,
    getDocumentsByPatient,
    updateMedicalDocument,
    downloadMedicalDocument,
    deleteMedicalDocument,
} = require("../controllers/medicalDocumentController");


router.route("/")
    .post(uploadMedicalDoc.single('medicalDoc'), createMedicalDocument);

router.route("/patient/:patientId")
    .get(getDocumentsByPatient);

router.route("/:id")
    .patch(updateMedicalDocument)
    .delete(deleteMedicalDocument);

router.route("/:id/download")
    .get(downloadMedicalDocument);

module.exports = router;