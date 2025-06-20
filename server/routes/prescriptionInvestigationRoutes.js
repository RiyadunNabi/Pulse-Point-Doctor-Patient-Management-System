const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

router.post("/", async (req, res) => {
  const { prescription_id, investigation_id, notes } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO prescription_investigation (prescription_id, investigation_id, notes)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [prescription_id, investigation_id, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error linking investigation:", err);
    res.status(500).send("Error linking investigation");
  }
});

router.get("/:prescriptionId", async (req, res) => {
  const { prescriptionId } = req.params;

  try {
    const result = await pool.query(
      `SELECT pi.*, i.name, i.description
       FROM prescription_investigation pi
       JOIN investigation i ON pi.investigation_id = i.investigation_id
       WHERE pi.prescription_id = $1`,
      [prescriptionId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching investigations:", err);
    res.status(500).send("Error fetching investigations");
  }
});

module.exports = router;
