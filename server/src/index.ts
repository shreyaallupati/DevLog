import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import pool from './db.js';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';

dotenv.config();

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Wire up the auth routes
app.use('/api/auth', authRoutes);
// Wire up the post routes
app.use('/api/posts',postRoutes)

// Health Check & DB Connection Test Route
app.get('/api/health', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.status(200).json({ 
        status: 'Server is running', 
        db_time: result.rows[0].now 
        });
    } catch (err) {
        console.error('Database connection failed:', err);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// At the bottom of server/src/index.ts

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

// Export the Express API so Vercel can consume it as a serverless function
export default app;