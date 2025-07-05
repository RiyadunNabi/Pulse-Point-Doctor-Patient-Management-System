const express = require("express");
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
} = require("../controllers/patientController");

router.route("/")
  .get(authenticateToken, getAllPatients)
  .post(authenticateToken, createPatient);

router.route("/:id")
  .get(authenticateToken, getPatientById)
  .patch(authenticateToken, updatePatient);

module.exports = router;