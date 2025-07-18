const express = require("express");
const router = express.Router();
const {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  getDepartmentsWithStats,
} = require("../controllers/doctorController");

// /api/doctors
router.route("/")
  .get(getAllDoctors)
  .post(createDoctor);

// /api/doctors/departments - Must be before /:id route
router.route("/departments")
  .get(getDepartmentsWithStats);

// /api/doctors/:id
router.route("/:id")
  .get(getDoctorById)
  .patch(updateDoctor);

module.exports = router;