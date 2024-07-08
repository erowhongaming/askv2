require('../config/env-load'); // Ensure environment variables are loaded
const mysql = require('mysql2');

/**
 * Creates a connection to a MySQL database using the provided environment variables for host, username, password, database, and port.
 * If there is an error connecting to the database, it logs the error message. Otherwise, it logs a success message.
 * @returns {Object} The MySQL connection object.
 */

let connection;

const handleDisconnect = () => {
    connection = mysql.createConnection({
        host: process.env.MYSQL_PROD_HOST,
        user: process.env.MYSQL_PROD_USERNAME,
        password: process.env.MYSQL_PROD_PASSWORD,
        database: process.env.MYSQL_PROD_HRIS_DB,
        port: process.env.MSYQL_PROD_PORT, 
        connectTimeout: 60000
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to the database:', err.stack);
            setTimeout(handleDisconnect, 2000); // Retry connection after 2 seconds
        } else {
            console.log('Connected to the HREIS database.');
        }
    });

    connection.on('error', (err) => {
        console.error('Database error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNREFUSED' || err.code === 'ER_CON_COUNT_ERROR') {
            handleDisconnect(); // Reconnect on connection lost error
        } else {
            throw err;
        }
    });
};

handleDisconnect();

module.exports = connection;
