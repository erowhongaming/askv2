const express = require('express');
const Doctor = require('../models/doctorsModel');

const router = express.Router();

router.get('/api/doctors', async (req, res) => {
    try {
        const results = await Doctor.getDetails();
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch doctor details" });
    }
});

router.get('/api/doctors/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ error: "Query parameter 'q' is required." });
        }
        // Search the indexed data using wildcard search for multiple terms
        const results = await Doctor.search(query);
        res.json(results);
    } catch (err) {
        console.error("Error performing search:", err);
        res.status(500).json({ error: "Failed to perform search" });
    }
});

// Endpoint to search doctors by specialization
router.get('/api/doctors/search-by-specialization', async (req, res) => {
    const specialization = req.query.specialization || '';
    const results = await Doctor.searchBySpecialization(specialization);
    res.json(results);
});

// Endpoint to search doctors by specialization and subspecialization
router.get('/api/doctors/search-by-specialization-with-subspecialization', async (req, res) => {
    const specialization = req.query.specialization || '';
    const subSpecialization = req.query.subSpecialization || '';
    const searchVal = req.query.searchVal || '';
    const results = await Doctor.searchBySpecializationWithSubspecialization(specialization, subSpecialization,searchVal);
    res.json(results);
});




Doctor.getDoctorsGroupedBySpecialization().then(() => {
    console.log('Grouped specializations initialized');
}).catch(err => {
    console.error('Failed to initialize grouped specializations:', err);
});
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
module.exports = router;
