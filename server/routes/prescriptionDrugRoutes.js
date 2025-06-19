const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

// ✅ Add drug to a prescription
router.post("/", async (req, res) => {
  const { prescription_id, drug_id, dosages, frequency_per_day, duration, additional_notes } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO prescription_drug
       (prescription_id, drug_id, dosages, frequency_per_day, duration, additional_notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [prescription_id, drug_id, dosages, frequency_per_day, duration, additional_notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error linking drug to prescription:", err);
    res.status(500).send("Error linking drug to prescription");
  }
});

// ✅ Get drugs for a prescription
router.get("/:prescriptionId", async (req, res) => {
  const { prescriptionId } = req.params;

  try {
    const result = await pool.query(
      `SELECT pd.*, d.drug_name, d.strength
       FROM prescription_drug pd
       JOIN drug d ON pd.drug_id = d.drug_id
       WHERE pd.prescription_id = $1`,
      [prescriptionId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching prescription drugs:", err);
    res.status(500).send("Error fetching prescription drugs");
  }
});

module.exports = router;
