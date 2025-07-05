const pool = require('../db/connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Secret should be stored in .env
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_key";

// POST /api/auth/login
// const login = async (req, res) => {
//     const { email, password } = req.body;
//     if (!email || !password)
//         return res.status(400).json({ error: "Email and password required." });

//     try {
//         const userResult = await pool.query(
//             'SELECT * FROM "user" WHERE email = $1',
//             [email]
//         );
//         if (userResult.rows.length === 0)
//             return res.status(401).json({ error: "Invalid email or password." });

//         const user = userResult.rows[0];
//         const valid = await bcrypt.compare(password, user.password);
//         if (!valid)
//             return res.status(401).json({ error: "Invalid email or password." });

//         // Never send password in token or response!
//         const payload = {
//             user_id: user.user_id,
//             username: user.username,
//             role: user.role,
//         };
//         const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });

//         res.json({ token, user: payload });
//     } catch (err) {
//         console.error("Login error:", err);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: "Email and password required." });

    try {
        const userResult = await pool.query(
            'SELECT * FROM "user" WHERE email = $1',
            [email]
        );
        if (userResult.rows.length === 0)
            return res.status(401).json({ error: "Invalid email or password." });

        const user = userResult.rows[0];
        const valid = await bcrypt.compare(password, user.password);
        if (!valid)
            return res.status(401).json({ error: "Invalid email or password." });

        // Find role-specific id (patient_id or doctor_id)
        let patient_id = null;
        let doctor_id = null;
        if (user.role === "patient") {
            let pat = await pool.query(
                'SELECT patient_id FROM patient WHERE user_id = $1',
                [user.user_id]
            );

            if (pat.rows.length) {
                patient_id = pat.rows[0].patient_id;
            } else {
                // Auto-create patient profile
                const newPatient = await pool.query(
                    'INSERT INTO patient (user_id, first_name, last_name) VALUES ($1, $2, $3) RETURNING patient_id',
                    [user.user_id, user.username || 'Patient', '']
                );
                patient_id = newPatient.rows[0].patient_id;
                console.log('Created new patient profile with ID:', patient_id);
            }
        } else if (user.role === "doctor") {
            const doc = await pool.query(
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
            // add more if needed
        };

        const payload = {
            user_id: user.user_id,
            username: user.username,
            role: user.role,
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });

        res.json({ token, user: userData });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};



module.exports = { login };
