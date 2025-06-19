const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

// GET all doctors
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM doctor");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).send("Error fetching doctors");
  }
});

module.exports = router;
