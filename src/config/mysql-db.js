
 require('../config/env-load'); // Ensure environment variables are loaded
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.MYSQL_PROD_HOST,
  user: process.env.MYSQL_PROD_USERNAME,
  password: process.env.MYSQL_PROD_PASSWORD,
  database: process.env.MYSQL_PROD_HRIS_DB,
  port: process.env.MSYQL_PROD_PORT
});


connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

module.exports = connection;
