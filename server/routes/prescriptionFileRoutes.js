const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

router.post("/", async (req, res) => {
  const { prescription_id, file_name, file_type, file_path } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO prescription_file
       (prescription_id, file_name, file_type, filepath)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [prescription_id, file_name, file_type, file_path]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error saving prescription file:", err);
    res.status(500).send("Error saving prescription file");
  }
});

router.get("/:prescriptionId", async (req, res) => {
  const { prescriptionId } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM prescription_file WHERE prescription_id = $1`,
      [prescriptionId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching prescription files:", err);
    res.status(500).send("Error fetching prescription files");
  }
});

module.exports = router;
