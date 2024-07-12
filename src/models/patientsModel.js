const { Collection } = require('../models/collections');
const db = require('../config/ask-db');
require('../config/env-load');

const getByNum = require('../pipelines/getPatientByMobilenumber');
/**
 * Represents a Patients object with methods to fetch, search, and group patient details.
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
  },

  /**
   * Asynchronous function that validates a mobile number by OTP.
   * 
   * @param {string} mobilenumber The mobile number to validate
   * @param {string} otp The OTP to validate against
   * @returns {Promise} A Promise that resolves with the validation result
   * @throws {Error} If there is an error during OTP validation
   */
  validateMobilenumberByOTP: async (mobilenumber, otp) => {
    try {
      const query = 
      `SELECT count(*)  as find
      FROM mobile_otp_log_ask 
      WHERE mobile_number = ? 
      AND otp = ? 
      AND expires_at > NOW() 
      AND status = 'pending'
      order by id desc 
      limit 1`;
      
      return new Promise((resolve, reject) => {
        db.query(query, [mobilenumber, otp], (err, results) => {
            if (err) {
              console.error("Error executing query:", err);
              return reject(err);
            } else {
              return resolve(results);
            }  
          });
        });
        
    } catch (error) {
      console.error('Error:', error); // Log any errors
      throw error; // Throw the error for handling elsewhere if needed
    }
  },

  /**
 * Update the OTP status for a given mobile number in the database.
 * If the status is empty, it updates the status to 'expired' for entries with pending status and expired OTPs.
 * If a status is provided, it updates the status for the given mobile number and OTP.
 *
 * @param {string} mobilenumber - The mobile number for which OTP status needs to be updated.
 * @param {string} status - The new status to be set for the OTP entry.
 * @param {string} otp - The OTP value to match for updating status.
 * @returns {Promise} A Promise that resolves with the result of the update operation.
 * @throws {Error} If there is an error during the database query execution.
 */
  updateOTPStatusByMobilenumber: async (mobilenumber,status,otp) =>{
    try {
      if(status == ''){
        const query = 
          `UPDATE mobile_otp_log_ask 
          SET status = 'expired' 
          where mobile_number = ?
          AND expires_at < NOW()  
          AND status = 'pending'
          `;
        
        return new Promise((resolve, reject) => {
        db.query(query, [mobilenumber], (err, results) => {
            if (err) {
              console.error("Error executing query:", err);
              return reject(err);
            } else {
              return resolve(results);
            }  
          });
        });
        
      }else{
        const query = 
        `UPDATE mobile_otp_log_ask 
        SET status = ? 
        where mobile_number = ?
        AND otp = ?
        AND expires_at > NOW()  
        `;
      
      return new Promise((resolve, reject) => {
      db.query(query, [status,mobilenumber,otp], (err, results) => {
          if (err) {
            console.error("Error executing query:", err);
            return reject(err);
          } else {
            return resolve(results);
          }  
        });
      });
      }
     

    } catch (error) {
      console.error('Error:', error); // Log any errors
      throw error; // Throw the error for handling elsewhere if needed
    }
  },

  /**
 * Method: insertMobilenumberAndOTP
 * Description: Inserts a mobile number and OTP into the mobile_otp_log_ask table.
 * 
 * @param {string} mobilenumber - The mobile number to insert.
 * @param {string} otp - The OTP to insert.
 * @returns {Promise} A promise that resolves with the query results or rejects with an error.
 */
  insertMobilenumberAndOTP:  (mobilenumber, otp) => {
    try {
      const query = `INSERT INTO mobile_otp_log_ask (mobile_number, otp,expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ${process.env.OTP_EXPIRES}))`;
    
      return new Promise((resolve, reject) => {
      db.query(query, [mobilenumber, otp], (err, results) => {
          if (err) {
            console.error("Error executing query:", err);
            return reject(err);
          } else {
            return resolve(results);
          }  
        });
      });
      
    } catch (error) {
        console.error('Error:', error); // Log any errors
        throw error; // Throw the error for handling elsewhere if needed
    }
  },    
  logActivity: (module,ip_address) => {
    try {
        const query = `INSERT INTO tracking_module_logs (module_name,kiosk_ip) VALUES (?,?)`;

        return new Promise((resolve, reject) => {
            db.query(query, [module,ip_address], (err, results) => {
                if (err) {
                    console.error("Error executing query:", err);
                    return reject(err);
                } else {
                    return resolve(results);
                }
            });
        });

    } catch (error) {
        console.error('Error:', error); // Log any errors
        throw error; // Throw the error for handling elsewhere if needed
    }
}


};

module.exports = patients;
