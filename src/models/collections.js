/**
 * A module that handles database operations using MongoDB.
 * Includes methods to initialize the database connection, get a collection, and update a collection.
 */
const { connectToDB } = require('../config/mongodb-con');

let db;
/**
 * Asynchronous functions for initializing a database connection, retrieving a collection by name,
 * and updating a collection with provided filter and update data.
 * If the database connection is not initialized, it will be initialized before retrieving the collection.
 * Logs success messages for successful operations and throws errors if any operation fails.
 *
 * @param {string} collectionName - The name of the collection to work with.
 * @param {object} filter - The filter criteria for updating the collection.
 * @param {object} update - The data to update in the collection.
 * @returns {Promise} A promise that resolves to the result of the update operation.
 * @throws {Error} If there is an error during database operations.
 */
const Collection = {
  initializeDb: async () => {
    if (!db) {
      db = await connectToDB();
    }
    return db;
  },
  /**
   * Asynchronous function to get a collection by name and update it with the provided filter and update.
   * If the database connection is not initialized, it will be initialized before getting the collection.
   * Logs success message if collection is retrieved successfully, otherwise logs and throws an error.
   *
   * @param {string} collectionName - The name of the collection to retrieve.
   * @param {object} filter - The filter criteria for updating the collection.
   * @param {object} update - The update object to apply to the collection.
   * @returns {Promise} A promise that resolves to the result of updating the collection.
   */
  getCollection: async (collectionName) => {
    try {
      if (!db) {
        await Collection.initializeDb();
      }
      console.log(`Success getCollection: ${collectionName}`);
      return db.collection(collectionName);
    } catch (error) {
      console.error(`Failed to get collection: ${collectionName}`, error);
      throw error;
    }
  },

  /**
   * Asynchronous function to update a collection in the database.
   * 
   * @param {string} collectionName - The name of the collection to update.
   * @param {object} filter - The filter to find the document to update.
   * @param {object} update - The data to update in the document.
   * @returns {Promise} A promise that resolves to the result of the update operation.
   * @throws {Error} If there is an error updating the collection.
   */
  updateCollection: async (collectionName, filter, update) => {
    try {
      const collection = await Collection.getCollection(collectionName);
      const result = await collection.updateOne(filter, { $set: update });
      return result;
    } catch (error) {
      console.error(`Failed to update collection: ${collectionName}`, error);
      throw error;
    }
  }
};

module.exports = { Collection, db };
