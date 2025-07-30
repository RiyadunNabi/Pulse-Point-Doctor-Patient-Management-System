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

    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        const result = await client.query(
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

        await client.query('COMMIT');

        res.status(201).json(response);

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Error booking appointment:", err);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
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
            SELECT a.appointment_id, a.appointment_date, a.appointment_time, a.status, a.reason,
                   d.doctor_id, d.first_name, d.last_name, dep.department_name
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
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const result = await client.query(
            `UPDATE appointment SET status = $1 WHERE appointment_id = $2 RETURNING *`,
            [status, id]
        );
        if (result.rows.length === 0) {
            await client.query('COMMIT');
            return res.status(404).json({ error: "Appointment not found." });
        }
        await client.query('COMMIT');
        res.status(200).json(result.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Error updating appointment:", err);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        client.release();
    }
};

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


// @desc    Get all completed appointments for a doctor that have investigation reports
// @route   GET /api/appointments/doctor/:doctorId/investigation-reports
const getInvestigationReportAppointmentsByDoctor = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const query = `
      -- Pull full appointment + patient info from your stored proc,
      -- then join on prescription & investigation_report aggregates
      SELECT
        b.*,
        agg.prescription_id,
        agg.investigation_count
      FROM get_appointments_by_doctor_and_status($1, 'completed') AS b
      JOIN (
        SELECT
          a.appointment_id,
          p.prescription_id,
          COUNT(ir.report_id) AS investigation_count
        FROM appointment a
        JOIN prescription p           ON a.appointment_id = p.appointment_id
        JOIN investigation_report ir  ON ir.prescription_id = p.prescription_id
        WHERE a.doctor_id = $1
          AND a.status    = 'completed'
        GROUP BY a.appointment_id, p.prescription_id
      ) AS agg
        ON agg.appointment_id = b.appointment_id
      ORDER BY b.appointment_date ASC, b.appointment_time ASC
    `;
    const { rows } = await pool.query(query, [doctorId]);
    res.status(200).json(rows);
  } catch (err) {
    console.error(
      "Get appointments by investigation report status error:",
      err
    );
    res.status(500).json({ error: 'Server error' });
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

/**
 * @desc    Get aggregated appointment/payment/investigation stats
 * @route   GET /api/appointments/doctor/:doctorId/stats
 */
const getAppointmentStats = async (req, res) => {
  const { doctorId } = req.params;
  try {
    // Call the SQL function we just created
    const { rows } = await pool.query(
      'SELECT * FROM get_appointment_stats_by_doctor($1)',
      [doctorId]
    );
    // rows[0] contains: pending_count, completed_count, cancelled_count,
    //                  paid_count, unpaid_count, investigation_reports_count
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error('Error fetching appointment stats:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Check if patient has existing pending appointment with doctor
// @route GET /api/appointments/check-existing/:patientId/:doctorId
const checkExistingAppointment = async (req, res) => {
  const { patientId, doctorId } = req.params;
  
  try {
    const { rows } = await pool.query(
      'SELECT * FROM check_existing_appointment($1, $2)',
      [patientId, doctorId]
    );
    
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error('Error checking existing appointment:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


const deleteAppointment = async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await client.query(
            'DELETE FROM appointment WHERE appointment_id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) {
            await client.query('COMMIT');
            return res.status(404).json({ error: "Appointment not found." });
        }
        await client.query('COMMIT');
        res.status(204).send(); // Success, no content
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Error deleting appointment:", err);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        client.release();
    }
};


module.exports = {
    createAppointment,
    getPatientHealthData,
    getAppointmentById,
    getAppointmentsByDoctor,
    getAppointmentsByPatient,
    getAppointmentsByDoctorAndStatus,
    getInvestigationReportAppointmentsByDoctor,
    getDoctorAppointmentStats,
    updateAppointment,
    deleteAppointment,
    getAppointmentStats,
    checkExistingAppointment,
};