const express = require("express");
const router = express.Router();
const { processCSVData } = require("../controllers/csvController");
const userController = require("../controllers/user.controller");

router.post(
  "/upload-csv",
  userController.authenticate,
  userController.authorize("admin", "super_admin"),
  async (req, res) => {
    const { csvData, fieldMappings } = req.body;
    const result = await processCSVData(csvData, fieldMappings);

    res.status(200).json(result);
  }
);

module.exports = router;
