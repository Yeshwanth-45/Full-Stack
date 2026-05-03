const mysql = require('mysql2/promise');
const logger = require('../utils/logger');

// Create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'foodiehub',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Test connection
pool.getConnection()
    .then(connection => {
        logger.info('✅ MySQL Database connected successfully');
        connection.release();
    })
    .catch(err => {
        logger.error('❌ Database connection failed:', err.message);
    });

// Helper function for transactions
const transaction = async (callback) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
        const result = await callback(connection);
        await connection.commit();
        connection.release();
        return result;
    } catch (error) {
        await connection.rollback();
        connection.release();
        throw error;
    }
};

module.exports = {
    query: (sql, params) => pool.execute(sql, params),
    pool,
    transaction
};
