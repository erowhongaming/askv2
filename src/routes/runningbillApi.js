const express = require('express');
const Patients = require('../models/patientsModel');
const PatientBill = require('../models/runningBillModel');
const helper = require('../services/helper');
const sms_snapp = require('../services/sms');
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
          
                const authResult = await sms_snapp.getAuthoken();
                const token = authResult.token;
              
                // Send SMS using the obtained token
                const smsResult = await sms_snapp.sendSms(token, `Your OTP is: ${otp}, Please use this OTP to Sign In to Inpatient Portal.`,mobilenumber);
               
                console.log('Send SMS:', smsResult);
          
            res.json({ msg: 'OTP generated and sent', status: 1});
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
            const details = await Patients.fetchPatientsByMobileNumber(mobilenumber);
            res.json({ msg: 'verified',status: 1,details: details});
        }else{
            res.json({ msg: 'not found',status: 0, expires_at: process.env.OTP_EXPIRES+'(S)' });
        }
        console.log(result);
    }catch(error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
});


router.post('/api/runningbill/results',jsonParser, async (req, res) => {
    const patientvisituid = req.body.patientvisituid|| '';
    
    try {
        const result = await PatientBill.getResults(patientvisituid);
        console.log("getResults():Get results success!");
        res.json({ result: result,msg: 'Success'});
    }catch(error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
});


router.post('/api/runningbill/charges',jsonParser, async (req, res) => {
    const patientvisituid = req.body.patientvisituid|| '';
    
    try {
        const result = await PatientBill.getResults(patientvisituid); 
     
        const charges = await PatientBill.getCharges(result);
        const total_deposits = await PatientBill.getDeposits(patientvisituid);
        const total_refunds = await PatientBill.getRefunds(patientvisituid);
      
         console.log("getCharges():Get charges success!");
        res.json({ result: charges,total_refunds_and_deposits:{deposits:total_deposits,refunds:total_refunds},msg: 'Success'});
    }catch(error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
});



router.post('/api/runningbill/deposits',jsonParser, async (req, res) => {
    const patientvisituid = req.body.patientvisituid|| '';
    
    try {
        const result = await PatientBill.getDeposits(patientvisituid);
        console.log("getResults():Get deposits success!");
        res.json({ result: result,msg: 'Success'});
    }catch(error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
});


router.post('/api/runningbill/refunds',jsonParser, async (req, res) => {
    const patientvisituid = req.body.patientvisituid|| '';
    
    try {
        const result = await PatientBill.getRefunds(patientvisituid);
        console.log("getResults():Get Refunds success!");
        res.json({ result: result,msg: 'Success'});
    }catch(error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
});




module.exports = router;
