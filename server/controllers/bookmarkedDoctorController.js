const pool = require('../db/connection');

// Add to preferred list
exports.addBookmarkedDoctor = async (req, res) => {
  const { patient_id, doctor_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO bookmarked_doctors (patient_id, doctor_id)
       VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *`,
      [patient_id, doctor_id]
    );
    res.status(201).json(result.rows[0] || { message: "Already preferred" });
  } catch (err) {
    console.error("Add preferred doctor error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all preferred doctors for a patient
exports.getBookmarkedDoctors = async (req, res) => {
  const { patientId } = req.params;
  try {
    const result = await pool.query(
      `SELECT pd.*, d.first_name, d.last_name
       FROM bookmarked_doctors pd
       JOIN doctor d ON pd.doctor_id = d.doctor_id
       WHERE pd.patient_id = $1`,
      [patientId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Fetch preferred doctors error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Remove a preferred doctor
exports.removeBookmarkedDoctor = async (req, res) => {
  const { patient_id, doctor_id } = req.body;
  try {
    await pool.query(
      `DELETE FROM bookmarked_doctors WHERE patient_id = $1 AND doctor_id = $2`,
      [patient_id, doctor_id]
    );
    res.status(200).json({ message: "Removed from preferred list" });
  } catch (err) {
    console.error("Remove preferred doctor error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
