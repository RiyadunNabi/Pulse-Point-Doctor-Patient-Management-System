const express = require("express");
const router = express.Router();

const {
  getAllDepartments,
  getDepartmentsWithStats,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");

// /api/departments
router.route("/")
  .get(getAllDepartments)
  .post(createDepartment);

router.route("/stats")
 .get(getDepartmentsWithStats);

// /api/departments/:id
router.route("/:id")
  .patch(updateDepartment)
  .delete(deleteDepartment);

module.exports = router;