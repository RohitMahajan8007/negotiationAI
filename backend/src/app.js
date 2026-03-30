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
app.use(express.static(path.join(process.cwd(), 'frontend/dist')));
app.use(express.static(path.join(process.cwd(), 'backend/public')));

app.get('*name', (req, res) => {
    const paths = [
        path.join(__dirname, '../public/index.html'),
        path.join(process.cwd(), 'frontend/dist/index.html'),
        path.join(process.cwd(), 'backend/public/index.html'),
        path.join(process.cwd(), 'public/index.html')
    ];
    
    console.log("[Cyber-Server] Entry Point Search Sequence:");
    paths.forEach(p => console.log(` - Checking: ${p} [${require('fs').existsSync(p) ? 'FOUND' : 'MISSING'}]`));

    for (const p of paths) {
        if (require('fs').existsSync(p)) {
            return res.sendFile(p);
        }
    }
    res.status(404).send('System Terminal Entry Point Not Found. Check build logs.');
});

// Error middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

module.exports = app;
