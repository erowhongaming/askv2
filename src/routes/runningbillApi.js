
const express = require('express');
const Patients = require('../models/patientsModel');

const router = express.Router();
/**
 * Express route to validate if a patient is active based on mobile number.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - JSON response indicating if active patients are found or any server error.
 */
router.get('/api/validate/patients-is-active', async (req, res) => {
    const mobilenumber = req.query.mobilenumber || '';
    
    try {
        const results = await Patients.fetchPatientsByMobileNumber(mobilenumber);

        if (results.length === 0) {
            res.json({ msg: 'No active patients found', status:0 });
        } else {
            res.json({ msg: 'Patient(s) Found',status: 1 , results: results});
        }
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
});



module.exports = router;