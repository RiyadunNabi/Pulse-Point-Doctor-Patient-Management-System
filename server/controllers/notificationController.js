const pool = require('../db/connection');

/**
 * @desc    Create a new notification
 * @route   POST /api/notifications
 */
const createNotification = async (req, res) => {
    const { patient_id, doctor_id, appointment_id, prescription_id, notification_type, title, message } = req.body;
    if (!notification_type || !title || !message || !(patient_id || doctor_id)) {
        return res.status(400).json({ error: 'notification_type, title, message, and a recipient (patient_id or doctor_id) are required.' });
    }
    try {
        const result = await pool.query(
            `INSERT INTO notifications (patient_id, doctor_id, appointment_id, prescription_id, notification_type, title, message)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [patient_id, doctor_id, appointment_id, prescription_id, notification_type, title, message]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error creating notification:", err);
        res.status(500).json({ error: "Failed to create notification" });
    }
};

/**
 * @desc    Get all notifications for a specific user (patient or doctor)
 * @route   GET /api/notifications/:userType/:id
 */
const getNotifications = async (req, res) => {
    const { userType, id } = req.params;
    // Safely determine the column name to prevent SQL injection
    const column = userType === "doctor" ? "doctor_id" : "patient_id";

    try {
        const result = await pool.query(
            `SELECT * FROM notifications WHERE ${column} = $1 ORDER BY time DESC`,
            [id]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching notifications:", err);
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
};

/**
 * @desc    Mark a single notification as read
 * @route   PATCH /api/notifications/:id
 */
const markNotificationAsRead = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'UPDATE notifications SET is_read = true WHERE notification_id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Notification not found." });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error updating notification:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/**
 * @desc    Get unread count for a specific user
 * @route   GET /api/notifications/:userType/:id/unread-count
 */
const getUnreadCount = async (req, res) => {
  const { userType, id } = req.params;
  const column = userType === 'doctor' ? 'doctor_id' : 'patient_id';
  try {
    const { rows } = await pool.query(
      `SELECT COUNT(*)::int AS count
       FROM notifications
       WHERE ${column} = $1
         AND is_read = FALSE`,
      [id]
    );
    res.json({ count: rows[0].count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
};

/**
 * @desc    Delete a single notification
 * @route   DELETE /api/notifications/:id
 */
const deleteNotification = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM notifications WHERE notification_id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Notification not found." });
        }
        res.status(204).send();
    } catch (err) {
        console.error("Error deleting notification:", err);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    createNotification,
    getNotifications,
    markNotificationAsRead,
    getUnreadCount,
    deleteNotification,
};