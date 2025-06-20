const express = require("express");
const router = express.Router();
const healthLogController = require("../controllers/healthLogController");

router.post("/", healthLogController.createHealthLog);
router.get("/:patient_id", healthLogController.getHealthLogsByPatient);

module.exports = router;
