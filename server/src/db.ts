import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Supabase requires SSL for external connections
    ssl: {
        rejectUnauthorized: false 
    }
});

export default pool;