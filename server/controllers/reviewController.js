const pool = require('../db/connection');

const updateDoctorAverageRating = async (doctorId) => {
    try {
        const ratingResult = await pool.query(
            `SELECT AVG(r.ratings) as average_rating
             FROM reviews r
             JOIN appointment a ON r.appointment_id = a.appointment_id
             WHERE a.doctor_id = $1`,
            [doctorId]
        );
        
        // The result from AVG can be null if there are no reviews.
        const newAverage = ratingResult.rows[0].average_rating || null;
        
        await pool.query(
            'UPDATE doctor SET avg_rating = $1 WHERE doctor_id = $2',
            [newAverage, doctorId]
        );
    } catch (err) {
        console.error(`Failed to update average rating for doctor ${doctorId}:`, err);
    }
};


// @desc    Create a new review for a completed appointment
// @route   POST /api/reviews
exports.createReview = async (req, res) => {
    const { appointment_id, ratings, review_text } = req.body;

    if (!appointment_id || !ratings) {
        return res.status(400).json({ error: 'appointment_id and ratings are required.' });
    }

    try {
        // Validation 1: Check if the appointment exists and is 'completed'
        const apptResult = await pool.query(
            'SELECT status, doctor_id FROM appointment WHERE appointment_id = $1', 
            [appointment_id]
        );
        if (apptResult.rows.length === 0) {
            return res.status(404).json({ error: 'Appointment not found.' });
        }
        if (apptResult.rows[0].status !== 'completed') {
            return res.status(403).json({ error: 'Reviews can only be submitted for completed appointments.' });
        }

        // Validation 2: Check if this appointment has already been reviewed
        const existingReview = await pool.query('SELECT 1 FROM reviews WHERE appointment_id = $1', [appointment_id]);
        if (existingReview.rows.length > 0) {
            return res.status(409).json({ error: 'This appointment has already been reviewed.' });
        }

        // All checks passed, create the review
        const result = await pool.query(
            `INSERT INTO reviews (appointment_id, ratings, review_text) VALUES ($1, $2, $3) RETURNING *`,
            [appointment_id, ratings, review_text]
        );
        
        // Trigger the rating update
        const doctorId = apptResult.rows[0].doctor_id;
        await updateDoctorAverageRating(doctorId);
        
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating review:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Get all reviews for a specific DOCTOR
// @route   GET /api/reviews/doctor/:doctorId
exports.getReviewsByDoctor = async (req, res) => {
    const { doctorId } = req.params;
    try {
        const result = await pool.query(
            `SELECT r.*, p.first_name, p.last_name 
             FROM reviews r
             JOIN appointment a ON r.appointment_id = a.appointment_id
             JOIN patient p ON a.patient_id = p.patient_id
             WHERE a.doctor_id = $1
             ORDER BY r.created_at DESC`,
            [doctorId]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching doctor reviews:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Update a review
// @route   PATCH /api/reviews/:id
exports.updateReview = async (req, res) => {
    const { id } = req.params;
    const { ratings, review_text } = req.body;

    if (!ratings && !review_text) {
        return res.status(400).json({ error: "Ratings or review_text must be provided." });
    }

    try {
        // First, get the doctor_id associated with this review for the rating update later
        const reviewData = await pool.query(
            `SELECT a.doctor_id FROM reviews r JOIN appointment a ON r.appointment_id = a.appointment_id WHERE r.review_id = $1`,
            [id]
        );
        if (reviewData.rows.length === 0) {
            return res.status(404).json({ error: "Review not found." });
        }
        const doctorId = reviewData.rows[0].doctor_id;

        const result = await pool.query(
            `UPDATE reviews SET 
             ratings = COALESCE($1, ratings), 
             review_text = COALESCE($2, review_text) 
             WHERE review_id = $3 RETURNING *`,
            [ratings, review_text, id]
        );
        
        // Trigger rating update
        await updateDoctorAverageRating(doctorId);

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error updating review:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {
    const { id } = req.params;
    try {
        const reviewData = await pool.query(
            `SELECT a.doctor_id FROM reviews r JOIN appointment a ON r.appointment_id = a.appointment_id WHERE r.review_id = $1`,
            [id]
        );
        if (reviewData.rows.length === 0) {
            return res.status(404).json({ error: "Review not found." });
        }
        const doctorId = reviewData.rows[0].doctor_id;

        await pool.query('DELETE FROM reviews WHERE review_id = $1', [id]);
        
        // Trigger rating update
        await updateDoctorAverageRating(doctorId);

        res.status(204).send();
    } catch (err) {
        console.error('Error deleting review:', err);
        res.status(500).json({ error: 'Server error' });
    }
};