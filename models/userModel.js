// models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }, // Campo único
    password: { type: String, required: true }, // Contraseña hasheada
    role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Enum para roles válidos
    permissions: { type: [String], default: [] }, // Lista de permisos
    refreshToken: { type: String } // Token de refresco opcional
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
