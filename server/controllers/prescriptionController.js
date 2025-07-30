const pool = require('../db/connection');

// @desc    Create a new prescription with drugs and investigations
// @route   POST /api/prescriptions
const createPrescription = async (req, res) => {
    const { appointment_id, diagnosis, instructions, other_drugs, drugs, investigations } = req.body;

    if (!appointment_id || !diagnosis) {
        return res.status(400).json({ error: 'appointment_id and diagnosis are required.' });
    }

    const client = await pool.connect();
    try {
        // Check if a prescription for this appointment already exists before doing anything else.
        const existingPrescription = await client.query('SELECT 1 FROM prescription WHERE appointment_id = $1', [appointment_id]);
        if (existingPrescription.rows.length > 0) {
            // Use a 409 Conflict status code, which is appropriate for a duplicate resource attempt.
            return res.status(409).json({ error: 'A prescription for this appointment already exists.' });
        }

        // If the check passes, proceed with the transaction.
        await client.query('BEGIN');

        // Step 1: Insert into the main prescription table
        const prescriptionQuery = `
            INSERT INTO prescription (appointment_id, diagnosis, instructions, other_drugs)
            VALUES ($1, $2, $3, $4)
            RETURNING prescription_id
        `;
        const prescriptionResult = await client.query(prescriptionQuery, [appointment_id, diagnosis, instructions, other_drugs]);
        const { prescription_id } = prescriptionResult.rows[0];

        // Step 2: Insert into prescription_drug
        if (drugs && drugs.length > 0) {
            for (const drug of drugs) {
                const drugQuery = `
                    INSERT INTO prescription_drug (prescription_id, drug_id, dosages, frequency_per_day, duration, additional_notes)
                    VALUES ($1, $2, $3, $4, $5, $6)
                `;
                await client.query(drugQuery, [prescription_id, drug.drug_id, drug.dosages, drug.frequency_per_day, drug.duration, drug.additional_notes]);
            }
        }

        // Step 3: Insert into prescription_investigation
        if (investigations && investigations.length > 0) {
            for (const inv of investigations) {
                const invQuery = `
                    INSERT INTO prescription_investigation (prescription_id, investigation_id, notes)
                    VALUES ($1, $2, $3)
                `;
                await client.query(invQuery, [prescription_id, inv.investigation_id, inv.notes]);
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ message: "Prescription created successfully.", prescription_id: prescription_id });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Error creating prescription:", err);
        res.status(500).json({ error: 'Failed to create prescription. Transaction was rolled back.' });
    } finally {
        client.release();
    }
};

// @desc    Get a full prescription by its appointment ID
// @route   GET /api/prescriptions/appointment/:appointmentId
const getPrescriptionByAppointmentId = async (req, res) => {
    const { appointmentId } = req.params;
    try {
        // Query 1: Get main prescription details
        const presResult = await pool.query(
            `SELECT * FROM prescription 
             WHERE appointment_id = $1 
             ORDER BY prescription_id DESC 
             LIMIT 1`, // We also add LIMIT 1 for efficiency
            [appointmentId]
        );
        if (presResult.rows.length === 0) {
            return res.status(404).json({ error: "Prescription not found for this appointment." });
        }
        const prescription = presResult.rows[0];
        const { prescription_id } = prescription;

        // Query 2: Get prescribed drugs
        const drugsResult = await pool.query(
            `SELECT d.drug_name, pd.* FROM prescription_drug pd 
             JOIN drug d ON pd.drug_id = d.drug_id
             WHERE pd.prescription_id = $1`, [prescription_id]);

        // Query 3: Get prescribed investigations
        const invResult = await pool.query(
            `SELECT i.name, pi.* FROM prescription_investigation pi
             JOIN investigation i ON pi.investigation_id = i.investigation_id
             WHERE pi.prescription_id = $1`, [prescription_id]);

        // Combine into a single response object
        const fullPrescription = {
            ...prescription,
            drugs: drugsResult.rows,
            investigations: invResult.rows
        };

        res.status(200).json(fullPrescription);
    } catch (err) {
        console.error('Error fetching prescription:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Update a prescription's main details
// @route   PATCH /api/prescriptions/:id
const updatePrescription = async (req, res) => {
    const { id } = req.params;
    const { diagnosis, instructions, other_drugs } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await client.query(
            `UPDATE prescription SET 
             diagnosis = COALESCE($1, diagnosis), 
             instructions = COALESCE($2, instructions),
             other_drugs = COALESCE($3, other_drugs)
             WHERE prescription_id = $4 RETURNING *`,
            [diagnosis, instructions, other_drugs, id]
        );
        if (result.rows.length === 0) {
            await client.query('COMMIT');
            return res.status(404).json({ error: "Prescription not found." });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        await client.query('COMMIT');
        console.error('Error updating prescription:', err);
        res.status(500).json({ error: 'Server error' });
    } finally {
        client.release();
    }
};


module.exports = {
    createPrescription,
    getPrescriptionByAppointmentId,
    updatePrescription,
};