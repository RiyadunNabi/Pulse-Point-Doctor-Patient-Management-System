const pool = require('../db/connection');

const createAppointment = async (req, res) => {
    const {
        doctor_id,
        patient_id,
        appointment_date,
        start_time,
        end_time,
        max_per_hour,
        reason,
        shared_health_log_id,
        shared_document_ids
    } = req.body;

    if (!doctor_id || !patient_id || !appointment_date || !start_time || !end_time || !max_per_hour) {
        return res.status(400).json({ error: "All booking details are required." });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM create_appointment_with_prediction($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [
                doctor_id,
                patient_id,
                appointment_date,
                start_time,
                end_time,
                max_per_hour,
                reason,
                shared_health_log_id || null,
                shared_document_ids || null
            ]
        );

        const appointmentData = result.rows[0];
        
        // Format response with all required time information
        const response = {
            appointment_id: appointmentData.appointment_id,
            doctor_id,
            patient_id,
            appointment_date: appointmentData.appointment_date,
            appointment_time: appointmentData.predicted_time,
            predicted_time: appointmentData.predicted_time,
            slot_window_start: appointmentData.slot_window_start,
            slot_window_end: appointmentData.slot_window_end,
            status: appointmentData.status,
            reason: appointmentData.reason
        };

        res.status(201).json(response);

    } catch (err) {
        console.error("Error booking appointment:", err);
        res.status(500).json({ error: err.message });
    }
};
// New endpoint to get patient health data for appointment booking
const getPatientHealthData = async (req, res) => {
    const { patientId } = req.params;
    
    try {
        const result = await pool.query(
            'SELECT * FROM get_patient_health_data($1)',
            [patientId]
        );
        
        res.status(200).json(result.rows[0] || {});
    } catch (err) {
        console.error("Error fetching patient health data:", err);
        res.status(500).json({ error: "Failed to fetch patient health data" });
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

// @route GET /api/appointments/doctor/:doctorId/stats
const getDoctorAppointmentStats = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM get_doctor_appointment_stats($1)',
      [doctorId]
    );
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error('Error fetching appointment stats:', err);
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
    createAppointment,
    getPatientHealthData,
    getAppointmentById,
    getAppointmentsByDoctor,
    getAppointmentsByPatient,
    getAppointmentsByDoctorAndStatus,
    getDoctorAppointmentStats,
    updateAppointment,
    cancelAppointment,
};