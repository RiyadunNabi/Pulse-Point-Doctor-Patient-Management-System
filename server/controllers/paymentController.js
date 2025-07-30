const pool = require('../db/connection');

/**
 * @desc    Create a new payment record for an appointment
 * @route   POST /api/payments
 */
const createPayment = async (req, res) => {
  const { appointment_id, amount, payment_method, transaction_id } = req.body;

  if (!appointment_id || !amount || !payment_method || !transaction_id) {
    return res.status(400).json({ error: 'appointment_id, amount, payment_method, and transaction_id are required.' });
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Check if a payment record for this appointment already exists
    const existingPayment = await client.query('SELECT 1 FROM payments WHERE appointment_id = $1', [appointment_id]);
    if (existingPayment.rows.length > 0) {
      return res.status(409).json({ error: 'A payment record for this appointment already exists.' });
    }

    const result = await client.query(
      `INSERT INTO payments (appointment_id, amount, payment_method, transaction_id, payment_status, paid_time)
             VALUES ($1, $2, $3, $4, 'paid', NOW()) RETURNING *`,
      [appointment_id, amount, payment_method, transaction_id]
    );

    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error("Create payment error:", err);
    res.status(500).json({ error: 'Server error' });
  }
  finally {
     client.release();
  }
};

/**
 * @desc    Get payment counts for a specific doctor (FIXED VERSION)
 * @route   GET /api/payments/doctor/:doctorId/counts
 */
const getPaymentCountsByDoctor = async (req, res) => {
  const { doctorId } = req.params;
  
  try {
    // Get all completed appointments for this doctor with their payment status
    const query = `
      SELECT 
        a.appointment_id,
        COALESCE(p.payment_status, 'unpaid') as payment_status
      FROM appointment a
      LEFT JOIN payments p ON a.appointment_id = p.appointment_id
      WHERE a.doctor_id = $1 AND a.status = 'completed'
    `;
    
    const result = await pool.query(query, [doctorId]);
    
    // Count paid and unpaid
    const counts = result.rows.reduce((acc, row) => {
      if (row.payment_status === 'paid') {
        acc.paid++;
      } else {
        acc.unpaid++;
      }
      return acc;
    }, { paid: 0, unpaid: 0 });
    
    res.status(200).json(counts);
  } catch (err) {
    console.error("Get payment counts error:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * @desc    Get appointments with payment details for a doctor (FIXED VERSION)
 * @route   GET /api/payments/doctor/:doctorId/appointments/:paymentStatus
 */
// server/controllers/paymentController.js

const getAppointmentsByPaymentStatus = async (req, res) => {
  const { doctorId, paymentStatus } = req.params;
  try {
    let query;
    // PAID
    if (paymentStatus === 'paid') {
      query = `
        SELECT 
          a.*,
          ptable.first_name    AS patient_first_name,
          ptable.last_name     AS patient_last_name,
          ptable.phone_no      AS patient_phone,
          u.email              AS patient_email,
          ptable.address       AS patient_address,
          ptable.gender        AS patient_gender,
          ptable.date_of_birth AS date_of_birth,
          pay.payment_id,
          pay.amount,
          pay.payment_method,
          pay.payment_status,
          pay.transaction_id,
          pay.paid_time
        FROM appointment a
          JOIN patient ptable ON a.patient_id = ptable.patient_id
          JOIN "user" u     ON ptable.user_id = u.user_id
          JOIN payments pay ON a.appointment_id = pay.appointment_id
        WHERE a.doctor_id = $1
          AND a.status    = 'completed'
          AND pay.payment_status = 'paid'
        ORDER BY a.appointment_date ASC, a.appointment_time ASC
      `;
    } else {
    // UNPAID
      query = `
        SELECT 
          a.*,
          ptable.first_name    AS patient_first_name,
          ptable.last_name     AS patient_last_name,
          ptable.phone_no      AS patient_phone,
          u.email              AS patient_email,
          ptable.address       AS patient_address,
          ptable.gender        AS patient_gender,
          ptable.date_of_birth AS date_of_birth
        FROM appointment a
          JOIN patient ptable ON a.patient_id = ptable.patient_id
          JOIN "user" u     ON ptable.user_id = u.user_id
          LEFT JOIN payments pay ON a.appointment_id = pay.appointment_id
        WHERE a.doctor_id = $1
          AND a.status    = 'completed'
          AND (pay.payment_id IS NULL OR pay.payment_status != 'paid')
        ORDER BY a.appointment_date ASC, a.appointment_time ASC
      `;
    }
    const result = await pool.query(query, [doctorId]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Get appointments by payment status error:", err);
    res.status(500).json({ error: 'Server error' });
  }
};


/**
 * @desc    Get all payments (for admin)
 * @route   GET /api/payments
 */
const getAllPayments = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM payments ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Get all payments error:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * @desc    Get a single payment by its own ID
 * @route   GET /api/payments/:id
 */
const getPaymentById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM payments WHERE payment_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Get payment error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @desc    Get payment details for a specific appointment
 * @route   GET /api/payments/appointment/:appointmentId
 */
const getPaymentByAppointment = async (req, res) => {
  const { appointmentId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM payments WHERE appointment_id = $1', [appointmentId]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Get payment by appointment error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


/**
 * @desc Get revenue chart data for a doctor using PostgreSQL function
 * @route GET /api/payments/doctor/:doctorId/revenue-chart
 */
const getRevenueChart = async (req, res) => {
  const { doctorId } = req.params;
  const { range, startDate, endDate } = req.query;

  // Begin transaction
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    console.log('Fetching revenue chart for doctor:', doctorId, 'with range:', range);

    const result = await client.query(
      'SELECT * FROM get_doctor_revenue_chart($1, $2, $3, $4)',
      [doctorId, range || 'month', startDate || null, endDate || null]
    );

    console.log('Revenue chart query result:', result.rows.length, 'rows');

    // Process the results to match your frontend expectations
    const chartData = {
      labels: result.rows.map(row => row.period),
      values: result.rows.map(row => parseFloat(row.revenue || 0)),
      total: result.rows.length > 0 ? parseFloat(result.rows[0].total_revenue || 0) : 0
    };

    await client.query('COMMIT');
    
    res.status(200).json(chartData);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error("Get revenue chart error:", err);
    
    // Send more detailed error information
    res.status(500).json({ 
      error: 'Server error while generating revenue chart',
      details: err.message,
      code: err.code
    });
  } finally {
    client.release();
  }
};

/**
 * @desc Get revenue statistics for a doctor using PostgreSQL function
 * @route GET /api/payments/doctor/:doctorId/revenue-stats
 */
const getRevenueStats = async (req, res) => {
  const { doctorId } = req.params;
  const { range, startDate, endDate } = req.query;

  // Begin transaction
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    console.log('Fetching revenue stats for doctor:', doctorId, 'with range:', range);

    const result = await client.query(
      'SELECT * FROM get_doctor_revenue_stats($1, $2, $3, $4)',
      [doctorId, range || 'month', startDate || null, endDate || null]
    );

    await client.query('COMMIT');
    
    // Ensure we return valid numbers
    const stats = result.rows[0] || {};
    const cleanedStats = {
      today: parseFloat(stats.today || 0),
      this_week: parseFloat(stats.this_week || 0),
      this_month: parseFloat(stats.this_month || 0),
      this_year: parseFloat(stats.this_year || 0),
      today_change: parseFloat(stats.today_change || 0),
      week_change: parseFloat(stats.week_change || 0),
      month_change: parseFloat(stats.month_change || 0),
      year_change: parseFloat(stats.year_change || 0)
    };

    res.status(200).json(cleanedStats);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error("Get revenue stats error:", err);
    res.status(500).json({ 
      error: 'Server error while fetching revenue statistics',
      details: err.message,
      code: err.code
    });
  } finally {
    client.release();
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  getPaymentByAppointment,
  getPaymentCountsByDoctor,
  getAppointmentsByPaymentStatus,
  getRevenueStats,
  getRevenueChart,
};
