const pool = require("../db/connection");

exports.createHealthLog = async (req, res) => {
  const { patient_id, weight, systolic, diastolic, heart_rate, blood_sugar, sleep_hours, notes } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO health_logs 
       (patient_id, weight, systolic, diastolic, heart_rate, blood_sugar, sleep_hours, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [patient_id, weight, systolic, diastolic, heart_rate, blood_sugar, sleep_hours, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating health log:", err);
    res.status(500).json({ error: "Failed to create health log" });
  }
};

exports.getHealthLogsByPatient = async (req, res) => {
  const { patient_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM health_logs WHERE patient_id = $1 ORDER BY created_at DESC`,
      [patient_id]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching health logs:", err);
    res.status(500).json({ error: "Failed to fetch health logs" });
  }
};
