const mongoose = require('mongoose');

const authorizationCodeSchema = new mongoose.Schema({
    code: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    clientId: { type: String, required: true },
    redirectUri: { type: String, required: true },
    scope: { type: String } // Opcional
}, { timestamps: true });

module.exports = mongoose.model('AuthorizationCode', authorizationCodeSchema);

