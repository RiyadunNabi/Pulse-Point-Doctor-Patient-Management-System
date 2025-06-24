const express = require("express");
const router = express.Router();
const {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
} = require("../controllers/doctorController");

// Routes for /api/doctors
router.route("/")
  .get(getAllDoctors)
  .post(createDoctor);

// Routes for /api/doctors/:id
router.route("/:id")
  .get(getDoctorById)
  .patch(updateDoctor);
  // Note: We are intentionally not adding a DELETE route.

module.exports = router;