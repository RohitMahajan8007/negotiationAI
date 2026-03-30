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

// REDUNDANT STATIC SERVING
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(process.cwd(), 'frontend/dist')));
app.use(express.static(path.join(process.cwd(), 'backend/public')));
app.use(express.static(path.join(process.cwd(), 'public')));

// ✅ RESILIENT ENTRY POINT RESOLVER
app.get('*any', (req, res) => {
    const rootPath = process.cwd();
    const paths = [
        path.join(__dirname, '../public/index.html'),
        path.join(rootPath, 'frontend/dist/index.html'),
        path.join(rootPath, 'backend/public/index.html'),
        path.join(rootPath, 'public/index.html')
    ];
    
    console.log("[Cyber-Server] Entry Point Search Sequence:");
    paths.forEach(p => console.log(` - Checking: ${p} [${require('fs').existsSync(p) ? 'FOUND' : 'MISSING'}]`));

    for (const p of paths) {
        if (require('fs').existsSync(p)) {
            return res.sendFile(p);
        }
    }
    
    res.status(404).send(`System Entry Point Not Found. Checked 4 paths. Backend Root: ${rootPath}`);
});

// Error middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

module.exports = app;