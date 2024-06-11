const { Collection } = require('../models/collections');
const getByNum = require('../pipelines/getPatientByMobilenumber');


/**
 * Represents a Patients object with methods to fetch, search, and group doctor details.
 * @type {Object}
 */
const patients = {

  /**
 * Asynchronous function that fetches patients by mobile number.
 * 
 * @param {string} mobilenumber The mobile number of the patient to fetch
 * @returns {Promise} A Promise that resolves with the result of fetching patients by mobile number
 * @throws {Error} If there is an error during database initialization or fetching patients
 */
  fetchPatientsByMobileNumber: async (mobilenumber) => {
    try {
      await Collection.initializeDb(); // Ensure the database is initialized
      const collection = await Collection.getCollection('patientvisits');
     
      const pipeline = getByNum(mobilenumber); // Assuming the pipeline function doesn't need parameters
      console.log('Pipeline:', pipeline); // Log the pipeline
      const result = await collection.aggregate(pipeline).toArray();
      console.log('Aggregation Result:', result); // Log the result
      return result; // Return the result
    } catch (error) {
      console.error('Error:', error); // Log any errors
      throw error; // Throw the error for handling elsewhere if needed
    }
  }
};


/** TEST
 * Asynchronous arrow function that initializes the database and fetches patients by mobile number.
 * 
 * @returns {Promise} A Promise that resolves with the result of fetching patients by mobile number.
 * @throws {Error} If there is an error during database initialization or fetching patients.
 */
// // // Ensure initialization is done before fetching
// (async () => {
//   try {
//     await Collection.initializeDb();
//     await patients.fetchPatientsByMobileNumber('09633245637');
//   } catch (error) {
//     console.error('Initialization or fetch error:', error);
//   }
// })();

module.exports = patients;
