// server/controllers/doctorController.js

const pool = require('../db/connection');

// @route   GET /api/doctors
const getAllDoctors = async (req, res) => {
  const { 
    search, 
    department, 
    minFee, 
    maxFee, 
    minRating, 
    gender,
    sortBy = 'name',
    sortOrder = 'asc',
    page = 1,
    limit = 12
  } = req.query;

  try {
    // If no query parameters, use basic function for backward compatibility
    if (!search && !department && !minFee && !maxFee && !minRating && !gender && sortBy === 'name' && sortOrder === 'asc' && page == 1 && limit == 12) {
      const result = await pool.query('SELECT * FROM get_all_doctors_basic()');
      return res.status(200).json(result.rows);
    }

    // Use advanced function with filters
    const result = await pool.query(
      'SELECT * FROM get_doctors_with_filters($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [
        search || null,
        department || null,
        minFee || null,
        maxFee || null,
        minRating || null,
        gender || null,
        sortBy,
        sortOrder,
        parseInt(page),
        parseInt(limit)
      ]
    );

    const doctors = result.rows;
    const total = doctors.length > 0 ? parseInt(doctors[0].total_records) : 0;
    
    // Remove total_records from response
    const cleanDoctors = doctors.map(doctor => {
      const { total_records, ...cleanDoctor } = doctor;
      return cleanDoctor;
    });

    res.status(200).json({
      doctors: cleanDoctors,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @route   GET /api/doctors/departments
const getDepartmentsWithStats = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM get_departments_with_stats()');
    
    const departments = result.rows.map(dept => ({
      ...dept,
      doctor_count: parseInt(dept.doctor_count),
      avg_department_rating: dept.avg_department_rating ? parseFloat(dept.avg_department_rating).toFixed(1) : null,
      avg_consultation_fee: dept.avg_consultation_fee ? parseFloat(dept.avg_consultation_fee).toFixed(2) : null,
      min_consultation_fee: dept.min_consultation_fee ? parseFloat(dept.min_consultation_fee).toFixed(2) : null,
      max_consultation_fee: dept.max_consultation_fee ? parseFloat(dept.max_consultation_fee).toFixed(2) : null
    }));

    res.status(200).json(departments);
  } catch (err) {
    console.error("Error fetching departments:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @route   GET /api/doctors/:id
const getDoctorById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM get_doctor_by_id($1)', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Doctor not found." });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(`Error fetching doctor ${id}:`, err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @route   POST /api/doctors
const createDoctor = async (req, res) => {
  const { user_id, department_id, first_name, last_name, gender, phone_no, license_no, bio, consultation_fee, address } = req.body;

  if (!user_id || !department_id || !first_name || !last_name || !gender) {
    return res.status(400).json({ error: "user_id, department_id, first_name, last_name, and gender are required." });
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const userResult = await client.query('SELECT role FROM "user" WHERE user_id = $1', [user_id]);
    if (userResult.rows.length === 0) {
        return res.status(404).json({ error: `User with user_id ${user_id} not found.` });
    }
    if (userResult.rows[0].role !== 'doctor') {
        return res.status(403).json({ error: `User with user_id ${user_id} is not a doctor.` });
    }

    const doctorExists = await client.query('SELECT 1 FROM doctor WHERE user_id = $1', [user_id]);
    if (doctorExists.rows.length > 0) {
        return res.status(409).json({ error: `A doctor profile for user_id ${user_id} already exists.` });
    }
    
    const query = `
      INSERT INTO doctor (user_id, department_id, first_name, last_name, gender, phone_no, license_no, bio, consultation_fee, address)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING *
    `;
    const result = await client.query(query, [user_id, department_id, first_name, last_name, gender, phone_no, license_no, bio, consultation_fee, address]);
    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error("Error creating doctor:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
      client.release();
  }
};

// @route   PATCH /api/doctors/:id
const updateDoctor = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, gender, bio, consultation_fee, license_no, phone_no, address, department_id } = req.body;
  const client = await pool.connect();
  try {
    const query = `
      UPDATE doctor SET
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        gender = COALESCE($3, gender),
        bio = COALESCE($4, bio),
        consultation_fee = COALESCE($5, consultation_fee),
        license_no = COALESCE($6, license_no),
        phone_no = COALESCE($7, phone_no),
        address = COALESCE($8, address),
        department_id = COALESCE($9, department_id)
      WHERE doctor_id = $10
      RETURNING *
    `;
    const result = await client.query(query, [first_name, last_name, gender, bio, consultation_fee, license_no, phone_no, address, department_id, id]);

    if (result.rows.length === 0) {
      await client.query('COMMIT');
      return res.status(404).json({ error: "Doctor not found." });
    }

    // Get complete doctor data using the function
    const completeResult = await client.query('SELECT * FROM get_doctor_by_id($1)', [id]);
    await client.query('COMMIT');
    res.status(200).json(completeResult.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(`Error updating doctor ${id}:`, err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
     client.release();
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  getDepartmentsWithStats,
};