// controllers/authController.js
const bcrypt = require('bcryptjs'); // Importar bcryptjs
const jwt = require('jsonwebtoken'); // Importar jsonwebtoken
const User = require('../models/userModel'); // Importar el modelo User

exports.register = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hashear la contraseña antes de guardar
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario
        const role = req.body.role || 'user'; // Por defecto asigna el rol 'user'
        const user = new User({ email, password: hashedPassword, role });


        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return res.status(400).json({ message: 'Invalid credentials' });

        const accessToken = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET, // Asegúrate de usar esta clave
            { expiresIn: '30m' }
        );

        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET, // Asegúrate de usar esta clave
            { expiresIn: '7d' }
        );

        user.refreshToken = refreshToken;
        await user.save();

        res.json({ accessToken, refreshToken });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh Token required' });
    }

    try {
        // Buscar el usuario con el refreshToken
        const user = await User.findOne({ refreshToken });
        if (!user) {
            return res.status(403).json({ message: 'Invalid Refresh Token' });
        }

        // Verificar el token
        jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid Refresh Token' });
            }

            // Generar un nuevo accessToken
            const accessToken = jwt.sign(
                { id: user._id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '15m' }
            );

            res.json({ accessToken });
        });
    } catch (error) {
        console.error('Error during token refresh:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.logout = async (req, res) => {
    const { refreshToken } = req.body;

    try {
        const user = await User.findOne({ refreshToken });
        if (!user) return res.status(403).json({ message: 'Invalid Refresh Token' });

        user.refreshToken = null; // Eliminar el token de la base de datos
        await user.save();

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Ruta para cambiar roles (solo para admin)
exports.updateRole = async (req, res) => {
    const { userId, newRole } = req.body;

    try {
        // Buscar el usuario en la base de datos
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Actualizar el rol del usuario
        user.role = newRole;
        await user.save();

        res.json({ message: 'Role updated successfully', user });
    } catch (error) {
        console.error('Error during role update:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
