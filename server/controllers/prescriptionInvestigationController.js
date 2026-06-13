const pool = require('../db/connection');

// @desc    Add an investigation to an existing prescription
// @route   POST /api/prescription-investigations
const addInvestigationToPrescription = async (req, res) => {
    const { prescription_id, investigation_id, notes } = req.body;
    if (!prescription_id || !investigation_id) {
        return res.status(400).json({ error: 'prescription_id and investigation_id are required.' });
    }
    try {
        const result = await pool.query(
            `INSERT INTO prescription_investigation (prescription_id, investigation_id, notes)
             VALUES ($1, $2, $3) RETURNING *`,
            [prescription_id, investigation_id, notes]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') { // Handles unique constraint violation
            return res.status(409).json({ error: 'This investigation has already been added to the prescription.' });
        }
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Get all investigations for a prescription
// @route   GET /api/prescription-investigations/prescription/:prescriptionId
const getInvestigationsByPrescription = async (req, res) => {
    const { prescriptionId } = req.params;
    try {
        const result = await pool.query(
            `SELECT pi.*, i.name, i.description
             FROM prescription_investigation pi
             JOIN investigation i ON pi.investigation_id = i.investigation_id
             WHERE pi.prescription_id = $1`,
            [prescriptionId]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Update notes for a prescribed investigation
// @route   PATCH /api/prescription-investigations/prescription/:prescriptionId/investigation/:investigationId
const updateInvestigationNotes = async (req, res) => {
    const { prescriptionId, investigationId } = req.params;
    const { notes } = req.body;
    try {
        const result = await pool.query(
            `UPDATE prescription_investigation SET notes = $1 
             WHERE prescription_id = $2 AND investigation_id = $3 RETURNING *`,
            [notes, prescriptionId, investigationId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Prescribed investigation not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Remove an investigation from a prescription
// @route   DELETE /api/prescription-investigations/prescription/:prescriptionId/investigation/:investigationId
const removeInvestigationFromPrescription = async (req, res) => {
    const { prescriptionId, investigationId } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM prescription_investigation WHERE prescription_id = $1 AND investigation_id = $2 RETURNING *',
            [prescriptionId, investigationId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Prescribed investigation not found.' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    addInvestigationToPrescription,
    getInvestigationsByPrescription,
    updateInvestigationNotes,
    removeInvestigationFromPrescription,
};