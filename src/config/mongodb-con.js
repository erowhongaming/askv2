/**
 * Asynchronous functions to connect to and close the connection with a MongoDB server.
 * 
 * @async
 * @function connectToDB
 * @returns {Promise} A promise that resolves to the MongoDB database object upon successful connection.
 * 
 * @async
 * @function closeDB
 * @returns {Promise} A promise that resolves when the connection to the MongoDB server is closed.
 */

const { MongoClient } = require('mongodb');
require('../config/env-load');

const url = process.env.MONGODB_CON;
const client = new MongoClient(url, { connectTimeoutMS: 30000 });
const dbName = 'arcusairdb';


/**
 * Asynchronous function to connect to a MongoDB server using a pre-defined client and database name.
 * 
 * @returns {Promise} A promise that resolves to the connected MongoDB database.
 * @throws {Error} If failed to connect to the MongoDB server.
 */
async function connectToDB() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB server');
    const db = client.db(dbName);
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB server:', error);
    throw error;
  }
}
/**
 * Asynchronous function to close the connection to a MongoDB server.
 * It attempts to close the client connection and logs a message upon disconnection.
 * If an error occurs during the process, it logs the error and throws it.
 */
async function closeDB() {
  try {
    if (client) {
      await client.close();
      console.log('Disconnected from MongoDB server');
    }
  } catch (error) {
    console.error('Failed to close connection to MongoDB server:', error);
    throw error;
  }
}

module.exports = { connectToDB, closeDB };
