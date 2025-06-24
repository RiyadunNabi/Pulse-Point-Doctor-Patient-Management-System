const express = require("express");
const router = express.Router();
const {
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");

// Routes for /api/departments
router.route("/")
  .get(getAllDepartments)
  .post(createDepartment);

// Routes for /api/departments/:id
router.route("/:id")
  .patch(updateDepartment)
  .delete(deleteDepartment);

module.exports = router;