const pool = require('../db/connection');
const fs = require('fs');

// // createPrescriptionFile and getFilesByPrescription are mostly the same
// const createPrescriptionFile = async (req, res) => {
//     if (!req.file) {
//         return res.status(400).json({ error: 'No file uploaded.' });
//     }
//     const { prescription_id } = req.body;
//     const { originalname, mimetype, path } = req.file;

//     if (!prescription_id) {
//         return res.status(400).json({ error: 'prescription_id is required.' });
//     }
//     try {
//         const result = await pool.query(
//             `INSERT INTO prescription_file (prescription_id, file_name, file_type, filepath)
//              VALUES ($1, $2, $3, $4) RETURNING *`,
//             [prescription_id, originalname, mimetype, path]
//         );
//         res.status(201).json(result.rows[0]);
//     } catch (err) {
//         console.error("Error saving prescription file record:", err);
//         res.status(500).json({ error: 'Error saving file record' });
//     }
// };

// Updated to handle multiple files
const createPrescriptionFiles = async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded.' });
    }
    
    const { prescription_id } = req.body;
    
    if (!prescription_id) {
        return res.status(400).json({ error: 'prescription_id is required.' });
    }

    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        const uploadedFiles = [];
        
        for (const file of req.files) {
            const { originalname, mimetype, path } = file;
            
            const result = await client.query(
                `INSERT INTO prescription_file (prescription_id, file_name, file_type, filepath)
                 VALUES ($1, $2, $3, $4) RETURNING *`,
                [prescription_id, originalname, mimetype, path]
            );
            
            uploadedFiles.push(result.rows[0]);
        }
        
        await client.query('COMMIT');
        res.status(201).json(uploadedFiles);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Error saving prescription files:", err);
        res.status(500).json({ error: 'Error saving file records' });
    } finally {
        client.release();
    }
};

const getFilesByPrescription = async (req, res) => {
    const { prescriptionId } = req.params;
    try {
        const result = await pool.query(
            `SELECT file_id, file_name, file_type, uploaded_time FROM prescription_file WHERE prescription_id = $1`,
            [prescriptionId]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching prescription files:", err);
        res.status(500).json({ error: 'Server error' });
    }
};

// --- THE FIX IS HERE (SIMPLIFIED CODE) ---

// @desc    Download a specific file
const downloadPrescriptionFile = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT filepath FROM prescription_file WHERE file_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'File record not found.' });
        }
        const filepath = result.rows[0].filepath; // This is now an absolute path

        if (fs.existsSync(filepath)) {
            res.download(filepath); // Use the path directly
        } else {
            res.status(404).json({ error: 'File not found on server storage.' });
        }
    } catch (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Delete a file record and the physical file
const deletePrescriptionFile = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT filepath FROM prescription_file WHERE file_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'File record not found.' });
        }
        const filepath = result.rows[0].filepath; // This is now an absolute path

        // Delete the physical file using the absolute path directly from the DB
        fs.unlink(filepath, async (err) => {
            if (err) {
                console.error("Error deleting physical file:", err.message);
            }
            await pool.query('DELETE FROM prescription_file WHERE file_id = $1', [id]);
            res.status(204).send();
        });
    } catch (err) {
        console.error("Error deleting file record:", err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    // createPrescriptionFile,
    createPrescriptionFiles,
    getFilesByPrescription,
    downloadPrescriptionFile,
    deletePrescriptionFile,
};