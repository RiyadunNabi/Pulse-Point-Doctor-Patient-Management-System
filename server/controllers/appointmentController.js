
// @desc    Book a new appointment
// @route   POST /api/appointments
// const createAppointment = async (req, res) => {
    //     // const { doctor_id, patient_id, appointment_date, reason } = req.body;
//     const {
    //         doctor_id,
    //         patient_id,
    //         appointment_date,
//         start_time,
//         end_time,
//         max_per_hour,
//         reason
//     } = req.body;

//     if (
//         !doctor_id ||
//         !patient_id ||
//         !appointment_date ||
//         !start_time ||
//         !end_time ||
//         !max_per_hour
//     ) {
    //         return res.status(400).json({
        //             error:
        //                 "doctor_id, patient_id, appointment_date, start_time, end_time and max_per_hour are required."
        //         });
        //     }
        
        //     try {
//         console.log("Booking payload:", req.body);

//         // const date = new Date(appointment_date + 'T00:00:00');
//         // const dayOfWeek = date.getDay();

//         // const scheduleResult = await pool.query(
    //         //     `SELECT start_time, end_time, max_per_hour FROM weekly_schedule WHERE doctor_id = $1 AND weekday = $2`,
    //         //     [doctor_id, dayOfWeek]
    //         // );

    //         // if (scheduleResult.rows.length === 0) {
        //         //     return res.status(400).json({ error: "The doctor is not available on the selected day." });
        //         // }
        
        //         // const schedule = scheduleResult.rows[0];
//         // const { start_time, end_time, max_per_hour } = schedule;

//         const slotDurationMinutes = 60 / Number(max_per_hour);

//         const lastAppointmentResult = await pool.query(
    //             `SELECT MAX(appointment_time) as last_time FROM appointment WHERE doctor_id = $1 AND appointment_date = $2 AND status != 'cancelled'`,
    //             [doctor_id, appointment_date]
    //         );
    
//         let nextSlotTime;

//         if (lastAppointmentResult.rows[0].last_time === null) {
//             nextSlotTime = start_time;
//         } else {
    //             const lastTime = lastAppointmentResult.rows[0].last_time;
    //             const lastTimeParts = lastTime.split(':').map(Number); // [HH, MM, SS]
    
    //             const lastTimeDateObj = new Date();
    //             lastTimeDateObj.setHours(lastTimeParts[0], lastTimeParts[1], lastTimeParts[2]);


//             lastTimeDateObj.setMinutes(lastTimeDateObj.getMinutes() + slotDurationMinutes);

//             // "HH:mm:ss"
//             nextSlotTime = lastTimeDateObj.toTimeString().split(' ')[0];
//         }

//         if (nextSlotTime >= end_time) {
    //             return res.status(400).json({ error: "Sorry, the doctor is fully booked for this day." });
//         }

//         const createQuery = `
//           INSERT INTO appointment (doctor_id, patient_id, appointment_date, appointment_time, reason)
//           VALUES ($1, $2, $3, $4, $5)
//           RETURNING *
//         `;
//         const result = await pool.query(createQuery, [doctor_id, patient_id, appointment_date, nextSlotTime, reason]);

//         res.status(201).json(result.rows[0]);

//     } catch (err) {
    //         console.error("Error booking appointment:", err);
//         // res.status(500).json({ error: "Internal server error" });
//         res.status(500).json({ error: err.message });
//     }
// };

// // appointmentController.js
// const createAppointment = async (req, res) => {
    //     const {
        //         doctor_id,
        //         patient_id,
        //         appointment_date,
//         start_time,
//         end_time,
//         max_per_hour,
//         reason
//     } = req.body;

//     if (
//         !doctor_id ||
//         !patient_id ||
//         !appointment_date ||
//         !start_time ||      // Check for start_time
//         !end_time ||        // Check for end_time
//         !max_per_hour       // Check for max_per_hour
//     ) {
    //         return res.status(400).json({
//             error: "doctor_id, patient_id, appointment_date, start_time, end_time and max_per_hour are required."
//         });
//     }

//     try {
    //         // 1) Check capacity
    //         const { rows } = await pool.query(
        //             `SELECT GREATEST(0, max_per_hour - COALESCE(booked_count,0)) AS available_slots
        //        FROM available_appointment_slots aas
//        LEFT JOIN (
    //          SELECT appointment_date,
    //                 DATE_TRUNC('hour', appointment_time) AS hour_slot,
    //                 doctor_id,
    //                 COUNT(*) AS booked_count
//          FROM appointment
//          WHERE status != 'cancelled'
//          GROUP BY appointment_date, hour_slot, doctor_id
//        ) b
//          ON aas.doctor_id = b.doctor_id
//         AND aas.slot_date   = b.appointment_date
//         AND DATE_TRUNC('hour', aas.start_time::time) = b.hour_slot::time
//       WHERE aas.doctor_id  = $1
//         AND aas.slot_date   = $2
//         AND aas.start_time  = $3::time`,
//             [doctor_id, appointment_date, appointment_time]
//         );
//         if (rows.length === 0 || rows[0].available_slots < 1) {
    //             return res.status(400).json({ error: "Sorry, that slot is fully booked." });
    //         }

    //         // 2) Insert exactly the slot the UI picked
    //         const insert = await pool.query(
//             `INSERT INTO appointment
//          (doctor_id, patient_id, appointment_date, appointment_time, reason)
//        VALUES ($1, $2, $3::date, $4::time, $5)
//        RETURNING *`,
//             [doctor_id, patient_id, appointment_date, appointment_time, reason]
//         );

//         res.status(201).json(insert.rows[0]);
//     } catch (err) {
    //         console.error(err);
    //         res.status(500).json({ error: err.message });
//     }
// };

const pool = require('../db/connection');

// Corrected code for server/controllers/appointmentController.js
const createAppointment = async (req, res) => {
    const {
        doctor_id,
        patient_id,
        appointment_date,
        start_time,
        end_time,
        max_per_hour,
        reason
    } = req.body;

    if (!doctor_id || !patient_id || !appointment_date || !start_time || !end_time || !max_per_hour) {
        return res.status(400).json({ error: "All booking details are required." });
    }

    try {
        // 1. Count currently booked appointments to check capacity
        const appointmentsCountResult = await pool.query(
            `SELECT COUNT(*) FROM appointment 
             WHERE doctor_id = $1 
               AND appointment_date = $2 
               AND appointment_time >= $3 
               AND appointment_time < $4 
               AND status <> 'cancelled'`,
            [doctor_id, appointment_date, start_time, end_time]
        );
        const bookedAppointments = parseInt(appointmentsCountResult.rows[0].count, 10);

        // 2. Calculate total capacity for ONLY this specific slot.
        const startTimeParts = start_time.split(':').map(Number);
        const endTimeParts = end_time.split(':').map(Number);
        const startHour = startTimeParts[0] + (startTimeParts[1] / 60);
        const endHour = endTimeParts[0] + (endTimeParts[1] / 60);
        const durationHours = endHour - startHour;
        const totalAvailableSlots = Math.floor(durationHours * Number(max_per_hour));

        // 3. Check if THIS SPECIFIC SLOT is fully booked.
        if (bookedAppointments >= totalAvailableSlots) {
            return res.status(400).json({ error: "Sorry, this time slot is fully booked." });
        }

        // 4. Find the last appointment time ONLY within the selected slot.
        const slotDurationMinutes = 60 / Number(max_per_hour);
        const lastAppointmentResult = await pool.query(
            `SELECT MAX(appointment_time) as last_time FROM appointment 
             WHERE doctor_id = $1 
               AND appointment_date = $2 
               AND appointment_time >= $3 
               AND appointment_time < $4 
               AND status <> 'cancelled'`,
            [doctor_id, appointment_date, start_time, end_time]
        );

        let nextSlotTime;
        // If no appointments in this slot yet, start at the slot's start_time.
        if (lastAppointmentResult.rows[0].last_time === null) {
            nextSlotTime = start_time;
        } else {
            // Otherwise, calculate the next time from the last one in this slot.
            const lastTime = lastAppointmentResult.rows[0].last_time;
            const lastTimeParts = lastTime.split(':').map(Number);
            const lastTimeInMinutes = lastTimeParts[0] * 60 + lastTimeParts[1];
            const nextSlotInMinutes = lastTimeInMinutes + slotDurationMinutes;
            const nextHour = Math.floor(nextSlotInMinutes / 60);
            const nextMinute = nextSlotInMinutes % 60;
            const pad = (num) => num.toString().padStart(2, '0');
            nextSlotTime = `${pad(nextHour)}:${pad(nextMinute)}:00`;
        }

        // Final check to ensure the calculated time doesn't exceed the slot's end time.
        if (nextSlotTime >= end_time) {
            return res.status(400).json({ error: "Sorry, no more appointments are available in this time slot." });
        }

        // 5. Insert the new appointment using the correct variable
        const createQuery = `
          INSERT INTO appointment (doctor_id, patient_id, appointment_date, appointment_time, reason)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `;
        
        // --- THIS IS THE FIX ---
        // Use `nextSlotTime` as the 4th parameter, not `appointment_time`.
        const result = await pool.query(createQuery, [doctor_id, patient_id, appointment_date, nextSlotTime, reason]);
        // --- END OF FIX ---

        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error("Error booking appointment:", err);
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

// // @route   GET /api/appointments/doctor/:doctorId/status/:status
// const getAppointmentsByDoctorAndStatus = async (req, res) => {
//     const { doctorId, status } = req.params;
    
//     try {
//         const query = `
//             SELECT 
//                 a.appointment_id, 
//                 a.appointment_date, 
//                 a.appointment_time, 
//                 a.status, 
//                 a.reason,
//                 a.created_at,
//                 p.patient_id,
//                 p.first_name as patient_first_name, 
//                 p.last_name as patient_last_name,
//                 p.phone_no as patient_phone,
//                 u.email         AS patient_email,
//                 p.date_of_birth,
//                 p.gender as patient_gender,
//                 p.address as patient_address
//             FROM appointment a
//             JOIN patient p ON a.patient_id = p.patient_id
//             JOIN "user"    u ON p.user_id = u.user_id
//             WHERE a.doctor_id = $1 AND a.status = $2
//             ORDER BY a.appointment_date ASC, a.appointment_time ASC
//         `;
//         const result = await pool.query(query, [doctorId, status]);
//         res.status(200).json(result.rows);
//     } catch (err) {
//         console.error(`Error fetching ${status} appointments:`, err);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };
// server/controllers/appointmentController.js
const getAppointmentsByDoctorAndStatus = async (req, res) => {
  const { doctorId, status } = req.params;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM get_appointments_by_doctor_and_status($1, $2)',
      [doctorId, status]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    // res.status(500).json({ error: 'Internal server error' });
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
    createAppointment,
    getAppointmentById,
    getAppointmentsByDoctor,
    getAppointmentsByPatient,
    getAppointmentsByDoctorAndStatus,
    updateAppointment,
    cancelAppointment,
};