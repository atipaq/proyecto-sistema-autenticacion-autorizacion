// routes/oauthRoutes.js
const express = require('express');
const { authorize, token } = require('../controllers/oauthController');
const { authenticateUser } = require('../middlewares/authMiddleware');

const router = express.Router();

// Solicitar autorización
router.get('/oauth/authorize', authenticateUser, authorize);

// Intercambiar código de autorización por tokens
router.post('/oauth/token', token);

module.exports = router;
