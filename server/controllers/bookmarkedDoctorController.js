const pool = require('../db/connection');

/**
 * @desc    Add a doctor to a patient's bookmarked list
 * @route   POST /api/bookmarked-doctors
 */
const addBookmarkedDoctor = async (req, res) => {
    const { patient_id, doctor_id } = req.body;
    if (!patient_id || !doctor_id) {
        return res.status(400).json({ error: 'patient_id and doctor_id are required.' });
    }
    try {
        const result = await pool.query(
            `INSERT INTO bookmarked_doctors (patient_id, doctor_id)
             VALUES ($1, $2) ON CONFLICT (patient_id, doctor_id) DO NOTHING RETURNING *`,
            [patient_id, doctor_id]
        );

        if (result.rows.length === 0) {
            return res.status(200).json({ message: "Doctor is already bookmarked." });
        }
        
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Add bookmarked doctor error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/**
 * @desc    Get all bookmarked doctors for a specific patient
 * @route   GET /api/bookmarked-doctors/:patientId
 */
const getBookmarkedDoctors = async (req, res) => {
    const { patientId } = req.params;
    try {
        // Join with department table to provide more useful info
        const result = await pool.query(
            `SELECT b.id, b.doctor_id, d.first_name, d.last_name, dep.department_name
             FROM bookmarked_doctors b
             JOIN doctor d ON b.doctor_id = d.doctor_id
             JOIN department dep ON d.department_id = dep.department_id
             WHERE b.patient_id = $1`,
            [patientId]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Fetch bookmarked doctors error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/**
 * @desc    Remove a doctor from a patient's bookmarked list
 * @route   DELETE /api/bookmarked-doctors/:patientId/:doctorId
 */
const removeBookmarkedDoctor = async (req, res) => {
    const { patientId, doctorId } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM bookmarked_doctors WHERE patient_id = $1 AND doctor_id = $2 RETURNING *',
            [patientId, doctorId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Bookmark not found.' });
        }

        res.status(204).send();
    } catch (err) {
        console.error("Remove bookmarked doctor error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    addBookmarkedDoctor,
    getBookmarkedDoctors,
    removeBookmarkedDoctor,
};