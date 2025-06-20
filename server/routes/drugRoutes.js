const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

// Add a drug to master list
router.post("/", async (req, res) => {
  const { drug_name, dosage_form, strength, additional_notes } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO drug (drug_name, dosage_form, strength, additional_notes)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [drug_name, dosage_form, strength, additional_notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding drug:", err);
    res.status(500).send("Error adding drug");
  }
});

module.exports = router;
