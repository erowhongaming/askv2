const express = require('express');
const Patients = require('../models/patientsModel');
const helper = require('../services/helper');
const router = express.Router();
require('../config/env-load');

const bodyParser = require('body-parser')

// create application/json parser
const jsonParser = bodyParser.json()
/**
 * Express route to validate if a patient is active based on mobile number using POST request.
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
            res.json({ msg: 'No active patients found', status: 0 });
        } else {
            res.json({ msg: 'Patient(s) Found', status: 1, results: results, expires_at: process.env.OTP_EXPIRES+'(S)' });
        }
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
});
/**
 * Middleware function to parse incoming JSON data from requests.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {void}
 */
router.post('/api/generate/otp',jsonParser, async (req, res) => {
    const mobilenumber = req.body.mobilenumber || '';
    
    try {
        if (mobilenumber === '') {
            res.json({ msg: 'No mobile number', status: 0 });
        } else {
            const otp = await helper.generateOTP();
            const insertLog = await Patients.insertMobilenumberAndOTP(mobilenumber,otp);
            
           
            console.log('Generated OTP:', otp);
          
            res.json({ msg: 'OTP generated and sent', status: 1, otp: otp });
        }
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
});

/**
 * Middleware function to parse incoming JSON data from requests.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {void}
 */
router.post('/api/generate/validate-otp-by-mobilenumber',jsonParser, async (req , res) => {
    const otp = req.body.otp || '';
    const mobilenumber = req.body.mobilenumber || '';
 
    try {
        // Update expired otp
        await Patients.updateOTPStatusByMobilenumber(mobilenumber,'');
        const result = await Patients.validateMobilenumberByOTP(mobilenumber, otp);
        console.log(result);
        if(result[0].find > 0){ // Update expired otp
            await Patients.updateOTPStatusByMobilenumber(mobilenumber,'verified',otp);  
            res.json({ msg: 'verified',status: 1});
        }else{
            res.json({ msg: 'not found',status: 0, expires_at: process.env.OTP_EXPIRES+'(S)' });
        }
        console.log(result);
    }catch(error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
});

module.exports = router;