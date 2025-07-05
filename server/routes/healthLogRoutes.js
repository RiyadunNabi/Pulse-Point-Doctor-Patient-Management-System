const express = require("express");
const router = express.Router();
const {
    createHealthLog,
    getHealthLogsByPatient,
    updateHealthLog,
    deleteHealthLog,
} = require("../controllers/healthLogController");

router.route("/").post(createHealthLog);

router.route("/patient/:patientId").get(getHealthLogsByPatient);

router.route("/:id")
    .patch(updateHealthLog)
    .delete(deleteHealthLog);

module.exports = router;