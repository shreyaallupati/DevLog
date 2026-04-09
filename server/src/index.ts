import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Wire up the auth routes
app.use('/api/auth', authRoutes); // <-- All routes in auth.ts will start with /api/auth

app.use('/api/posts',postRoutes) // <-- All routes in posts.ts will start with /api/posts

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