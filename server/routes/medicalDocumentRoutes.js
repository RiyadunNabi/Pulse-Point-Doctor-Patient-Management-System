// const express = require("express");
// const router = express.Router();
// const { uploadMedicalDoc } = require('../middleware/upload');
// const {
//     createMedicalDocument,
//     getDocumentsByPatient,
//     updateMedicalDocument,
//     downloadMedicalDocument,
//     deleteMedicalDocument,
// } = require("../controllers/medicalDocumentController");


// router.route("/")
//     .post(uploadMedicalDoc.single('medicalDoc'), createMedicalDocument);

// router.route("/patient/:patientId")
//     .get(getDocumentsByPatient);

// router.route("/:id")
//     .patch(updateMedicalDocument)
//     .delete(deleteMedicalDocument);

// router.route("/:id/download")
//     .get(downloadMedicalDocument);

// router.get('/test', (req, res) => {
//     res.json({ 
//         message: 'Medical documents API is working!',
//         timestamp: new Date().toISOString(),
//         uploadDir: 'uploads/medical_documents'
//     });
// });

// module.exports = router;

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

// ✅ Test route FIRST (most specific)
router.get('/test', (req, res) => {
    res.json({ 
        message: 'Medical documents API is working!',
        timestamp: new Date().toISOString(),
        uploadDir: 'uploads/medical_documents'
    });
});

// ✅ Specific routes BEFORE parameterized routes
router.get('/patient/:patientId', getDocumentsByPatient);
router.get('/:id/download', downloadMedicalDocument);

// ✅ Root route for POST
router.post('/', uploadMedicalDoc.single('medicalDoc'), createMedicalDocument);

// ✅ Parameterized routes LAST (least specific)
router.patch('/:id', updateMedicalDocument);
router.delete('/:id', deleteMedicalDocument);

module.exports = router;
