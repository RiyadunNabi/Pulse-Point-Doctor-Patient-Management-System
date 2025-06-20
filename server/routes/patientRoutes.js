const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

// GET all patients
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.patient_id, p.first_name, p.last_name, p.gender, p.phone_no,
             u.email
      FROM patient p
      JOIN "user" u ON p.user_id = u.user_id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching patients:", err);
    res.status(500).send("Error fetching patients");
  }
});

// POST new patient
router.post("/", async (req, res) => {
  const { user_id, first_name, last_name, gender, phone_no } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO patient (user_id, first_name, last_name, gender, phone_no)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, first_name, last_name, gender, phone_no]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding patient:", err);
    res.status(500).send("Error adding patient");
  }
});

module.exports = router;
