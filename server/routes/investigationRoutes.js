const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

// ✅ Add test to master list
router.post("/", async (req, res) => {
  const { name, description } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO investigation (name, description)
       VALUES ($1, $2) RETURNING *`,
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding investigation:", err);
    res.status(500).send("Error adding investigation");
  }
});

module.exports = router;
