const pool = require('../db/connection');

// @desc    Get all schedule entries for a specific doctor
// @route   GET /api/schedule/doctor/:doctorId
const getSchedulesByDoctor = async (req, res) => {
    const { doctorId } = req.params;
    try {
        const result = await pool.query(
            `SELECT id, weekday, start_time, end_time, max_per_hour, location
       FROM weekly_schedule
       WHERE doctor_id = $1
       ORDER BY weekday, start_time`,
            [doctorId]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching schedule:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Add a new schedule entry for a doctor
// @route   POST /api/schedule
const createSchedule = async (req, res) => {
    const { doctor_id, weekday, start_time, end_time, max_per_hour, location } = req.body;

    if (doctor_id === undefined || weekday === undefined || !start_time || !end_time) {
        return res.status(400).json({ error: "doctor_id, weekday, start_time, and end_time are required fields." });
    }

    try {
        const result = await pool.query(
            `INSERT INTO weekly_schedule (doctor_id, weekday, start_time, end_time, max_per_hour, location)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
            [doctor_id, weekday, start_time, end_time, max_per_hour, location]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error adding schedule:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Update a specific schedule entry by its own ID
// @route   PATCH /api/schedule/:id
const updateSchedule = async (req, res) => {
    const { id } = req.params;
    const { weekday, start_time, end_time, max_per_hour, location } = req.body;

    try {
        const query = `
      UPDATE weekly_schedule SET
        weekday = COALESCE($1, weekday),
        start_time = COALESCE($2, start_time),
        end_time = COALESCE($3, end_time),
        max_per_hour = COALESCE($4, max_per_hour),
        location = COALESCE($5, location)
      WHERE id = $6
      RETURNING *
    `;
        const result = await pool.query(query, [weekday, start_time, end_time, max_per_hour, location, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Schedule entry not found." });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(`Error updating schedule entry ${id}:`, err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Delete a specific schedule entry by its own ID
// @route   DELETE /api/schedule/:id
const deleteSchedule = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM weekly_schedule WHERE id = $1 RETURNING *", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Schedule entry not found." });
        }
        res.status(204).send();
    } catch (err) {
        console.error(`Error deleting schedule entry ${id}:`, err);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    getSchedulesByDoctor,
    createSchedule,
    updateSchedule,
    deleteSchedule,
};