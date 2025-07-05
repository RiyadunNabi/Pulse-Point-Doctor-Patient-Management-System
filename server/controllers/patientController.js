const pool = require('../db/connection');

// @desc    Get all active patients
// @route   GET /api/patients
const getAllPatients = async (req, res) => {
  try {
    const query = `
      SELECT p.patient_id, p.first_name, p.last_name, p.gender, p.phone_no, u.email, u.is_active
      FROM patient p
      JOIN "user" u ON p.user_id = u.user_id
      WHERE u.is_active = true
      ORDER BY p.patient_id ASC
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching patients:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Get a single patient's profile by ID
// @route   GET /api/patients/:id
const getPatientById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid patient ID format." });
  }
  
  try {
    const query = `
      SELECT 
        p.patient_id, p.first_name, p.last_name, p.gender, p.date_of_birth, p.phone_no, 
        p.address, p.blood_group, p.health_condition,
        u.email, u.is_active
      FROM patient p
      JOIN "user" u ON p.user_id = u.user_id
      WHERE p.patient_id = $1
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Patient not found." });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(`Error fetching patient ${id}:`, err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Create a new patient profile
// @route   POST /api/patients
const createPatient = async (req, res) => {
  const { user_id, first_name, last_name, gender, date_of_birth, phone_no, address, blood_group, health_condition } = req.body;

  if (!user_id || !first_name || !last_name || !gender || !date_of_birth) {
    return res.status(400).json({ error: "user_id, first_name, last_name, gender, and date_of_birth are required." });
  }

  try {
    // Check 1: Verify the user exists and has the 'patient' role
    const userResult = await pool.query('SELECT role FROM "user" WHERE user_id = $1', [user_id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: `User with user_id ${user_id} not found.` });
    }
    if (userResult.rows[0].role !== 'patient') {
      return res.status(403).json({ error: `User with user_id ${user_id} is not a patient.` });
    }

    // Check 2: Verify a patient profile for this user doesn't already exist
    const patientExists = await pool.query('SELECT 1 FROM patient WHERE user_id = $1', [user_id]);
    if (patientExists.rows.length > 0) {
      return res.status(409).json({ error: `A patient profile for user_id ${user_id} already exists.` });
    }

    const query = `
      INSERT INTO patient (user_id, first_name, last_name, gender, date_of_birth, phone_no, address, blood_group, health_condition)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const result = await pool.query(query, [user_id, first_name, last_name, gender, date_of_birth, phone_no, address, blood_group, health_condition]);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating patient:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Update a patient's profile
// @route   PATCH /api/patients/:id
const updatePatient = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { first_name, last_name, gender, date_of_birth, phone_no, address, blood_group, health_condition } = req.body;
    
  // Add debugging logs ==========================================================================
  console.log('=== UPDATE PATIENT DEBUG ===');
  console.log('Patient ID:', id);
  console.log('Request body:', req.body);
  console.log('Extracted fields:', { first_name, last_name, gender, date_of_birth, phone_no, address, blood_group, health_condition });
  //==============================================================================================
  try {
    const query = `
      UPDATE patient SET
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        gender = COALESCE($3, gender),
        date_of_birth = COALESCE($4, date_of_birth),
        phone_no = COALESCE($5, phone_no),
        address = COALESCE($6, address),
        blood_group = COALESCE($7, blood_group),
        health_condition = COALESCE($8, health_condition)
      WHERE patient_id = $9
      RETURNING *
    `;
    const result = await pool.query(query, [first_name, last_name, gender, date_of_birth, phone_no, address, blood_group, health_condition, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Patient not found." });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(`Error updating patient ${id}:`, err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
};