require('../config/env-load'); // Ensure environment variables are loaded
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

let connection; // To hold the connection instance
let reconnecting = false; // To prevent multiple reconnection attempts

/**
 * Asynchronous function to connect to a MSSQL database using the provided configuration.
 * Includes reconnection logic if the initial connection fails or if the connection is lost.
 * 
 * @param {Function} [callback] - Optional callback function to be executed after the connection attempt.
 * @returns {Promise<void>} - A Promise that resolves when the connection is successful and rejects if there is an error.
 */
async function connectToDatabase(callback) {
    try {
        connection = await sql.connect(config);
        console.log('Connected successfully to MSSQL');
        reconnecting = false; // Reset reconnecting flag

        if (callback) {
            callback(null);
        }

        // Listen for disconnection and attempt to reconnect
        connection.on('error', async (err) => {
            console.error('MSSQL connection error:', err);
            if (!reconnecting) {
                reconnecting = true;
                await reconnect();
            }
        });

    } catch (err) {
        console.error('Failed to connect to MSSQL', err);
        if (callback) {
            callback(err);
        }
        setTimeout(connectToDatabase, 2000); // Retry connection after 2 seconds
    }
}

/**
 * Reconnect function to handle reconnection attempts.
 */
async function reconnect() {
    console.log('Attempting to reconnect to MSSQL...');
    try {
        await sql.close(); // Close existing connection
    } catch (err) {
        console.error('Error closing MSSQL connection:', err);
    }
    await connectToDatabase();
}

// Connect to the database initially
connectToDatabase();

module.exports = connectToDatabase;
