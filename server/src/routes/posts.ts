import express from 'express';
import type { Request, Response } from 'express';
import pool from '../db.js';
import { authorize } from '../middleware/authorize.js'; 
import type{  AuthRequest } from '../middleware/authorize.js'; 
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Single POST route: supports optional file upload (coverImage).
// The request MUST pass through authorize before running the async function.
router.post('/', authorize, upload.single('coverImage'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Multer will populate req.file when multipart/form-data with a file is sent.
        // For application/json requests, express.json() (registered globally) will populate req.body.
        const { title, content } = req.body || {};

        if (!title || !content) {
            res.status(400).json({ error: 'Missing required fields: title and content' });
            return;
        }

        const userPayload = req.user as any; 
        const authorId = userPayload.user_id;

        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const newPost = await pool.query(
            'INSERT INTO posts (user_id, title, content, cover_image_path) VALUES ($1, $2, $3, $4) RETURNING *',
            [authorId, title, content, imagePath]
        );

        res.status(201).json({
            message: 'Post created successfully',
            post: newPost.rows[0]
        });

    } catch (error) {
        console.error('Post creation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Fetch all posts (Public Route)
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        // SDE Skill: Joining tables to get the author's username alongside the post data
        const result = await pool.query(`
        SELECT 
            posts.id, 
            posts.title, 
            posts.content, 
            posts.cover_image_path, 
            posts.created_at,
            users.username AS author
        FROM posts
        JOIN users ON posts.user_id = users.id
        ORDER BY posts.created_at DESC;
        `);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Fetch posts error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Fetch posts ONLY for the logged-in user (Protected Route)
router.get('/me', authorize, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userPayload = req.user as any;
        const authorId = userPayload.user_id;

        const result = await pool.query(`
        SELECT 
            posts.id, 
            posts.title, 
            posts.content, 
            posts.cover_image_path, 
            posts.created_at,
            users.username AS author
        FROM posts
        JOIN users ON posts.user_id = users.id
        WHERE posts.user_id = $1
        ORDER BY posts.created_at DESC;
        `, [authorId]);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Fetch user posts error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a post (Protected Route)
router.delete('/:id', authorize, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const postId = req.params.id;
        const userPayload = req.user as any; 
        const authorId = userPayload.user_id;

        // SDE Security Standard: Attempt to delete, but ONLY if the user_id matches.
        // If someone tries to delete a post they don't own, the WHERE clause fails silently, 
        // and rows.length will be 0.
        const deleteResult = await pool.query(
        'DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING *',
        [postId, authorId]
        );

        if (deleteResult.rows.length === 0) {
        res.status(403).json({ error: 'Not authorized to delete this post, or post not found.' });
        return;
        }

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;