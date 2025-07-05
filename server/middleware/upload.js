const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- Medical Document Storage ---
const medicalDocUploadDir = path.join(__dirname, '..', 'uploads', 'medical_documents');
if (!fs.existsSync(medicalDocUploadDir)) {
    fs.mkdirSync(medicalDocUploadDir, { recursive: true });
}
const medicalDocStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, medicalDocUploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, 'med-doc-' + Date.now() + path.extname(file.originalname));
    }
});

// --- Investigation Report Storage ---
const reportUploadDir = path.join(__dirname, '..', 'uploads', 'investigation_reports');
if (!fs.existsSync(reportUploadDir)) {
    fs.mkdirSync(reportUploadDir, { recursive: true });
}
const investigationReportStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, reportUploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, 'report-' + Date.now() + path.extname(file.originalname));
    }
});

// --- Prescription File Storage ---
const prescriptionUploadDir = path.join(__dirname, '..', 'uploads', 'prescription_files');
if (!fs.existsSync(prescriptionUploadDir)) {
    fs.mkdirSync(prescriptionUploadDir, { recursive: true });
}
const prescriptionStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, prescriptionUploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, 'file-' + Date.now() + path.extname(file.originalname));
    }
});

// --- Article Image Storage ---
const articleImageUploadDir = path.join(__dirname, '..', 'uploads', 'article_images');
if (!fs.existsSync(articleImageUploadDir)) {
    fs.mkdirSync(articleImageUploadDir, { recursive: true });
}
const articleImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, articleImageUploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, 'article-' + Date.now() + path.extname(file.originalname));
    }
});

module.exports = {
    uploadMedicalDoc: multer({ storage: medicalDocStorage }),
    uploadPrescriptionFile: multer({ storage: prescriptionStorage }),
    uploadReport: multer({ storage: investigationReportStorage }),
    uploadArticleImage: multer({ storage: articleImageStorage }),
};