const pool = require("../db/connection");

exports.createNotification = async (req, res) => {
  const {
    patient_id,
    doctor_id,
    appointment_id,
    prescription_id,
    notification_type,
    title,
    message,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO notifications 
       (patient_id, doctor_id, appointment_id, prescription_id, notification_type, title, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [patient_id, doctor_id, appointment_id, prescription_id, notification_type, title, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating notification:", err);
    res.status(500).json({ error: "Failed to create notification" });
  }
};

exports.getNotifications = async (req, res) => {
  const { userType, id } = req.params;
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
