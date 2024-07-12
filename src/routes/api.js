/**
 * Express router configuration for handling various API endpoints related to doctors.
 * Includes routes for fetching doctor details, searching doctors by specialization, 
 * searching doctors by specialization and subspecialization, and fetching grouped specializations.
 * Utilizes async/await for handling asynchronous operations and error handling.
 */

const express = require('express');
const Doctor = require('../models/doctorsModel');

const Patients = require('../models/patientsModel');
const router = express.Router();

const bodyParser = require('body-parser')

// create application/json parser
const jsonParser = bodyParser.json()
/**
 * Route to handle GET request for fetching doctor details.
 * Retrieves doctor details using Doctor.getDetails() method and sends the results as a JSON response.
 * If an error occurs, it sends a 500 status with an error message.
 */
router.get('/api/doctors', async (req, res) => {
    try {
        const results = await Doctor.getDetails();

      
        const withRooms = await  Doctor.getRooms(results);

      
        res.json(withRooms);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch doctor details" });
    }
});

/**
 * Perform a search operation based on the provided query parameter.
 * 
 * @param {Object} req - The request object containing the query parameter.
 * @param {Object} res - The response object to send back the search results.
 * @returns {Object} - The search results in JSON format.
 * @throws {Object} - Returns an error object if the search operation fails.
 */
router.get('/api/doctors/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ error: "Query parameter 'q' is required." });
        }
        // Search the indexed data using wildcard search for multiple terms
        const results = await Doctor.search(query);
        //const withRooms = await  Doctor.getRooms(results);
        res.json(results);
    } catch (err) {
        console.error("Error performing search:", err);
        res.status(500).json({ error: "Failed to perform search" });
    }
});




/**
 * Retrieves doctors based on the provided specialization.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - Returns a JSON response with the doctors matching the provided specialization.
 * @throws {Error} - If there is an error while fetching or processing the data.
 */
router.get('/api/doctors/search-by-specialization', async (req, res) => {
    const specialization = req.query.specialization || '';
    const results = await Doctor.searchBySpecialization(specialization);
    res.json(results);
});


router.get('/api/doctors/preData', async (req,res) =>{
    const results = await Doctor.getPreData();
    res.json(results);
});

/**
 * Retrieves doctors based on the provided specialization, sub-specialization, and search value.
 * 
 * @param {string} specialization - The main specialization of the doctors to search for.
 * @param {string} subSpecialization - The sub-specialization of the doctors to search for.
 * @param {string} searchVal - The search value to filter the results.
 * @returns {Object} - The list of doctors matching the provided criteria.
 * @throws {Error} - If there is an error while fetching the doctors.
 */
router.get('/api/doctors/search-by-specialization-with-subspecialization', async (req, res) => {
    const specialization = req.query.specialization || '';
    const subSpecialization = req.query.subSpecialization || '';
    const searchVal = req.query.searchVal || '';
    const results = await Doctor.searchBySpecializationWithSubspecialization(specialization, subSpecialization,searchVal);
    //const withRooms = await  Doctor.getRooms(results);
    res.json(results);
});



/**
 * Asynchronously initializes grouped specializations for doctors.
 * Logs a message when the initialization is successful.
 * Logs an error message if the initialization fails.
 */
Doctor.getDoctorsGroupedBySpecialization().then(() => {
    console.log('Grouped specializations initialized');
}).catch(err => {
    console.error('Failed to initialize grouped specializations:', err);
});


/**
 * Retrieves grouped specializations based on the provided specialization query parameter.
 * 
 * @param {Object} req - The request object containing the query parameters.
 * @param {Object} res - The response object used to send the response.
 * @returns {Object} - An array of grouped specializations filtered based on the provided specialization.
 * @throws {Error} - If there is an error fetching or filtering the grouped specializations.
 */
router.get('/api/doctors/grouped-specializations', async (req, res) => {
    const { specialization } = req.query;
    try {
        // Await the result of getDoctorsGroupedBySpecialization()
        const groupedSpecializations = await Doctor.getDoctorsGroupedBySpecialization();
        // Filter the grouped specializations
        const filteredSpecializations = groupedSpecializations.filter(group => 
            group.specialization.toLowerCase().includes(specialization.toLowerCase())
        );
        res.json(filteredSpecializations);
    } catch (error) {
        console.error('Error fetching grouped specializations:', error);
        res.status(500).json({ error: 'Failed to fetch grouped specializations' });
    }
});


router.get('/api/hmos',async (req, res) => {
    try {
        const results = await Doctor.getHmos();
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch hmos list" });
    }
});


router.post('/api/activity-log',jsonParser, async (req, res) => {
    const module = req.body.module || ''; 
    const ip_address = req.ip || req.socket.remoteAddress; 
    try {
        await Patients.logActivity(module,ip_address);  
        res.json({msg:1,results:'user activity logged'});
    } catch (err) {
        res.status(500).json({ error: "Failed to saved activity logs" });
    }
});




module.exports = router;
