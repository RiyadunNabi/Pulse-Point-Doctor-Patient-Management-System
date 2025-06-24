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

  try {
    // Check if a payment record for this appointment already exists
    const existingPayment = await pool.query('SELECT 1 FROM payments WHERE appointment_id = $1', [appointment_id]);
    if (existingPayment.rows.length > 0) {
      return res.status(409).json({ error: 'A payment record for this appointment already exists.' });
    }

    const result = await pool.query(
      `INSERT INTO payments (appointment_id, amount, payment_method, transaction_id)
             VALUES ($1, $2, $3, $4) RETURNING *`,
      [appointment_id, amount, payment_method, transaction_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Create payment error:", err);
    res.status(500).json({ error: 'Server error' });
  }
};


/**
 * @desc    Get all payments (e.g., for an admin dashboard)
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
 * @desc    Update a payment's status or details
 * @route   PATCH /api/payments/:id
 */
const updatePayment = async (req, res) => {
  const { id } = req.params;
  const { payment_status, transaction_id, paid_time } = req.body;

  // Validate the provided status
  if (payment_status) {
    const allowedStatuses = ['pending', 'success', 'failed', 'canceled', 'refunded'];
    if (!allowedStatuses.includes(payment_status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}` });
    }
  }

  try {
    const result = await pool.query(
      `UPDATE payments SET 
             payment_status = COALESCE($1, payment_status),
             transaction_id = COALESCE($2, transaction_id),
             paid_time = COALESCE($3, paid_time)
             WHERE payment_id = $4 RETURNING *`,
      [payment_status, transaction_id, paid_time, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Update payment error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  getPaymentByAppointment,
  updatePayment,
};