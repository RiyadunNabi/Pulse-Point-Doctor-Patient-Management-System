const pool = require('../db/connection');

exports.createReview = async (req, res) => {
  const { appointment_id, ratings, review_text } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO reviews (appointment_id, ratings, review_text) 
       VALUES ($1, $2, $3) RETURNING *`,
      [appointment_id, ratings, review_text]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getReviewsByAppointment = async (req, res) => {
  const appointmentId = req.params.id;
  try {
    const result = await pool.query(
      `SELECT * FROM reviews WHERE appointment_id = $1`,
      [appointmentId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
