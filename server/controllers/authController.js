const pool = require('../db/connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Secret should be stored in .env
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_key";

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: "Email and password required." });

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const userResult = await client.query(
            'SELECT * FROM "user" WHERE email = $1',
            [email]
        );
        if (userResult.rows.length === 0){
            await client.query('ROLLBACK');
            return res.status(401).json({ error: "Invalid email or password." });
        }
        const user = userResult.rows[0];

        
        const valid = await bcrypt.compare(password, user.password);
        if (!valid){
            await client.query('ROLLBACK');
            return res.status(401).json({ error: "Invalid email or password." });
        }

        // Find role-specific id (patient_id or doctor_id)
        let patient_id = null;
        let doctor_id = null;
        if (user.role === "patient") {
            let pat = await client.query(
                'SELECT patient_id FROM patient WHERE user_id = $1',
                [user.user_id]
            );

            if (pat.rows.length) {
                patient_id = pat.rows[0].patient_id;
            } else {
                // Auto-create patient profile
                const newPatient = await client.query(
                    'INSERT INTO patient (user_id, first_name, last_name) VALUES ($1, $2, $3) RETURNING patient_id',
                    [user.user_id, user.username || 'Patient', '']
                );
                patient_id = newPatient.rows[0].patient_id;
                console.log('Created new patient profile with ID:', patient_id);
            }
        } else if (user.role === "doctor") {
            const doc = await client.query(
                'SELECT doctor_id FROM doctor WHERE user_id = $1',
                [user.user_id]
            );
            if (doc.rows.length) doctor_id = doc.rows[0].doctor_id;
        }

        // Build userData
        const userData = {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            role: user.role,
            patient_id,
            doctor_id,
        };

        await client.query('COMMIT');

        const payload = {
            user_id: user.user_id,
            username: user.username,
            role: user.role,
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });

        res.json({ token, user: userData });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Login error:", err);
        res.status(500).json({ error: "Internal server error" });
    } finally {
    client.release();
    }
};



module.exports = { login };
