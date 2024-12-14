
const AuthorizationCode = require('../models/authorizationCodeModel');
const jwt = require('jsonwebtoken'); // Importar jsonwebtoken

const { v4: uuidv4 } = require('uuid');

exports.authorize = async (req, res) => {
    const { clientId, redirectUri, scope } = req.query;

    // Validar que todos los campos requeridos estén presentes
    if (!clientId || !redirectUri) {
        return res.status(400).json({ message: 'Missing clientId or redirectUri' });
    }

    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Generar un código de autorización único
        const code = require('crypto').randomBytes(20).toString('hex');

        // Guardar el código de autorización
        await AuthorizationCode.create({
            code,
            userId: req.user.id,
            clientId,
            redirectUri,
            scope
        });

        // Redirigir al cliente con el código de autorización
        res.redirect(`${redirectUri}?code=${code}`);
    } catch (error) {
        console.error('Error during authorization:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.token = async (req, res) => {
    const { code, clientId, redirectUri } = req.body;

    try {
        const authCode = await AuthorizationCode.findOne({ code, clientId, redirectUri });
        if (!authCode) return res.status(400).json({ message: 'Invalid authorization code' });

        // Generar tokens (JWT)
        const accessToken = jwt.sign(
            { id: authCode.userId, clientId },
            process.env.JWT_SECRET,
            { expiresIn: '30m' }
        );

        const refreshToken = jwt.sign(
            { id: authCode.userId, clientId },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Eliminar el código de autorización (ya no es necesario)
        await AuthorizationCode.deleteOne({ code });

        res.json({ accessToken, refreshToken });
    } catch (error) {
        console.error('Error during token exchange:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
