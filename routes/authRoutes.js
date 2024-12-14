// routes/authRoutes.js
const express = require('express');
const { register, login, refreshToken, logout, updateRole } = require('../controllers/authController');
const { authenticateJWT, authorizeRole, authorizePermission } = require('../middlewares/authMiddleware');
const router = express.Router();

// Ruta para registrar usuarios
router.post('/register', register);

// Ruta para iniciar sesión
router.post('/login', login);

// Ruta para renovar el token de acceso
router.post('/refresh', refreshToken);

// Ruta protegida como ejemplo
router.get('/protected', authenticateJWT, (req, res) => {
    res.json({ message: `Welcome ${req.user.email}`, user: req.user });
});  

router.get('/user', authenticateJWT, authorizeRole('user'), (req, res) => {
    res.json({ message: `Hello, user ${req.user.email}` });
});

router.get('/admin', authenticateJWT, authorizeRole('admin'), (req, res) => {
    res.json({ message: `Welcome, admin ${req.user.email}` });
});

router.post('/update-role', authenticateJWT, authorizeRole('admin'), updateRole);

router.post('/logout', logout);

router.get('/view-reports', authenticateJWT, authorizePermission('VIEW_REPORTS'), (req, res) => {
    res.json({ message: 'Access granted to view reports.' });
});

module.exports = router;
