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
        // Search the indexed data using wildcard search
        const results = await Doctor.search(query);
        res.json(results);
    } catch (err) {
        console.error("Error performing search:", err);
        res.status(500).json({ error: "Failed to perform search" });
    }
});

module.exports = router;
