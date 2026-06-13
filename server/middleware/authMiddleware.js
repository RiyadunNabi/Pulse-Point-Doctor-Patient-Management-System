const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_key";

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Expect: Bearer TOKEN
    if (!token) return res.status(401).json({ error: 'Token missing' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token invalid' });
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
