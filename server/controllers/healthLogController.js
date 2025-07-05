const pool = require('../db/connection');

/**
 * @route   POST /api/health-logs
 */
const createHealthLog = async (req, res) => {
    const { patient_id, weight, systolic, diastolic, heart_rate, blood_sugar, sleep_hours, notes } = req.body;
    if (!patient_id) {
        return res.status(400).json({ error: 'patient_id is a required field.' });
    }
    try {
        const result = await pool.query(
            `INSERT INTO health_logs (patient_id, weight, systolic, diastolic, heart_rate, blood_sugar, sleep_hours, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [patient_id, weight, systolic, diastolic, heart_rate, blood_sugar, sleep_hours, notes]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error creating health log:", err);
        res.status(500).json({ error: "Failed to create health log" });
    }
};

/**
 * @route   GET /api/health-logs/patient/:patientId
 */
const getHealthLogsByPatient = async (req, res) => {
    const { patientId } = req.params;
    const { startDate, endDate } = req.query;
    try {
        let query = 'SELECT * FROM health_logs WHERE patient_id = $1';
        const queryParams = [patientId];
        
        // Add date range filtering if query params are provided
        if (startDate && endDate) {
            queryParams.push(startDate);
            query += ` AND created_at >= $${queryParams.length}`;
            queryParams.push(endDate);
            query += ` AND created_at <= $${queryParams.length}`;
        }
        
        query += ' ORDER BY created_at DESC';
        
        const result = await pool.query(query, queryParams);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching health logs:", err);
        res.status(500).json({ error: "Failed to fetch health logs" });
    }
};

/**
 * @route   PATCH /api/health-logs/:id
 */
const updateHealthLog = async (req, res) => {
    const { id } = req.params;
    const { weight, systolic, diastolic, heart_rate, blood_sugar, sleep_hours, notes } = req.body;
    try {
        const result = await pool.query(
            `UPDATE health_logs SET
             weight = COALESCE($1, weight), systolic = COALESCE($2, systolic),
             diastolic = COALESCE($3, diastolic), heart_rate = COALESCE($4, heart_rate),
             blood_sugar = COALESCE($5, blood_sugar), sleep_hours = COALESCE($6, sleep_hours),
             notes = COALESCE($7, notes), updated_at = CURRENT_TIMESTAMP
             WHERE log_id = $8 RETURNING *`,
            [weight, systolic, diastolic, heart_rate, blood_sugar, sleep_hours, notes, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Health log not found." });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error updating health log:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/**
 * @route   DELETE /api/health-logs/:id
 */
const deleteHealthLog = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM health_logs WHERE log_id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Health log not found." });
        }
        res.status(204).send();
    } catch (err) {
        console.error("Error deleting health log:", err);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    createHealthLog,
    getHealthLogsByPatient,
    updateHealthLog,
    deleteHealthLog,
};