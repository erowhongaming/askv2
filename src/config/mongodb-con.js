require('../config/env-load'); // Ensure environment variables are loaded
// Require the mongodb package
const { MongoClient } = require('mongodb');

// Connection URI
const uri = "mongodb://incusdba:incus%40123@10.12.0.27:45431";

// Database Name
const dbName ="arcusairdb";

// Connect to MongoDB
MongoClient.connect(uri)
  .then(client => {
    // console.log(uri);
    // const db = client.db(dbName);
    // console.log('Connected to MongoDB');

    // Perform operations here

    client.close();
  })
  .catch(error => {
    console.log(uri);
    console.error('Error connecting to MongoDB:', error);
  });
