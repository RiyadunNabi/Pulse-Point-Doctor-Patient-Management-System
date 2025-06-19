const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

// ✅ POST: Add report info (mock upload for now)
router.post("/", async (req, res) => {
  const { prescription_id, investigation_id, file_name, file_type, file_path, notes } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO investigation_report
       (prescription_id, investigation_id, file_name, file_type, file_path, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [prescription_id, investigation_id, file_name, file_type, file_path, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error saving investigation report:", err);
    res.status(500).send("Error saving investigation report");
  }
});

// ✅ GET: Reports for a prescription
router.get("/:prescriptionId", async (req, res) => {
  const { prescriptionId } = req.params;

  try {
    const result = await pool.query(
      `SELECT ir.*, i.name AS investigation_name
       FROM investigation_report ir
       JOIN investigation i ON ir.investigation_id = i.investigation_id
       WHERE ir.prescription_id = $1`,
      [prescriptionId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).send("Error fetching reports");
  }
});

module.exports = router;
