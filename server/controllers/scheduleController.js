const pool = require('../db/connection');

// @desc    Get available appointment slots for a doctor
// @route   GET /api/schedule/available/:doctorId
const getAvailableSlots = async (req, res) => {
    const { doctorId } = req.params;
    const { startDate, endDate } = req.query;
    
    try {
        let query = `
            SELECT 
                slot_date,
                start_time,
                end_time,
                max_per_hour,
                location,
                schedule_id,
                source_type,
                -- Calculate available slots (subtract booked appointments)
                GREATEST(0, max_per_hour - COALESCE(booked_count, 0)) as available_slots
            FROM available_appointment_slots aas
            LEFT JOIN (
                SELECT 
                    appointment_date,
                    DATE_TRUNC('hour', appointment_time) as hour_slot,
                    doctor_id,
                    COUNT(*) as booked_count
                FROM appointment 
                WHERE status NOT IN ('cancelled')
                GROUP BY appointment_date, DATE_TRUNC('hour', appointment_time), doctor_id
            ) booked ON aas.doctor_id = booked.doctor_id 
                AND aas.slot_date = booked.appointment_date
                AND DATE_TRUNC('hour', aas.start_time::time) = booked.hour_slot::time
            WHERE aas.doctor_id = $1
        `;
        
        const params = [doctorId];
        
        if (startDate) {
            query += ` AND slot_date >= $${params.length + 1}`;
            params.push(startDate);
        }
        
        if (endDate) {
            query += ` AND slot_date <= $${params.length + 1}`;
            params.push(endDate);
        }
        
        query += ` ORDER BY slot_date, start_time`;
        
        const result = await pool.query(query, params);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching available slots:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Get all schedule entries for a specific doctor (UPDATED)
// @route   GET /api/schedule/doctor/:doctorId
const getSchedulesByDoctor = async (req, res) => {
    const { doctorId } = req.params;
    try {
        const result = await pool.query(
            `SELECT 
                id, 
                schedule_type,
                weekday, 
                specific_date,
                start_time, 
                end_time, 
                max_per_hour, 
                location,
                start_date,
                end_date,
                is_active,
                created_at,
                updated_at
            FROM doctor_schedule
            WHERE doctor_id = $1 AND is_active = TRUE
            ORDER BY schedule_type, weekday, specific_date, start_time`,
            [doctorId]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching schedule:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Get doctor's schedule configuration (grouped by type)
// @route   GET /api/schedule/config/:doctorId
const getDoctorScheduleConfig = async (req, res) => {
    const { doctorId } = req.params;
    
    try {
        const result = await pool.query(
            `SELECT * FROM doctor_schedule 
             WHERE doctor_id = $1 AND is_active = TRUE
             ORDER BY schedule_type, weekday, specific_date, start_time`,
            [doctorId]
        );
        
        const recurring = result.rows.filter(row => row.schedule_type === 'recurring');
        const specific = result.rows.filter(row => row.schedule_type === 'specific');
        
        res.status(200).json({ recurring, specific });
    } catch (err) {
        console.error("Error fetching schedule config:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Create recurring schedule (UPDATED)
// @route   POST /api/schedule/recurring
const createRecurringSchedule = async (req, res) => {
    const { 
        doctor_id, 
        weekday, 
        start_time, 
        end_time, 
        max_per_hour, 
        location,
        start_date,
        end_date 
    } = req.body;

    if (!doctor_id || weekday === undefined || !start_time || !end_time) {
        return res.status(400).json({ 
            error: "doctor_id, weekday, start_time, and end_time are required" 
        });
    }

    try {
        const result = await pool.query(
            `INSERT INTO doctor_schedule 
             (doctor_id, schedule_type, weekday, start_time, end_time, max_per_hour, location, start_date, end_date)
             VALUES ($1, 'recurring', $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [doctor_id, weekday, start_time, end_time, max_per_hour, location, start_date, end_date]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error creating recurring schedule:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Create specific date schedule (NEW)
// @route   POST /api/schedule/specific
const createSpecificSchedule = async (req, res) => {
    const { 
        doctor_id, 
        specific_date, 
        start_time, 
        end_time, 
        max_per_hour, 
        location 
    } = req.body;

    if (!doctor_id || !specific_date || !start_time || !end_time) {
        return res.status(400).json({ 
            error: "doctor_id, specific_date, start_time, and end_time are required" 
        });
    }

    try {
        const result = await pool.query(
            `INSERT INTO doctor_schedule 
             (doctor_id, schedule_type, specific_date, start_time, end_time, max_per_hour, location)
             VALUES ($1, 'specific', $2, $3, $4, $5, $6)
             RETURNING *`,
            [doctor_id, specific_date, start_time, end_time, max_per_hour, location]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error creating specific schedule:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Add a new schedule entry (LEGACY SUPPORT - Updated)
// @route   POST /api/schedule
const createSchedule = async (req, res) => {
    const { 
        doctor_id, 
        weekday, 
        specific_date,
        start_time, 
        end_time, 
        max_per_hour, 
        location,
        start_date,
        end_date 
    } = req.body;

    // Determine schedule type based on provided data
    const schedule_type = specific_date ? 'specific' : 'recurring';

    if (!doctor_id || !start_time || !end_time) {
        return res.status(400).json({ 
            error: "doctor_id, start_time, and end_time are required fields." 
        });
    }

    if (schedule_type === 'recurring' && weekday === undefined) {
        return res.status(400).json({ 
            error: "weekday is required for recurring schedules." 
        });
    }

    if (schedule_type === 'specific' && !specific_date) {
        return res.status(400).json({ 
            error: "specific_date is required for specific date schedules." 
        });
    }

    try {
        const result = await pool.query(
            `INSERT INTO doctor_schedule 
             (doctor_id, schedule_type, weekday, specific_date, start_time, end_time, max_per_hour, location, start_date, end_date)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             RETURNING *`,
            [doctor_id, schedule_type, weekday, specific_date, start_time, end_time, max_per_hour, location, start_date, end_date]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error adding schedule:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Update a specific schedule entry by its own ID (UPDATED)
// @route   PATCH /api/schedule/:id
const updateSchedule = async (req, res) => {
    const { id } = req.params;
    const { 
        weekday, 
        specific_date,
        start_time, 
        end_time, 
        max_per_hour, 
        location,
        start_date,
        end_date,
        is_active 
    } = req.body;

    try {
        const query = `
            UPDATE doctor_schedule SET
                weekday = COALESCE($1, weekday),
                specific_date = COALESCE($2, specific_date),
                start_time = COALESCE($3, start_time),
                end_time = COALESCE($4, end_time),
                max_per_hour = COALESCE($5, max_per_hour),
                location = COALESCE($6, location),
                start_date = COALESCE($7, start_date),
                end_date = COALESCE($8, end_date),
                is_active = COALESCE($9, is_active),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $10
            RETURNING *
        `;
        
        const result = await pool.query(query, [
            weekday, specific_date, start_time, end_time, max_per_hour, 
            location, start_date, end_date, is_active, id
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Schedule entry not found." });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(`Error updating schedule entry ${id}:`, err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Delete a specific schedule entry by its own ID (UPDATED)
// @route   DELETE /api/schedule/:id
const deleteSchedule = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "DELETE FROM doctor_schedule WHERE id = $1 RETURNING *", 
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Schedule entry not found." });
        }
        res.status(204).send();
    } catch (err) {
        console.error(`Error deleting schedule entry ${id}:`, err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Soft delete (deactivate) a schedule entry
// @route   PATCH /api/schedule/:id/deactivate
const deactivateSchedule = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `UPDATE doctor_schedule 
             SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $1 
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Schedule entry not found." });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(`Error deactivating schedule entry ${id}:`, err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Reactivate a schedule entry
// @route   PATCH /api/schedule/:id/activate
const activateSchedule = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `UPDATE doctor_schedule 
             SET is_active = TRUE, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $1 
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Schedule entry not found." });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(`Error activating schedule entry ${id}:`, err);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    // Available slots
    getAvailableSlots,
    
    // Schedule management
    getSchedulesByDoctor,
    getDoctorScheduleConfig,
    
    // Create schedules
    createSchedule,           // Legacy support (auto-detects type)
    createRecurringSchedule,  // Specific recurring
    createSpecificSchedule,   // Specific date
    
    // Update/Delete
    updateSchedule,
    deleteSchedule,
    deactivateSchedule,
    activateSchedule
};



// const pool = require('../db/connection');

// // @desc    Get all schedule entries for a specific doctor
// // @route   GET /api/schedule/doctor/:doctorId
// const getSchedulesByDoctor = async (req, res) => {
//     const { doctorId } = req.params;
//     try {
//         const result = await pool.query(
//             `SELECT id, weekday, start_time, end_time, max_per_hour, location
//        FROM weekly_schedule
//        WHERE doctor_id = $1
//        ORDER BY weekday, start_time`,
//             [doctorId]
//         );
//         res.status(200).json(result.rows);
//     } catch (err) {
//         console.error("Error fetching schedule:", err);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

// // @desc    Add a new schedule entry for a doctor
// // @route   POST /api/schedule
// const createSchedule = async (req, res) => {
//     const { doctor_id, weekday, start_time, end_time, max_per_hour, location } = req.body;

//     if (doctor_id === undefined || weekday === undefined || !start_time || !end_time) {
//         return res.status(400).json({ error: "doctor_id, weekday, start_time, and end_time are required fields." });
//     }

//     try {
//         const result = await pool.query(
//             `INSERT INTO weekly_schedule (doctor_id, weekday, start_time, end_time, max_per_hour, location)
//        VALUES ($1, $2, $3, $4, $5, $6)
//        RETURNING *`,
//             [doctor_id, weekday, start_time, end_time, max_per_hour, location]
//         );
//         res.status(201).json(result.rows[0]);
//     } catch (err) {
//         console.error("Error adding schedule:", err);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

// // @desc    Update a specific schedule entry by its own ID
// // @route   PATCH /api/schedule/:id
// const updateSchedule = async (req, res) => {
//     const { id } = req.params;
//     const { weekday, start_time, end_time, max_per_hour, location } = req.body;

//     try {
//         const query = `
//       UPDATE weekly_schedule SET
//         weekday = COALESCE($1, weekday),
//         start_time = COALESCE($2, start_time),
//         end_time = COALESCE($3, end_time),
//         max_per_hour = COALESCE($4, max_per_hour),
//         location = COALESCE($5, location)
//       WHERE id = $6
//       RETURNING *
//     `;
//         const result = await pool.query(query, [weekday, start_time, end_time, max_per_hour, location, id]);

//         if (result.rows.length === 0) {
//             return res.status(404).json({ error: "Schedule entry not found." });
//         }
//         res.status(200).json(result.rows[0]);
//     } catch (err) {
//         console.error(`Error updating schedule entry ${id}:`, err);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

// // @desc    Delete a specific schedule entry by its own ID
// // @route   DELETE /api/schedule/:id
// const deleteSchedule = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const result = await pool.query("DELETE FROM weekly_schedule WHERE id = $1 RETURNING *", [id]);

//         if (result.rows.length === 0) {
//             return res.status(404).json({ error: "Schedule entry not found." });
//         }
//         res.status(204).send();
//     } catch (err) {
//         console.error(`Error deleting schedule entry ${id}:`, err);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

// module.exports = {
//     getSchedulesByDoctor,
//     createSchedule,
//     updateSchedule,
//     deleteSchedule,
// };