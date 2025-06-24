const pool = require('../db/connection');

// @desc    Get all investigations
// @route   GET /api/investigations
const getAllInvestigations = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM investigation ORDER BY investigation_id ASC');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Get a single investigation by ID
// @route   GET /api/investigations/:id
const getInvestigationById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM investigation WHERE investigation_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Investigation not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Create a new investigation
// @route   POST /api/investigations
const createInvestigation = async (req, res) => {
    const { name, description } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is a required field.' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO investigation (name, description) VALUES ($1, $2) RETURNING *',
            [name, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Update an investigation
// @route   PATCH /api/investigations/:id
const updateInvestigation = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        const result = await pool.query(
            `UPDATE investigation SET name = COALESCE($1, name), description = COALESCE($2, description) 
             WHERE investigation_id = $3 RETURNING *`,
            [name, description, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Investigation not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Delete an investigation
// @route   DELETE /api/investigations/:id
const deleteInvestigation = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM investigation WHERE investigation_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Investigation not found.' });
        }
        res.status(204).send();
    } catch (err) {
        if (err.code === '23503') {
            return res.status(409).json({ error: 'Cannot delete. Investigation is used in a prescription.' });
        }
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllInvestigations,
    getInvestigationById,
    createInvestigation,
    updateInvestigation,
    deleteInvestigation,
};