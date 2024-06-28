const { Collection } = require('../models/collections');


const getRefunds = require('../pipelines/getPatientBillRefunds');
const getResults = require('../pipelines/getPatientBillResults');
const getDeposits = require('../pipelines/getPatientBillDeposits');


const patientBill= {
    getRefunds: async (patientvisituid) => {
        try {
            await Collection.initializeDb(); // Ensure the database is initialized
            const collection = await Collection.getCollection('depositrefundapprovals');
           
            const pipeline = getRefunds(patientvisituid); // Assuming the pipeline function doesn't need parameters
            console.log('Pipeline:', pipeline); // Log the pipeline
            const result = await collection.aggregate(pipeline).toArray();
            console.log('Aggregation Result:', result); // Log the result
            return result; // Return the result
          } catch (error) {
            console.error('Error:', error); // Log any errors
            throw error; // Throw the error for handling elsewhere if needed
          }
    },
    getResults: async (patientvisituid) => {
        try {
          
            await Collection.initializeDb(); // Ensure the database is initialized
            const collection = await Collection.getCollection('patientchargecodes');
           
            const pipeline = getResults(patientvisituid); // Assuming the pipeline function doesn't need parameters
            console.log('Pipeline:', pipeline); // Log the pipeline
            const result = await collection.aggregate(pipeline).toArray();
            console.log('Aggregation Result:', result); // Log the result
            return result; // Return the result
          } catch (error) {
            console.error('Error:', error); // Log any errors
            throw error; // Throw the error for handling elsewhere if needed
          }
    },
    getDeposits : async (patientvisituid) => {
        try {
            await Collection.initializeDb(); // Ensure the database is initialized
            const collection = await Collection.getCollection('deposits');
           
            const pipeline = getRefunds(patientvisituid); // Assuming the pipeline function doesn't need parameters
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


//Test
//patientBill.getResults('6677c630166b7147a72f03a4');

module.exports = patientBill;