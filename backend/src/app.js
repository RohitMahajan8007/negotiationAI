const express = require('express');
const cors = require('cors');
const path = require('path');
const negotiationRoutes = require('./routers/negotiation.routes');
const authRoutes = require('./routers/auth.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Request Logging
app.use((req, res, next) => {
    console.log(`[Cyber-Server] ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/negotiation', negotiationRoutes);
app.use('/api/auth', authRoutes);

// Static files for frontend
app.use(express.static(path.join(__dirname, '../public')));

app.get('*name', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

module.exports = app;
