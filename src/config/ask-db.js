require('../config/env-load'); // Ensure environment variables are loaded
const mysql = require('mysql2');

const config = {
  host: process.env.MYSQL_PROD_HOST,
  user: process.env.MYSQL_PROD_USERNAME,
  password: process.env.MYSQL_PROD_PASSWORD,
  database: process.env.ASK_DB,
  port: process.env.MSYQL_PROD_PORT
};

let connection;

/**
 * Function to establish a connection to the MySQL database.
 */
const connectToDatabase = () => {
  connection = mysql.createConnection(config);

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the Ask database:', err.stack);
      setTimeout(connectToDatabase, 2000); // Retry connection after 2 seconds
    } else {
      console.log('Connected to the Ask database.');
    }
  });

  connection.on('error', (err) => {
    console.error('ASK Database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNREFUSED' || err.code === 'ER_CON_COUNT_ERROR') {
      connectToDatabase(); // Reconnect on connection lost error
    } else {
      throw err;
    }
  });
};

// Initial connection attempt
connectToDatabase();

module.exports = connection;
