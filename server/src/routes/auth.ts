import express from 'express';
import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/register', async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password } = req.body;

        // 1. Check if user already exists
        const userCheck = await pool.query(
        'SELECT * FROM users WHERE email = $1 OR username = $2',
        [email, username]
        );

        if (userCheck.rows.length > 0) {
        res.status(400).json({ error: 'User with that email or username already exists' });
        return;
        }

        // 2. Hash the password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 3. Insert the new user into the database
        const newUser = await pool.query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
        [username, email, passwordHash]
        );

        // 4. Return the created user (without the password hash!)
        res.status(201).json({
        message: 'User registered successfully',
        user: newUser.rows[0]
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// NEW LOGIN ROUTE
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // 1. Check if the user exists
        const userResult = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
        );

        if (userResult.rows.length === 0) {
        // SDE Security Standard: Never specify if the email or password was wrong.
        // Just say "Invalid credentials" to prevent hackers from guessing emails.
        res.status(401).json({ error: 'Invalid credentials' });
        return;
        }

        const user = userResult.rows[0];

        // 2. Compare the plain-text password to the stored hash
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
        }

        // 3. Generate the JWT (The VIP Pass)
        const payload = {
        user_id: user.id,
        username: user.username
        };

        // Sign the token using the secret from your .env file
        const token = jwt.sign(
        payload, 
        process.env.JWT_SECRET as string, 
        { expiresIn: '2h' } // Token expires in 2 hours
        );

        // 4. Send the token back to the user
        res.status(200).json({
        message: 'Login successful',
        token: token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;