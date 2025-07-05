const express = require("express");
const router = express.Router();
const {
  getSchedulesByDoctor,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} = require("../controllers/scheduleController");

router.route("/")
  .post(createSchedule);

router.route("/doctor/:doctorId")
  .get(getSchedulesByDoctor);

router.route("/:id")
  .patch(updateSchedule)
  .delete(deleteSchedule);

module.exports = router;