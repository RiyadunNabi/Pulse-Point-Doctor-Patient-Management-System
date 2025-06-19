const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

// ✅ GET all departments
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM department");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching departments:", err);
    res.status(500).send("Error fetching departments");
  }
});

// ✅ POST a new department
router.post("/", async (req, res) => {
  const { department_name, description } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO department (department_name, description) VALUES ($1, $2) RETURNING *",
      [department_name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding department:", err);
    res.status(500).send("Error adding department");
  }
});

module.exports = router;
