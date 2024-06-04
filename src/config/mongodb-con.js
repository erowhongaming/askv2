require('../config/env-load');
const mongoose = require('mongoose');

// Define the URI variable
const uri = process.env.MONGODB_CON;

// Connect to MongoDB using the promise returned by mongoose.connect()
mongoose.connect(uri)
  .then(() => {
    console.log('Connected to the MongoDb.');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error.stack);
  });

// Export the Mongoose instance for further use
module.exports = mongoose;