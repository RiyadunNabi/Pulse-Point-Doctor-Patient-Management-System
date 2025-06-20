const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

// GET: All appointments for a doctor
router.get("/:doctorId", async (req, res) => {
  const doctorId = req.params.doctorId;

  try {
    const result = await pool.query(
      `SELECT a.appointment_id, a.appointment_date, a.appointment_time,
              a.status, u.email AS patient_email
       FROM appointment a
       JOIN patient p ON a.patient_id = p.patient_id
       JOIN "user" u ON p.user_id = u.user_id
       WHERE a.doctor_id = $1
       ORDER BY a.appointment_date, a.appointment_time`,
      [doctorId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).send("Error fetching appointments");
  }
});

// PATCH: Update appointment status
router.patch("/:appointmentId/status", async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body;

  const allowedStatuses = ["pending", "confirmed", "completed", "cancelled"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).send("Invalid status value");
  }

  try {
    const result = await pool.query(
      `UPDATE appointment
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE appointment_id = $2
       RETURNING *`,
      [status, appointmentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Appointment not found");
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating appointment status:", err);
    res.status(500).send("Error updating appointment status");
  }
});


// POST: Book an appointment
router.post("/", async (req, res) => {
  const { doctor_id, patient_id, appointment_date, appointment_time, reason } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO appointment
       (doctor_id, patient_id, appointment_date, appointment_time, reason)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [doctor_id, patient_id, appointment_date, appointment_time, reason]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error booking appointment:", err);
    res.status(500).send("Error booking appointment");
  }
});

module.exports = router;
