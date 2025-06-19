const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

// ✅ GET all users (just for testing)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM \"user\"");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Error fetching users");
  }
});

// ✅ POST: Register a new user
router.post("/", async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO "user" (username, email, password, role) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [username, email, password, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).send("Error creating user");
  }
});

module.exports = router;
