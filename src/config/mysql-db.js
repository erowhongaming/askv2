
 require('../config/env-load'); // Ensure environment variables are loaded
const mysql = require('mysql2');
/**
 * Creates a connection to a MySQL database using the provided environment variables for host, username, password, database, and port.
 * If there is an error connecting to the database, it logs the error message. Otherwise, it logs a success message.
 * @returns {Object} The MySQL connection object.
 */
const connection = mysql.createConnection({
  host: process.env.MYSQL_PROD_HOST,
  user: process.env.MYSQL_PROD_USERNAME,
  password: process.env.MYSQL_PROD_PASSWORD,
  database: process.env.MYSQL_PROD_HRIS_DB,
  port: process.env.MSYQL_PROD_PORT
});

/**
 * Arrow function that handles the connection callback for connecting to the database.
 * 
 * @param {Error} err - The error object, if any, that occurred during the connection.
 * @returns {void}
 */
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

module.exports = connection;
