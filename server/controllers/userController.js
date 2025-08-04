const pool = require('../db/connection');
const bcrypt = require('bcryptjs');

// GET /api/users
const getUsers = async (req, res) => {
    try {
        const query = 'SELECT user_id, username, email, role, is_active, created_at FROM "user"';
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// POST /api/users
const createUser = async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
        return res.status(400).json({ error: "Please provide all required fields." });
    }

    // Start database transaction
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user first
        const userQuery = `
            INSERT INTO "user" (username, email, password, role) 
            VALUES ($1, $2, $3, $4) 
            RETURNING user_id, username, email, role, created_at
        `;
        const userResult = await client.query(userQuery, [username, email, hashedPassword, role]);
        const newUser = userResult.rows[0];

        // Auto-create profile based on role
        if (role === 'patient') {
            const patientQuery = `
                INSERT INTO patient (user_id, first_name, last_name, gender, date_of_birth) 
                VALUES ($1, $2, $3, $4, $5) 
                RETURNING patient_id
            `;
            const patientResult = await client.query(patientQuery, [
                newUser.user_id,
                // username,
                'Patient', // Default first name
                '',
                'male', // Default value - can be updated later
                '1990-01-01' // Default value - can be updated later
            ]);
            newUser.patient_id = patientResult.rows[0].patient_id;

        } else if (role === 'doctor') {
            // Get the dummy/default department
            const defaultDeptResult = await client.query(
                'SELECT department_id FROM department WHERE department_name = $1',
                ['Unassigned'] // or 'General Practice'
            );

            // if (defaultDeptResult.rows.length === 0) {
            //     throw new Error('Default department "Unassigned" not found. Please ensure it exists.');
            // }

            let department_id;
            if (defaultDeptResult.rows.length === 0) {
                const newDept = await client.query(
                    `INSERT INTO department (department_name, description)
                    VALUES ($1, $2) RETURNING department_id`,
                    ['Unassigned', 'Default catch-all department for new doctors']
                );
                department_id = newDept.rows[0].department_id;
            } else {
                department_id = defaultDeptResult.rows[0].department_id;
            }


            const doctorQuery = `
            INSERT INTO doctor (user_id, department_id, first_name, last_name, gender) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING doctor_id`;

            const doctorResult = await client.query(doctorQuery, [
                newUser.user_id,
                defaultDeptResult.rows[0].department_id,
                'Doctor', // Default first name
                '', // last_name - can be updated later
                'male' // Default gender - required field
            ]);
            newUser.doctor_id = doctorResult.rows[0].doctor_id;
        }

        // Commit transaction
        await client.query('COMMIT');

        console.log('User and profile created successfully:', newUser);
        res.status(201).json(newUser);

    } catch (err) {
        // Rollback transaction on error
        await client.query('ROLLBACK');

        if (err.code === '23505') {
            return res.status(409).json({ error: "A user with this email already exists." });
        }

        console.error("Error creating user and profile:", err);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        client.release();
    }
};


// PATCH /api/users/:id
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, password, role, is_active } = req.body;

    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (username) {
        fields.push(`username = $${paramIndex++}`);
        values.push(username);
    }
    if (email) {
        fields.push(`email = $${paramIndex++}`);
        values.push(email);
    }
    if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        fields.push(`password = $${paramIndex++}`);
        values.push(hashedPassword);
    }
    if (role) {
        fields.push(`role = $${paramIndex++}`);
        values.push(role);
    }
    if (is_active !== undefined) {
        fields.push(`is_active = $${paramIndex++}`);
        values.push(is_active);
    }

    if (fields.length === 0) {
        return res.status(400).json({ error: "No fields provided for update." });
    }

    values.push(id);

    const query = `
    UPDATE "user" 
    SET ${fields.join(', ')} 
    WHERE user_id = $${paramIndex}
    RETURNING user_id, username, email, role, is_active
  `;

    try {
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: "A user with this email or username already exists." });
        }
        console.error("Error updating user:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// DELETE /api/users/:id (Soft Delete)
const deleteUser = async (req, res) => {
    const { id } = req.params;

    // deactivate the user
    const query = `
      UPDATE "user" 
      SET is_active = false 
      WHERE user_id = $1
      RETURNING user_id
    `;

    try {
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }
        res.status(204).send();
    } catch (err) {
        console.error("Error deactivating user:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
};