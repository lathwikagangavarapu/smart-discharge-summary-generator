const mysql = require('mysql2/promise');

// Database configuration
// Update these values with your MySQL credentials
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'discharge_summary_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test the connection
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Database connected successfully!');
        connection.release();
    } catch (error) {
        console.error('Error connecting to database:', error.message);
        console.log('Please make sure MySQL is running and credentials are correct.');
    }
};

// Export pool and test function
module.exports = {
    pool,
    testConnection
};
