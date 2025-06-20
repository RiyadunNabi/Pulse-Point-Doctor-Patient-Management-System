const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

// GET: All schedules for a doctor
router.get("/:doctorId", async (req, res) => {
  const doctorId = req.params.doctorId;

  try {
    const result = await pool.query(
      `SELECT weekday, start_time, end_time, max_per_hour, location
       FROM weekly_schedule
       WHERE doctor_id = $1
       ORDER BY weekday`,
      [doctorId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching schedule:", err);
    res.status(500).send("Error fetching schedule");
  }
});

// POST: Add schedule for a doctor
router.post("/", async (req, res) => {
  const { doctor_id, weekday, start_time, end_time, max_per_hour, location } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO weekly_schedule
       (doctor_id, weekday, start_time, end_time, max_per_hour, location)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [doctor_id, weekday, start_time, end_time, max_per_hour, location]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding schedule:", err);
    res.status(500).send("Error adding schedule");
  }
});

module.exports = router;
