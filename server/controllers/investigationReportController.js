const pool = require('../db/connection');
const fs = require('fs');

/**
 * @route   POST /api/investigation-reports
 */
const createInvestigationReport = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No report file uploaded.' });
    }
    const { prescription_id, investigation_id, notes } = req.body;
    const { originalname, mimetype, path: filepath } = req.file;

    if (!prescription_id || !investigation_id) {
        return res.status(400).json({ error: 'prescription_id and investigation_id are required.' });
    }
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const pres_inv_check = await client.query(
            'SELECT * FROM prescription_investigation WHERE prescription_id = $1 AND investigation_id = $2',
            [prescription_id, investigation_id]
        );

        if (pres_inv_check.rows.length === 0) {
            await client.query('COMMIT');
            return res.status(404).json({ error: 'This investigation was not found on the specified prescription.' });
        }

        const result = await client.query(
            `INSERT INTO investigation_report (prescription_id, investigation_id, file_name, file_type, file_path, notes)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [prescription_id, investigation_id, originalname, mimetype, filepath, notes]
        );
        await client.query('COMMIT');
        res.status(201).json(result.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Error saving investigation report:", err);
        res.status(500).json({ error: 'Error saving report record' });
    } finally {
        client.release();
    }
};

/**
 * @route   GET /api/investigation-reports/prescription/:prescriptionId
 * Updated to include investigation_id in the response for proper matching
 */
const getReportsByPrescription = async (req, res) => {
    const { prescriptionId } = req.params;
    try {
        const result = await pool.query(
            `SELECT ir.report_id, ir.prescription_id, ir.investigation_id, ir.file_name, 
                    ir.file_type, ir.uploaded_at, ir.notes, i.name AS investigation_name
             FROM investigation_report ir
             JOIN investigation i ON ir.investigation_id = i.investigation_id
             WHERE ir.prescription_id = $1
             ORDER BY ir.uploaded_at DESC`,
            [prescriptionId]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching reports:", err);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @route   GET /api/investigation-reports/:id/download
 */
const downloadInvestigationReport = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT file_path, file_name FROM investigation_report WHERE report_id = $1', 
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Report not found.' });
        }
        const { file_path: filepath, file_name: filename } = result.rows[0];

        if (fs.existsSync(filepath)) {
            // Use the original filename for download
            res.download(filepath, filename);
        } else {
            res.status(404).json({ error: 'File not found on server storage.' });
        }
    } catch (err) {
        console.error("Error downloading report:", err);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @route   DELETE /api/investigation-reports/:id
 */
const deleteInvestigationReport = async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await client.query(
            'SELECT file_path FROM investigation_report WHERE report_id = $1', 
            [id]
        );
        if (result.rows.length === 0) {
            await client.query('COMMIT');
            return res.status(404).json({ error: 'Report not found.' });
        }
        const filepath = result.rows[0].file_path;

        // Delete the database record first
        await client.query('DELETE FROM investigation_report WHERE report_id = $1', [id]);
        
        // Then try to delete the physical file
        fs.unlink(filepath, (err) => {
            if (err) {
                console.error("Error deleting physical report file:", err.message);
                // Don't fail the request if file deletion fails
            }
        });
        await client.query('COMMIT');
        res.status(204).send();
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Error deleting report:", err);
        res.status(500).json({ error: 'Server error' });
    } finally {
        client.release();
    }
};

module.exports = {
    createInvestigationReport,
    getReportsByPrescription,
    downloadInvestigationReport,
    deleteInvestigationReport,
};
