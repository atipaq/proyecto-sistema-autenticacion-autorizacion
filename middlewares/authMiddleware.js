// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

exports.authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });

        req.user = user; // Almacena los datos del usuario en req.user
        next();
    });
};

exports.authorizeRole = (requiredRole) => (req, res, next) => {
    const { role } = req.user;

    if (role !== requiredRole) {
        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }

    next();
};

exports.authorizePermission = (requiredPermission) => (req, res, next) => {
    const { permissions } = req.user;

    if (!permissions.includes(requiredPermission)) {
        return res.status(403).json({ message: 'Access denied. Missing required permission.' });
    }

    next();
};

exports.authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        req.user = user; // Usuario autenticado
        next();
    });
};
