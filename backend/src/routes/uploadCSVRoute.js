const express = require('express');
const router = express.Router();
const dbConnect = require('../utils/dbConnect');
const { processCSVData } = require('../controllers/csvController');

router.post('/upload-csv', async (req, res) => {
  await dbConnect();

  const { csvData, fieldMappings } = req.body;
  const result = await processCSVData(csvData, fieldMappings);

  res.status(200).json(result);
});

module.exports = router;
