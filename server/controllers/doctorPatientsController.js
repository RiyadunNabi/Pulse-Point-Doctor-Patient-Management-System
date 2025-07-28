const pool = require('../db/connection');

/**
 * @desc    Get all patients for a specific doctor with appointment statistics
 * @route   GET /api/doctor-patients/doctor/:doctorId
 */
const getDoctorPatientsWithStats = async (req, res) => {
    const { doctorId } = req.params;
    const {
        search = null,
        gender = null,
        from_date = null,
        to_date = null,
        sort_by = 'last_appointment',
        sort_order = 'desc',
        page = 1,
        limit = 12
    } = req.query;

    try {
        const { rows } = await pool.query(
            'SELECT * FROM get_doctor_patients_with_stats($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [
                doctorId,
                search,
                gender,
                from_date,
                to_date,
                sort_by,
                sort_order,
                parseInt(page),
                parseInt(limit)
            ]
        );

        // Calculate pagination info
        const totalRecords = rows.length > 0 ? parseInt(rows[0].total_records) : 0;
        const totalPages = Math.ceil(totalRecords / parseInt(limit));

        res.status(200).json({
            patients: rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalRecords,
                hasNextPage: parseInt(page) < totalPages,
                hasPrevPage: parseInt(page) > 1
            }
        });
    } catch (err) {
        console.error('Error fetching doctor patients:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @desc    Get daily appointment analytics for a doctor
 * @route   GET /api/doctor-patients/doctor/:doctorId/daily-analytics
 */
const getDoctorDailyAnalytics = async (req, res) => {
    const { doctorId } = req.params;
    const { days = 7 } = req.query;

    try {
        const { rows } = await pool.query(
            'SELECT * FROM get_doctor_daily_appointment_analytics($1, $2)',
            [doctorId, parseInt(days)]
        );
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error fetching daily analytics:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @desc    Get monthly appointment analytics for a doctor
 * @route   GET /api/doctor-patients/doctor/:doctorId/monthly-analytics
 */
const getDoctorMonthlyAnalytics = async (req, res) => {
    const { doctorId } = req.params;
    const { months = 12 } = req.query;

    try {
        const { rows } = await pool.query(
            'SELECT * FROM get_doctor_monthly_appointment_analytics($1, $2)',
            [doctorId, parseInt(months)]
        );
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error fetching monthly analytics:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @desc    Get detailed patient information by patient ID
 * @route   GET /api/doctor-patients/patient/:patientId
 */
const getPatientDetails = async (req, res) => {
    const { patientId } = req.params;

    try {
        const patientQuery = `
            SELECT 
                p.*,
                u.email,
                u.username,
                u.created_at as user_created_at,
                CASE 
                    WHEN p.date_of_birth IS NOT NULL THEN 
                        EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.date_of_birth))::INTEGER
                    ELSE NULL
                END as age
            FROM patient p
            JOIN "user" u ON p.user_id = u.user_id
            WHERE p.patient_id = $1
        `;

        const appointmentHistoryQuery = `
            SELECT 
                a.appointment_id,
                a.appointment_date,
                a.appointment_time,
                a.status,
                a.reason,
                a.created_at,
                d.first_name as doctor_first_name,
                d.last_name as doctor_last_name,
                dep.department_name
            FROM appointment a
            JOIN doctor d ON a.doctor_id = d.doctor_id
            JOIN department dep ON d.department_id = dep.department_id
            WHERE a.patient_id = $1
            ORDER BY a.appointment_date DESC, a.appointment_time DESC
        `;

        const [patientResult, appointmentHistoryResult] = await Promise.all([
            pool.query(patientQuery, [patientId]),
            pool.query(appointmentHistoryQuery, [patientId])
        ]);

        if (patientResult.rows.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        res.status(200).json({
            patient: patientResult.rows[0],
            appointmentHistory: appointmentHistoryResult.rows
        });
    } catch (err) {
        console.error('Error fetching patient details:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getDoctorPatientsWithStats,
    getDoctorDailyAnalytics,
    getDoctorMonthlyAnalytics,
    getPatientDetails
};
