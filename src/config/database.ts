import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database configuration
const dbConfig: PoolConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: false, // Set to true if you need SSL
    max: 20, // Maximum number of clients in pool
    idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
    connectionTimeoutMillis: 2000, // How long to wait for a connection
};

// Create connection pool
const pool = new Pool(dbConfig);

// Handle pool errors
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Test connection function
export const testConnection = async (): Promise<boolean> => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        client.release();
        console.log('Database connected successfully at:', result.rows[0].now);
        return true;
    } catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
};

// Query function with error handling
export const query = async (text: string, params?: any[]): Promise<any> => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('Query error:', error);
        throw error;
    }
};

// Get a client from the pool for transactions
export const getClient = async () => {
    return await pool.connect();
};

// Close all connections
export const closePool = async (): Promise<void> => {
    await pool.end();
    console.log('Database pool has ended');
};

export default pool;
