const pool = require('../db/connection');

/**
 * GET /api/appointments/:appointmentId/shared-health-log
 * Return the **single** health-log record the patient chose to share
 */
const getSharedHealthLog = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    // Each appointment can reference at most **one** shared log.
    // If multiple ever exist, pick the most recent one.
    const { rows } = await pool.query(
      `
      SELECT hl.*
      FROM appointment_health_logs     ahl
      JOIN  health_logs                hl  ON ahl.health_log_id = hl.log_id
      WHERE ahl.appointment_id = $1
      ORDER BY hl.created_at DESC       -- just in case
      LIMIT 1
      `,
      [appointmentId]
    );

    res.status(200).json(rows[0] || null);
  } catch (err) {
    console.error('getSharedHealthLog error:', err);
    res.status(500).json({ error: 'Failed to fetch shared health log' });
  }
};

/**
 * GET /api/appointments/:appointmentId/shared-documents
 * Return **only** the documents the patient explicitly shared
 */
const getSharedDocuments = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const { rows } = await pool.query(
      `
      SELECT md.*
      FROM appointment_documents       ad
      JOIN  medical_documents          md  ON ad.document_id = md.document_id
      WHERE ad.appointment_id = $1
      ORDER BY md.upload_date DESC
      `,
      [appointmentId]
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error('getSharedDocuments error:', err);
    res.status(500).json({ error: 'Failed to fetch shared documents' });
  }
};

module.exports = {
  getSharedHealthLog,
  getSharedDocuments
};
