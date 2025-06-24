const express = require("express");
const router = express.Router();
const {
  getSchedulesByDoctor,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} = require("../controllers/scheduleController");

// Route to create a new schedule entry
router.route("/")
  .post(createSchedule);

// Route to get all schedules for a specific doctor
router.route("/doctor/:doctorId")
  .get(getSchedulesByDoctor);

// Routes to update or delete a specific schedule entry by its own ID
router.route("/:id")
  .patch(updateSchedule)
  .delete(deleteSchedule);

module.exports = router;