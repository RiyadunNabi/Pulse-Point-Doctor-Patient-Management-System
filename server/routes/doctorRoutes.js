const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

// GET all doctors
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.doctor_id, d.first_name, d.last_name, d.gender, d.phone_no,
             u.email, dep.department_name
      FROM doctor d
      JOIN "user" u ON d.user_id = u.user_id
      JOIN department dep ON d.department_id = dep.department_id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).send("Error fetching doctors");
  }
});

// POST new doctor
router.post("/", async (req, res) => {
  const { user_id, department_id, first_name, last_name, gender, phone_no } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO doctor (user_id, department_id, first_name, last_name, gender, phone_no)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_id, department_id, first_name, last_name, gender, phone_no]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding doctor:", err);
    res.status(500).send("Error adding doctor");
  }
});

module.exports = router;
