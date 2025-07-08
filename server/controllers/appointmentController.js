const pool = require('../db/connection');

// @desc    Book a new appointment
// @route   POST /api/appointments
const createAppointment = async (req, res) => {
    // const { doctor_id, patient_id, appointment_date, reason } = req.body;
    const {
        doctor_id,
        patient_id,
        appointment_date,
        start_time,
        end_time,
        max_per_hour,
        reason
    } = req.body;

    if (
        !doctor_id ||
        !patient_id ||
        !appointment_date ||
        !start_time ||
        !end_time ||
        !max_per_hour
    ) {
        return res.status(400).json({
            error:
                "doctor_id, patient_id, appointment_date, start_time, end_time and max_per_hour are required."
        });
    }

    try {
        console.log("Booking payload:", req.body);

        // const date = new Date(appointment_date + 'T00:00:00');
        // const dayOfWeek = date.getDay();

        // const scheduleResult = await pool.query(
        //     `SELECT start_time, end_time, max_per_hour FROM weekly_schedule WHERE doctor_id = $1 AND weekday = $2`,
        //     [doctor_id, dayOfWeek]
        // );

        // if (scheduleResult.rows.length === 0) {
        //     return res.status(400).json({ error: "The doctor is not available on the selected day." });
        // }

        // const schedule = scheduleResult.rows[0];
        // const { start_time, end_time, max_per_hour } = schedule;

        const slotDurationMinutes = 60 / Number(max_per_hour);

        const lastAppointmentResult = await pool.query(
            `SELECT MAX(appointment_time) as last_time FROM appointment WHERE doctor_id = $1 AND appointment_date = $2 AND status != 'cancelled'`,
            [doctor_id, appointment_date]
        );

        let nextSlotTime;

        if (lastAppointmentResult.rows[0].last_time === null) {
            nextSlotTime = start_time;
        } else {
            const lastTime = lastAppointmentResult.rows[0].last_time;
            const lastTimeParts = lastTime.split(':').map(Number); // [HH, MM, SS]

            const lastTimeDateObj = new Date();
            lastTimeDateObj.setHours(lastTimeParts[0], lastTimeParts[1], lastTimeParts[2]);


            lastTimeDateObj.setMinutes(lastTimeDateObj.getMinutes() + slotDurationMinutes);

            // "HH:mm:ss"
            nextSlotTime = lastTimeDateObj.toTimeString().split(' ')[0];
        }

        if (nextSlotTime >= end_time) {
            return res.status(400).json({ error: "Sorry, the doctor is fully booked for this day." });
        }

        const createQuery = `
          INSERT INTO appointment (doctor_id, patient_id, appointment_date, appointment_time, reason)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `;
        const result = await pool.query(createQuery, [doctor_id, patient_id, appointment_date, nextSlotTime, reason]);

        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error("Error booking appointment:", err);
        // res.status(500).json({ error: "Internal server error" });
        res.status(500).json({ error: err.message });
    }
};

// @route   GET /api/appointments/:id
const getAppointmentById = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT 
                a.*, 
                doc.first_name as doctor_first_name, doc.last_name as doctor_last_name,
                pat.first_name as patient_first_name, pat.last_name as patient_last_name,
                dept.department_name
            FROM appointment a
            JOIN doctor doc ON a.doctor_id = doc.doctor_id
            JOIN patient pat ON a.patient_id = pat.patient_id
            JOIN department dept ON doc.department_id = dept.department_id
            WHERE a.appointment_id = $1
        `;
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Appointment not found." });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error fetching appointment:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// @route   GET /api/appointments/doctor/:doctorId
const getAppointmentsByDoctor = async (req, res) => {
    const { doctorId } = req.params;
    try {
        const query = `
            SELECT a.appointment_id, a.appointment_date, a.appointment_time, a.status, 
                   p.first_name, p.last_name
            FROM appointment a
            JOIN patient p ON a.patient_id = p.patient_id
            WHERE a.doctor_id = $1
            ORDER BY a.appointment_date, a.appointment_time
        `;
        const result = await pool.query(query, [doctorId]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching doctor's appointments:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// @route   GET /api/appointments/patient/:patientId
const getAppointmentsByPatient = async (req, res) => {
    const { patientId } = req.params;
    try {
        const query = `
            SELECT a.appointment_id, a.appointment_date, a.appointment_time, a.status, 
                   d.first_name, d.last_name, dep.department_name
            FROM appointment a
            JOIN doctor d ON a.doctor_id = d.doctor_id
            JOIN department dep ON d.department_id = dep.department_id
            WHERE a.patient_id = $1
            ORDER BY a.appointment_date, a.appointment_time
        `;
        const result = await pool.query(query, [patientId]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching patient's appointments:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// @route   PATCH /api/appointments/:id
const updateAppointment = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: "Status field is required for an update." });
    }
    const allowedStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status value." });
    }

    try {
        const result = await pool.query(
            `UPDATE appointment SET status = $1 WHERE appointment_id = $2 RETURNING *`,
            [status, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Appointment not found." });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error updating appointment:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// @route   DELETE /api/appointments/:id
const cancelAppointment = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `UPDATE appointment SET status = 'cancelled' WHERE appointment_id = $1 RETURNING *`,
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Appointment not found." });
        }
        res.status(204).send(); // Success, no content
    } catch (err) {
        console.error("Error cancelling appointment:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    createAppointment,
    getAppointmentById,
    getAppointmentsByDoctor,
    getAppointmentsByPatient,
    updateAppointment,
    cancelAppointment,
};