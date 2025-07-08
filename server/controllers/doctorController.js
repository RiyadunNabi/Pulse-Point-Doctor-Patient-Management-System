const pool = require('../db/connection');

// @route   GET /api/doctors
const getAllDoctors = async (req, res) => {
  try {
    const query = `
      SELECT 
        d.doctor_id, d.first_name, d.last_name, d.avg_rating,
        dep.department_name,
        u.email,
        u.is_active
      FROM doctor d
      JOIN "user" u ON d.user_id = u.user_id
      JOIN department dep ON d.department_id = dep.department_id
      WHERE u.is_active = true
      AND dep.department_name != 'Unassigned'
      ORDER BY d.doctor_id ASC
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


// @route   GET /api/doctors/:id
const getDoctorById = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT 
        d.doctor_id, d.first_name, d.last_name, d.gender, d.bio, d.consultation_fee,
        d.license_no, d.phone_no, d.address, d.avg_rating,
        u.email, u.is_active,
        dep.department_name
      FROM doctor d
      JOIN "user" u ON d.user_id = u.user_id
      JOIN department dep ON d.department_id = dep.department_id
      WHERE d.doctor_id = $1
    `;
    const result = await pool.query(query, [id]);

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

  try {
    const userResult = await pool.query('SELECT role FROM "user" WHERE user_id = $1', [user_id]);
    if (userResult.rows.length === 0) {
        return res.status(404).json({ error: `User with user_id ${user_id} not found.` });
    }
    if (userResult.rows[0].role !== 'doctor') {
        return res.status(403).json({ error: `User with user_id ${user_id} is not a doctor.` });
    }


    const doctorExists = await pool.query('SELECT 1 FROM doctor WHERE user_id = $1', [user_id]);
    if (doctorExists.rows.length > 0) {
        return res.status(409).json({ error: `A doctor profile for user_id ${user_id} already exists.` });
    }
    
    const query = `
      INSERT INTO doctor (user_id, department_id, first_name, last_name, gender, phone_no, license_no, bio, consultation_fee, address)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING *
    `;
    const result = await pool.query(query, [user_id, department_id, first_name, last_name, gender, phone_no, license_no, bio, consultation_fee, address]);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating doctor:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @route   PATCH /api/doctors/:id
const updateDoctor = async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, gender, bio, consultation_fee, license_no, phone_no, address, department_id } = req.body;

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
        const result = await pool.query(query, [first_name, last_name, gender, bio, consultation_fee, license_no, phone_no, address, department_id, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Doctor not found." });
        }

        // Get complete doctor data with department name for frontend
        const completeQuery = `
          SELECT 
            d.doctor_id, d.first_name, d.last_name, d.gender, d.bio, d.consultation_fee,
            d.license_no, d.phone_no, d.address, d.avg_rating, d.department_id,
            u.email, u.is_active,
            dep.department_name
          FROM doctor d
          JOIN "user" u ON d.user_id = u.user_id
          JOIN department dep ON d.department_id = dep.department_id
          WHERE d.doctor_id = $1
        `;
        const completeResult = await pool.query(completeQuery, [id]);

        res.status(200).json(completeResult.rows[0]);
    } catch (err) {
        console.error(`Error updating doctor ${id}:`, err);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
};