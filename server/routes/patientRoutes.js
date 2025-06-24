const express = require("express");
const router = express.Router();
const {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
} = require("../controllers/patientController");

// Routes for /api/patients
router.route("/")
  .get(getAllPatients)
  .post(createPatient);

// Routes for /api/patients/:id
router.route("/:id")
  .get(getPatientById)
  .patch(updatePatient);
// Note: We are intentionally not adding a DELETE route for the same reasons as the doctor resource.

module.exports = router;