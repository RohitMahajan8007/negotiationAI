const express = require('express');
const cors = require('cors');
const path = require('path');
const negotiationRoutes = require('./routers/negotiation.routes');
const authRoutes = require('./routers/auth.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Logging
app.use((req, res, next) => {
    console.log(`[Cyber-Server] ${req.method} ${req.url}`);
    next();
});

// API Routes
app.use('/api/negotiation', negotiationRoutes);
app.use('/api/auth', authRoutes);

// Static files for frontend
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

app.get('*path', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// Error middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

module.exports = app;