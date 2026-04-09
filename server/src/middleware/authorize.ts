import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 1. Extend the Express Request type to include our user payload
export interface AuthRequest extends Request {
    user?: string | jwt.JwtPayload;
}

// 2. The Bouncer Function
export const authorize = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
        // Standard format: "Bearer eyJhbGciOi..."
        const authHeader = req.header('Authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Access denied. No token provided.' });
        return;
        }

        // Extract the actual token string (may be undefined if malformed)
        const token = authHeader.split(' ')[1];

        if (!token) {
            res.status(401).json({ error: 'Access denied. No token provided.' });
            return;
        }

        // Ensure the secret is present in env (avoid passing undefined to jwt.verify)
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('JWT secret not configured');
            res.status(500).json({ error: 'Server misconfiguration' });
            return;
        }

        // Verify the token using our secret
        const decoded = jwt.verify(token, secret) as string | jwt.JwtPayload;

        // Attach the decoded user data (user_id, username) to the request!
        req.user = decoded;

        // Tell Express to move on to the actual route handler
        next(); 
    } catch (error) {
        // If the token is fake, expired, or tampered with, it throws an error
        res.status(403).json({ error: 'Invalid or expired token.' });
    }
};