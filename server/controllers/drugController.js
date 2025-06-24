const pool = require('../db/connection');

/**
 * @desc    Get all drugs, with optional search
 * @route   GET /api/drugs
 */
const getAllDrugs = async (req, res) => {
    const { search } = req.query;
    try {
        let query = 'SELECT * FROM drug';
        const queryParams = [];

        if (search) {
            // Use ILIKE for case-insensitive search
            query += ' WHERE drug_name ILIKE $1';
            queryParams.push(`%${search}%`);
        }
        
        query += ' ORDER BY drug_name ASC';

        const result = await pool.query(query, queryParams);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching drugs:", err);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @desc    Get a single drug by ID
 * @route   GET /api/drugs/:id
 */
const getDrugById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM drug WHERE drug_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Drug not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error fetching drug:", err);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @desc    Create a new drug
 * @route   POST /api/drugs
 */
const createDrug = async (req, res) => {
    const { drug_name, dosage_form, strength, additional_notes } = req.body;
    if (!drug_name) {
        return res.status(400).json({ error: 'drug_name is a required field.' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO drug (drug_name, dosage_form, strength, additional_notes) VALUES ($1, $2, $3, $4) RETURNING *',
            [drug_name, dosage_form, strength, additional_notes]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error adding drug:", err);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @desc    Update a drug
 * @route   PATCH /api/drugs/:id
 */
const updateDrug = async (req, res) => {
    const { id } = req.params;
    const { drug_name, dosage_form, strength, additional_notes } = req.body;
    try {
        const result = await pool.query(
            `UPDATE drug SET 
             drug_name = COALESCE($1, drug_name), 
             dosage_form = COALESCE($2, dosage_form),
             strength = COALESCE($3, strength),
             additional_notes = COALESCE($4, additional_notes)
             WHERE drug_id = $5 RETURNING *`,
            [drug_name, dosage_form, strength, additional_notes, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Drug not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error updating drug:", err);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @desc    Delete a drug
 * @route   DELETE /api/drugs/:id
 */
const deleteDrug = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM drug WHERE drug_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Drug not found.' });
        }
        res.status(204).send();
    } catch (err) {
        // Handles foreign key violation if drug is in use
        if (err.code === '23503') {
            return res.status(409).json({ error: 'Cannot delete. Drug is used in a prescription.' });
        }
        console.error("Error deleting drug:", err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllDrugs,
    getDrugById,
    createDrug,
    updateDrug,
    deleteDrug,
};