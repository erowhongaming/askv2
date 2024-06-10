/**
 * Asynchronous function to connect to a MSSQL database using the provided configuration.
 * 
 * @param {Function} callback - Optional callback function to handle connection result/error.
 */
require('../config/env-load');
const sql = require('mssql');

const config = {
    server: process.env.MSSQL_SERVER,
    database: process.env.MSSQL_DB,
    user: process.env.MSSQL_USER,
    password: process.env.MSSQL_PASSWORD,
    options: {
        encrypt: false // For Azure
    }
};

/**
 * Asynchronous function to connect to a MSSQL database using the provided configuration.
 * 
 * @param {Function} callback - Optional callback function to be executed after the connection attempt.
 * @returns {Promise<void>} - A Promise that resolves when the connection is successful and rejects if there is an error.
 */
async function connectToDatabase(callback) {
    try {
        
        
        await sql.connect(config);
        console.log('Connected successfully to MSSQL');
        if (callback) {
            callback(null);
        }
    } catch (err) {
        console.error('Failed to connect to MSSQL', err);
        if (callback) {
            callback(err);
        }
    }
}

// connectToDatabase();

module.exports = connectToDatabase;
