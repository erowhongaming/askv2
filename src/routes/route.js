const express = require('express');
const Doctor = require('../models/doctorsModel');

const router = express.Router();

router.get('/api/doctors', (req, res) => {
    Doctor.getDetails((err, results) => {
      if (err) {
        return res.status(500).json({ error: "Failed to fetch doctor details" });
      }
      res.json(results);
    });
  });

module.exports = router;