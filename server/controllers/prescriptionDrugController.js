const pool = require('../db/connection');

/**
 * @desc    Add a drug to an existing prescription
 * @route   POST /api/prescription-drugs
 */
const addDrugToPrescription = async (req, res) => {
    const { prescription_id, drug_id, dosages, frequency_per_day, duration, additional_notes } = req.body;
    if (!prescription_id || !drug_id || !dosages) {
        return res.status(400).json({ error: 'prescription_id, drug_id, and dosages are required.' });
    }
    try {
        const result = await pool.query(
            `INSERT INTO prescription_drug (prescription_id, drug_id, dosages, frequency_per_day, duration, additional_notes)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [prescription_id, drug_id, dosages, frequency_per_day, duration, additional_notes]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        // Handles unique constraint violation (e.g., adding the same drug twice)
        if (err.code === '23505') {
            return res.status(409).json({ error: 'This drug has already been added to the prescription.' });
        }
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @desc    Get all drugs for a specific prescription
 * @route   GET /api/prescription-drugs/prescription/:prescriptionId
 */
const getDrugsByPrescription = async (req, res) => {
    const { prescriptionId } = req.params;
    try {
        const result = await pool.query(
            `SELECT pd.*, d.drug_name, d.strength
             FROM prescription_drug pd
             JOIN drug d ON pd.drug_id = d.drug_id
             WHERE pd.prescription_id = $1`,
            [prescriptionId]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @desc    Update details of a drug on a prescription
 * @route   PATCH /api/prescription-drugs/prescription/:prescriptionId/drug/:drugId
 */
const updatePrescribedDrug = async (req, res) => {
    const { prescriptionId, drugId } = req.params;
    const { dosages, frequency_per_day, duration, additional_notes } = req.body;
    try {
        const result = await pool.query(
            `UPDATE prescription_drug SET 
             dosages = COALESCE($1, dosages), 
             frequency_per_day = COALESCE($2, frequency_per_day),
             duration = COALESCE($3, duration),
             additional_notes = COALESCE($4, additional_notes)
             WHERE prescription_id = $5 AND drug_id = $6 RETURNING *`,
            [dosages, frequency_per_day, duration, additional_notes, prescriptionId, drugId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Prescribed drug not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @desc    Remove a drug from a prescription
 * @route   DELETE /api/prescription-drugs/prescription/:prescriptionId/drug/:drugId
 */
const removeDrugFromPrescription = async (req, res) => {
    const { prescriptionId, drugId } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM prescription_drug WHERE prescription_id = $1 AND drug_id = $2 RETURNING *',
            [prescriptionId, drugId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Prescribed drug not found.' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    addDrugToPrescription,
    getDrugsByPrescription,
    updatePrescribedDrug,
    removeDrugFromPrescription,
};