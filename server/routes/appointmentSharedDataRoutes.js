const router = require('express').Router();
const {
  getSharedHealthLog,
  getSharedDocuments
} = require('../controllers/appointmentHealthLogMedicalDocumentsController');

// Doctor-side endpoints
router.get('/appointments/:appointmentId/shared-health-log', getSharedHealthLog);
router.get('/appointments/:appointmentId/shared-documents',  getSharedDocuments);

module.exports = router;
