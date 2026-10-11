const jwt = require('jsonwebtoken');

function protect(req, res, next) {
    // Get token from cookie or Authorization header
    let token = req.cookies.accessToken;

    if (!token && req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        // ✅ Pin algorithm — prevent alg:none attacks
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ['HS256']
        });
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

module.exports = { protect };