const pool = require('../db/connection');
const fs = require('fs');

/*
 * @route   POST /api/medical-documents
 */
const createMedicalDocument = async (req, res) => {
    console.log('=== MEDICAL DOCUMENT UPLOAD DEBUG ===');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    console.log('Headers content-type:', req.headers['content-type']);

    if (!req.file) {
        return res.status(400).json({ error: 'No document file uploaded.' });
    }
    const { patient_id, description, last_checkup_date } = req.body;
    const { originalname, path: filepath } = req.file;

    if (!last_checkup_date) {
        return res
            .status(400)
            .json({ error: 'last_checkup_date is required.' });
    }

    console.log('File details:', { originalname, filepath, size: req.file.size });
    console.log('Form data:', { patient_id, description, last_checkup_date });

    if (!patient_id) {
        return res.status(400).json({ error: 'patient_id is required.' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO medical_documents (patient_id, file_name, file_path, description, last_checkup_date)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [patient_id, originalname, filepath, description, last_checkup_date]
        );
        console.log('Database insert successful:', result.rows[0]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error creating medical document:", err);
        res.status(500).json({ error: "Failed to create medical document" });
    }
};

/**
 * @route   GET /api/medical-documents/patient/:patientId
 */
const getDocumentsByPatient = async (req, res) => {
    const { patientId } = req.params;
    try {
        const result = await pool.query(
            `SELECT document_id, file_name, description, upload_date FROM medical_documents WHERE patient_id = $1 ORDER BY upload_date DESC`,
            [patientId]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching documents:", err);
        res.status(500).json({ error: "Failed to fetch medical documents" });
    }
};

/**
 * @route   PATCH /api/medical-documents/:id
 */
const updateMedicalDocument = async (req, res) => {
    const { id } = req.params;
    const { description, last_checkup_date } = req.body;
    try {
        const result = await pool.query(
            `UPDATE medical_documents
             SET description = COALESCE($1, description),
                 last_checkup_date = COALESCE($2, last_checkup_date),
                 updated_at = CURRENT_TIMESTAMP
             WHERE document_id = $3 RETURNING *`,
            [description, last_checkup_date, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Document not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error updating medical document:", err);
        res.status(500).json({ error: "Failed to update medical document" });
    }
};

/*
 * @route   GET /api/medical-documents/:id/download
 */
const downloadMedicalDocument = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT file_path FROM medical_documents WHERE document_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Document not found.' });
        }
        const filepath = result.rows[0].file_path;

        if (fs.existsSync(filepath)) {
            res.download(filepath);
        } else {
            res.status(404).json({ error: 'File not found on server storage.' });
        }
    } catch (err) {
        console.error("Error downloading document:", err);
        res.status(500).json({ error: 'Server error' });
    }
};

/*
 * @route   DELETE /api/medical-documents/:id
 */
const deleteMedicalDocument = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM medical_documents WHERE document_id = $1 RETURNING file_path', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Document not found" });
        }

        const filepath = result.rows[0].file_path;
        if (filepath && fs.existsSync(filepath)) {
            fs.unlink(filepath, (err) => {
                if (err) console.error("Error deleting document file:", err);
            });
        }

        res.status(204).send();
    } catch (err) {
        console.error("Error deleting medical document:", err);
        res.status(500).json({ error: "Failed to delete medical document" });
    }
};

module.exports = {
    createMedicalDocument,
    getDocumentsByPatient,
    updateMedicalDocument,
    downloadMedicalDocument,
    deleteMedicalDocument,
};