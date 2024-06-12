// backend/routes/api/uploadCsv.js
const express = require('express');
const router = express.Router();
const Lead = require('../models/lead.model');
const Company = require('../models/company.model');

// Helper function to calculate trust score
const calculateTrustScore = (date) => {
  const now = new Date();
  const parsedDate = new Date(date);
  const timeDifference = Math.abs(now.getTime() - parsedDate.getTime());
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  return Math.max(0, 100 - daysDifference); // Example calculation
};

router.post('/upload-csv', async (req, res) => {
  try {
    const leads = req.body;
    let recordsCreated = 0;
    let recordsUpdated = 0;
    let errors = 0;

    for (const leadData of leads) {
      const trustScore = calculateTrustScore(leadData.trustScore);

      // Check if lead already exists
      let lead = await Lead.findOne({ linkedInUrl: leadData.linkedInUrl, email: leadData.email });

      if (lead) {
        // Update existing lead
        await Lead.updateOne({ _id: lead._id }, { $set: leadData, trustScore });
        recordsUpdated++;
      } else {
        // Create new lead
        const newLead = new Lead({ ...leadData, trustScore });
        await newLead.save();
        recordsCreated++;
      }
    }

    res.json({ recordsCreated, recordsUpdated, errors });
  } catch (error) {
    console.error('Error processing CSV data:', error);
    res.status(500).json({ error: 'Error processing CSV data' });
  }
});

module.exports = router;
