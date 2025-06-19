const pool = require('../db/connection');

// POST: Create new payment
exports.createPayment = async (req, res) => {
  const {
    appointment_id,
    amount,
    payment_method,
    payment_status,
    transaction_id,
    paid_time
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO payments 
      (appointment_id, amount, payment_method, transaction_id, paid_time)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [appointment_id, amount, payment_method, transaction_id, paid_time]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Create payment error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET: Payments by appointment
exports.getPaymentByAppointment = async (req, res) => {
  const { appointmentId } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM payments WHERE appointment_id = $1`,
      [appointmentId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Get payment error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  const { payment_id, new_status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE payments
       SET payment_status = $1
       WHERE payment_id = $2
       RETURNING *`,
      [new_status, payment_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Update payment status error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
