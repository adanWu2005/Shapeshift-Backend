const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden. Invalid token.' });
        }
        req.user = user; 
        next(); 
    });
};

module.exports = verifyToken;
