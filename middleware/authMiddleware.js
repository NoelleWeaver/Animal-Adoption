const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/login'); // Redirect to login if no token
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecretKey');
        req.user = decoded; // Attach user info to the request
        next();
    } catch (err) {
        console.error("JWT verification failed:", err);
        res.redirect('/login');
    }
};

module.exports = authMiddleware;