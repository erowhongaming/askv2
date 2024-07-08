const { MongoClient } = require('mongodb');
require('../config/env-load');

const url = process.env.MONGODB_CON;
const client = new MongoClient(url, { 
    connectTimeoutMS: 30000
});
const dbName = 'arcusairdb';

let db; // To hold the database instance
let reconnecting = false; // To prevent multiple reconnection attempts

/**
 * Asynchronous function to connect to a MongoDB server using a pre-defined client and database name.
 * Includes reconnection logic if the initial connection fails or if the connection is lost.
 * 
 * @returns {Promise} A promise that resolves to the connected MongoDB database.
 * @throws {Error} If failed to connect to the MongoDB server.
 */
async function connectToDB() {
  if (db && client.isConnected()) {
    return db; // Return the existing connection if it's already established
  }

  try {
    await client.connect();
    console.log('Connected successfully to MongoDB server');
    db = client.db(dbName);

    // Listen for disconnection and attempt to reconnect
    client.on('close', async () => {
      console.error('MongoDB connection lost. Attempting to reconnect...');
      if (!reconnecting) {
        reconnecting = true;
        await reconnect();
      }
    });

    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB server:', error);
    setTimeout(connectToDB, 2000); // Retry connection after 2 seconds
    throw error;
  }
}

/**
 * Reconnect function to handle reconnection attempts.
 */
async function reconnect() {
  console.log('Attempting to reconnect to MongoDB...');
  try {
    await client.close(); // Close existing connection
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
  }
  await connectToDB();
  reconnecting = false; // Reset reconnecting flag after successful reconnection
}

/**
 * Asynchronous function to close the connection to a MongoDB server.
 * It attempts to close the client connection and logs a message upon disconnection.
 * If an error occurs during the process, it logs the error and throws it.
 * 
 * @returns {Promise} A promise that resolves when the connection to the MongoDB server is closed.
 */
async function closeDB() {
  try {
    if (client && client.isConnected()) {
      await client.close();
      console.log('Disconnected from MongoDB server');
    }
  } catch (error) {
    console.error('Failed to close connection to MongoDB server:', error);
    throw error;
  }
}

module.exports = { connectToDB, closeDB };
