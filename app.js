// app.js
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const oauthRoutes = require('./routes/oauthRoutes');
const connectDB = require('./db');
require('dotenv').config();

const app = express();
connectDB();
console.log('Connecting to:', process.env.MONGO_URL);
console.log('JWT_SECRET:',process.env.JWT_SECRET)
// Middleware para procesar JSON
app.use(bodyParser.json());

// Configurar rutas de autenticación
app.use('/auth', authRoutes);
app.use('/', oauthRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
