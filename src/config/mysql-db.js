// Require dotenv and load .env file
const path = require('path');
const dotenv = require('dotenv');
const result = dotenv.config({ path: path.resolve(__dirname, '../../.env') });

if (result.error) {
  console.error('Error loading .env file:', result.error);
} else {
  console.log('.env file loaded successfully');
}


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
