const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

// ✅ POST: Add prescription
router.post("/", async (req, res) => {
  const { appointment_id, diagnosis, other_drugs, instructions } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO prescription (appointment_id, diagnosis, other_drugs, instructions)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [appointment_id, diagnosis, other_drugs, instructions]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating prescription:", err);
    res.status(500).send("Error creating prescription");
  }
});

// ✅ GET: Get prescription by appointment
router.get("/:appointmentId", async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM prescription WHERE appointment_id = $1`,
      [appointmentId]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Prescription not found");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching prescription:", err);
    res.status(500).send("Error fetching prescription");
  }
});

module.exports = router;
